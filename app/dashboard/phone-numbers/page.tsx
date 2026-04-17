"use client";

import { useState } from "react";
import { Phone } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { MOCK_PHONE_NUMBERS } from "@/src/features/phone-numbers/constants/MOCK_PHONE_NUMBERS";
import { PhoneNumberCard } from "@/src/features/phone-numbers/ui/PhoneNumberCard";
import type { PhoneNumber as AppPhoneNumber } from "@/src/features/phone-numbers/types/PhoneNumber.types";

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<AppPhoneNumber[]>(MOCK_PHONE_NUMBERS);
  const [isGettingNumber, setIsGettingNumber] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleGetNumber = async () => {
    setIsGettingNumber(true);
    setInfoMessage(null);
    await Promise.resolve();
    setInfoMessage("Demo mode: numbers are static mock data.");
    setPhoneNumbers(MOCK_PHONE_NUMBERS);
    setIsGettingNumber(false);
  };

  return (
    <PageLayout
      title="Phone Numbers"
      description="Manage your voice-enabled numbers"
      actions={
        <button
          onClick={handleGetNumber}
          disabled={isGettingNumber}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Phone className="h-4 w-4" />
          {isGettingNumber ? "Getting..." : "Get Number"}
        </button>
      }
    >
      {infoMessage ? <p className="mb-4 text-sm text-success">{infoMessage}</p> : null}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {phoneNumbers.map((pn) => (
          <PhoneNumberCard key={pn.id} phoneNumber={pn} />
        ))}
      </div>
    </PageLayout>
  );
}
