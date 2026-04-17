import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";
import { getOrAssignPhoneNumber } from "@/src/shared/services/phone-number-service";

export async function POST() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const result = await getOrAssignPhoneNumber(supabase, user.id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to resolve phone number" },
      { status: 400 },
    );
  }
}
