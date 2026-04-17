import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/shared/server/auth";
import { createAgent, listAgents } from "@/src/shared/services/agent-service";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const agents = await listAgents(supabase, user.id);

    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch agents" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      instructions?: string;
      voice?: string;
      language?: string;
      status?: "active" | "inactive" | "draft";
    };

    const createdAgent = await createAgent(supabase, user.id, {
      name: body.name ?? "",
      description: body.description ?? "",
      instructions: body.instructions ?? "",
      voice: body.voice ?? "nova",
      language: body.language ?? "en",
      status: body.status,
    });

    return NextResponse.json({ agent: createdAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create agent" },
      { status: 400 },
    );
  }
}
