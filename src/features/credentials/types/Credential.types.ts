export interface Credential {
  id: string;
  name: string;
  service: CredentialService;
  created_at: string;
}

export type CredentialService = "openai" | "slack" | "http" | "resend";
