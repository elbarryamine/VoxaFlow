import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";
import { startCall } from "@/src/shared/services/call-service";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const body = (await request.json()) as {
      agentId?: string;
      toNumber?: string;
      workflowId?: string;
    };

    if (!body.agentId || !body.toNumber) {
      return NextResponse.json(
        { error: "agentId and toNumber are required" },
        { status: 400 },
      );
    }

    const call = await startCall(supabase, {
      userId: user.id,
      agentId: body.agentId,
      toNumber: body.toNumber,
      workflowId: body.workflowId,
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start call" },
      { status: 400 },
    );
  }
}
