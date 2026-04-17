import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { data, error } = await supabase
      .from("workflows")
      .select("id, name, description, is_active, created_at, agent_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<
        Array<{
          id: string;
          name: string;
          description: string;
          is_active: boolean;
          created_at: string;
          agent_id: string;
        }>
      >();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      workflows: (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        status: row.is_active ? "active" : "inactive",
        agentId: row.agent_id,
        agentName: "Assigned Agent",
        runsCount: 0,
        lastRun: "Never",
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch workflows" },
      { status: 500 },
    );
  }
}
