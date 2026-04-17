import { getVapiEnv } from "@/src/shared/server/env";

interface VapiCallRequest {
  to: string;
  from: string;
  agent: {
    name: string;
    instructions: string;
    voice: string;
    language: string;
  };
}

export interface VapiCallResponse {
  id: string;
  status: string;
}

export async function startVapiCall(
  payload: VapiCallRequest,
): Promise<VapiCallResponse> {
  const { apiKey } = getVapiEnv();

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: {
        number: payload.to,
      },
      phoneNumber: {
        number: payload.from,
      },
      assistant: {
        name: payload.agent.name,
        firstMessage: "Hello, this is your VoxFlow assistant.",
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: payload.agent.instructions,
            },
          ],
        },
        voice: {
          provider: "openai",
          voiceId: payload.agent.voice,
        },
        transcriber: {
          provider: "deepgram",
          language: payload.agent.language,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vapi call creation failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as Record<string, unknown>;
  const id = json.id;
  const status = json.status;

  if (typeof id !== "string") {
    throw new Error("Unexpected Vapi response: missing call id");
  }

  return {
    id,
    status: typeof status === "string" ? status : "queued",
  };
}
