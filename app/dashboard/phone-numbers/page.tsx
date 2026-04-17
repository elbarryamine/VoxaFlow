"use client";

import { useEffect, useState } from "react";
import { Phone } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui";
import { PhoneNumberCard, type PhoneNumber as AppPhoneNumber } from "@/src/features/phone-numbers";

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<AppPhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingNumber, setIsGettingNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPhoneNumbers() {
      try {
        const response = await fetch("/api/phone-numbers");
        const payload = (await response.json()) as {
          phoneNumbers?: AppPhoneNumber[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load phone numbers");
        }

        if (mounted) {
          setPhoneNumbers(payload.phoneNumbers ?? []);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load phone numbers",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPhoneNumbers();
    return () => {
      mounted = false;
    };
  }, []);

  const handleGetNumber = async () => {
    setIsGettingNumber(true);
    setErrorMessage(null);
    setInfoMessage(null);
    try {
      const response = await fetch("/api/phone-numbers/get", { method: "POST" });
      const payload = (await response.json()) as {
        phoneNumber?: { id: string };
        plan?: "free" | "paid";
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to assign number");
      }

      setInfoMessage(
        payload.plan === "paid"
          ? "Dedicated number assigned to your account."
          : "Using shared free-tier number.",
      );

      const reloadResponse = await fetch("/api/phone-numbers");
      const reloadPayload = (await reloadResponse.json()) as {
        phoneNumbers?: AppPhoneNumber[];
      };
      setPhoneNumbers(reloadPayload.phoneNumbers ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to assign number");
    } finally {
      setIsGettingNumber(false);
    }
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
      {isLoading ? <p className="text-sm text-muted-foreground">Loading numbers...</p> : null}
      {errorMessage ? <p className="mb-4 text-sm text-danger">{errorMessage}</p> : null}
      {infoMessage ? <p className="mb-4 text-sm text-success">{infoMessage}</p> : null}
      {!isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {phoneNumbers.map((pn) => (
            <PhoneNumberCard key={pn.id} phoneNumber={pn} />
          ))}
        </div>
      ) : null}
    </PageLayout>
  );
}
