import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: assignedRows, error: assignedError } = await supabase
      .from("user_phone_assignments")
      .select("phone_numbers:phone_number_id(id, e164, friendly_name, provider, kind, is_active, created_at)")
      .eq("user_id", user.id)
      .returns<
        Array<{
          phone_numbers: {
            id: string;
            e164: string;
            friendly_name: string;
            provider: "system" | "twilio";
            kind: "shared" | "dedicated";
            is_active: boolean;
            created_at: string;
          };
        }>
      >();

    if (assignedError) {
      throw new Error(assignedError.message);
    }

    const { data: sharedRows, error: sharedError } = await supabase
      .from("phone_numbers")
      .select("id, e164, friendly_name, provider, kind, is_active, created_at")
      .eq("kind", "shared")
      .eq("is_active", true)
      .returns<
        Array<{
          id: string;
          e164: string;
          friendly_name: string;
          provider: "system" | "twilio";
          kind: "shared" | "dedicated";
          is_active: boolean;
          created_at: string;
        }>
      >();

    if (sharedError) {
      throw new Error(sharedError.message);
    }

    const mapRow = (row: {
      id: string;
      e164: string;
      friendly_name: string;
      provider: "system" | "twilio";
      kind: "shared" | "dedicated";
      is_active: boolean;
      created_at: string;
    }) => ({
      id: row.id,
      number: row.e164,
      friendlyName: row.friendly_name,
      provider: row.provider === "twilio" ? "twilio" : "ours",
      status: row.is_active ? "active" : "inactive",
      capabilities: ["voice"],
      assignedAgent: null,
      monthlyCallCount: 0,
      createdAt: row.created_at,
      kind: row.kind,
    });

    return NextResponse.json({
      phoneNumbers: [
        ...((assignedRows ?? []).map((row) => mapRow(row.phone_numbers))),
        ...(sharedRows ?? []).map(mapRow),
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch phone numbers" },
      { status: 500 },
    );
  }
}
