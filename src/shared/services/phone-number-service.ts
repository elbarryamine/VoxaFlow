import type { SupabaseClient } from "@supabase/supabase-js";
import { buyDedicatedTwilioNumber } from "@/src/shared/integrations/twilio";

interface PlanRow {
  plan: "free" | "paid";
}

interface PhoneNumberRow {
  id: string;
  e164: string;
  friendly_name: string;
  provider: "system" | "twilio";
  kind: "shared" | "dedicated";
  is_active: boolean;
}

export interface ResolvedPhoneNumber {
  id: string;
  number: string;
  friendlyName: string;
  provider: "system" | "twilio";
  kind: "shared" | "dedicated";
}

async function getUserPlan(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("user_plans")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle<PlanRow>();

  if (error) {
    throw new Error(`Unable to read user plan: ${error.message}`);
  }

  return data?.plan ?? "free";
}

async function getSharedNumber(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("phone_numbers")
    .select("id, e164, friendly_name, provider, kind, is_active")
    .eq("kind", "shared")
    .eq("is_active", true)
    .limit(1)
    .single<PhoneNumberRow>();

  if (error) {
    throw new Error(`Unable to read shared phone number: ${error.message}`);
  }

  return data;
}

async function getAssignedDedicatedNumber(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_phone_assignments")
    .select("phone_numbers:phone_number_id(id, e164, friendly_name, provider, kind, is_active)")
    .eq("user_id", userId)
    .maybeSingle<{
      phone_numbers: PhoneNumberRow | null;
    }>();

  if (error) {
    throw new Error(`Unable to read assigned phone number: ${error.message}`);
  }

  return data?.phone_numbers ?? null;
}

async function assignNewDedicatedNumber(supabase: SupabaseClient, userId: string) {
  const purchased = await buyDedicatedTwilioNumber();
  const { data: createdNumber, error: createError } = await supabase
    .from("phone_numbers")
    .insert({
      e164: purchased.phoneNumber,
      friendly_name: purchased.friendlyName,
      provider: "twilio",
      kind: "dedicated",
      twilio_sid: purchased.sid,
      is_active: true,
    })
    .select("id, e164, friendly_name, provider, kind, is_active")
    .single<PhoneNumberRow>();

  if (createError) {
    throw new Error(`Unable to persist purchased phone number: ${createError.message}`);
  }

  const { error: assignError } = await supabase.from("user_phone_assignments").insert({
    user_id: userId,
    phone_number_id: createdNumber.id,
  });

  if (assignError) {
    throw new Error(`Unable to assign dedicated number: ${assignError.message}`);
  }

  return createdNumber;
}

function toResolvedNumber(numberRow: PhoneNumberRow): ResolvedPhoneNumber {
  return {
    id: numberRow.id,
    number: numberRow.e164,
    friendlyName: numberRow.friendly_name,
    provider: numberRow.provider,
    kind: numberRow.kind,
  };
}

export async function getOrAssignPhoneNumber(
  supabase: SupabaseClient,
  userId: string,
) {
  const plan = await getUserPlan(supabase, userId);

  if (plan === "free") {
    const shared = await getSharedNumber(supabase);
    return {
      plan,
      phoneNumber: toResolvedNumber(shared),
    };
  }

  const assigned = await getAssignedDedicatedNumber(supabase, userId);
  if (assigned) {
    return {
      plan,
      phoneNumber: toResolvedNumber(assigned),
    };
  }

  const newlyAssigned = await assignNewDedicatedNumber(supabase, userId);
  return {
    plan,
    phoneNumber: toResolvedNumber(newlyAssigned),
  };
}
