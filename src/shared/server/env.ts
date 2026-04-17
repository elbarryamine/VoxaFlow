function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getTwilioEnv() {
  return {
    accountSid: readRequiredEnv("TWILIO_ACCOUNT_SID"),
    authToken: readRequiredEnv("TWILIO_AUTH_TOKEN"),
  };
}

export function getVapiEnv() {
  return {
    apiKey: readRequiredEnv("VAPI_API_KEY"),
  };
}

export function getFreeTierDailyLimit() {
  const rawLimit = process.env.FREE_TIER_DAILY_CALL_LIMIT ?? "3";
  const parsedLimit = Number.parseInt(rawLimit, 10);

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    throw new Error("FREE_TIER_DAILY_CALL_LIMIT must be a positive integer");
  }

  return parsedLimit;
}
