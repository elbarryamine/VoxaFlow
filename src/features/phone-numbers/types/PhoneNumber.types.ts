export type PhoneNumberProvider = "ours" | "external";
export type PhoneNumberStatus = "active" | "inactive" | "pending";
export type PhoneNumberCapability = "voice" | "sms" | "fax";

export interface PhoneNumber {
  id: string;
  number: string;
  friendlyName: string;
  country: string;
  countryCode: string;
  provider: PhoneNumberProvider;
  status: PhoneNumberStatus;
  capabilities: PhoneNumberCapability[];
  assignedAgent: string | null;
  monthlyCallCount: number;
  createdAt: string;
}
