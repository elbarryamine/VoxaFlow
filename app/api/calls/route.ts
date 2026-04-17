import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { data, error } = await supabase
      .from("calls")
      .select("id, to_number, from_number, status, created_at, vapi_call_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<
        Array<{
          id: string;
          to_number: string;
          from_number: string;
          status: string;
          created_at: string;
          vapi_call_id: string | null;
        }>
      >();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      calls: (data ?? []).map((row) => ({
        id: row.id,
        toNumber: row.to_number,
        fromNumber: row.from_number,
        status: row.status,
        createdAt: row.created_at,
        vapiCallId: row.vapi_call_id,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch calls" },
      { status: 500 },
    );
  }
}
