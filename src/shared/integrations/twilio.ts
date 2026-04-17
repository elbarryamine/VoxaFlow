import { getTwilioEnv } from "@/src/shared/server/env";

export interface PurchasedTwilioNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
}

async function twilioRequest(
  path: string,
  init?: RequestInit,
): Promise<Record<string, unknown>> {
  const { accountSid, authToken } = getTwilioEnv();
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Basic ${credentials}`,
        ...(init?.headers ?? {}),
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Twilio request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as Record<string, unknown>;
}

export async function buyDedicatedTwilioNumber(
  countryCode = "US",
): Promise<PurchasedTwilioNumber> {
  const available = await twilioRequest(
    `/AvailablePhoneNumbers/${countryCode}/Local.json?VoiceEnabled=true&PageSize=1`,
  );

  const candidates = available.available_phone_numbers as
    | Array<Record<string, unknown>>
    | undefined;
  const selected = candidates?.[0];

  if (!selected || typeof selected.phone_number !== "string") {
    throw new Error("No Twilio voice-enabled number available for purchase");
  }

  const payload = new URLSearchParams({ PhoneNumber: selected.phone_number });
  const purchased = await twilioRequest("/IncomingPhoneNumbers.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  const sid = purchased.sid;
  const phoneNumber = purchased.phone_number;

  if (typeof sid !== "string" || typeof phoneNumber !== "string") {
    throw new Error("Unexpected Twilio response while purchasing phone number");
  }

  return {
    sid,
    phoneNumber,
    friendlyName:
      typeof purchased.friendly_name === "string"
        ? purchased.friendly_name
        : `VoxFlow Dedicated ${phoneNumber}`,
  };
}
