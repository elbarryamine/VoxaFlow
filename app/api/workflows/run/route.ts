import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";
import { runWorkflow } from "@/src/shared/services/workflow-service";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const body = (await request.json()) as {
      triggerType?: string;
      payload?: Record<string, unknown>;
    };

    if (!body.triggerType) {
      return NextResponse.json({ error: "triggerType is required" }, { status: 400 });
    }

    const results = await runWorkflow(
      supabase,
      user.id,
      body.triggerType,
      body.payload ?? {},
    );

    return NextResponse.json({ runs: results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to run workflows" },
      { status: 400 },
    );
  }
}
