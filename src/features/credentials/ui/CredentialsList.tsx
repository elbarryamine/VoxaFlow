import { CredentialCard } from "./CredentialCard";
import {
  CREDENTIAL_SERVICE_ORDER,
  getCredentialServiceConfig,
} from "../constants/CREDENTIAL_SERVICES";
import type { Credential, CredentialService } from "../types/Credential.types";

interface CredentialsListProps {
  credentials: Credential[];
  deletingId: string | null;
  onDelete: (id: string) => void;
}

export const CredentialsList = ({
  credentials,
  deletingId,
  onDelete,
}: CredentialsListProps) => {
  const grouped = CREDENTIAL_SERVICE_ORDER.reduce(
    (acc, service) => {
      const items = credentials.filter((c) => c.service === service);
      if (items.length > 0) acc[service] = items;
      return acc;
    },
    {} as Partial<Record<CredentialService, Credential[]>>,
  );

  const unknown = credentials.filter(
    (c) => !CREDENTIAL_SERVICE_ORDER.includes(c.service as CredentialService),
  );

  const sections: { key: string; label: string; items: Credential[] }[] = [
    ...CREDENTIAL_SERVICE_ORDER.filter((s) => grouped[s]?.length).map(
      (service) => ({
        key: service,
        label: getCredentialServiceConfig(service).label,
        items: grouped[service]!,
      }),
    ),
  ];

  if (unknown.length > 0) {
    sections.push({ key: "other", label: "Other", items: unknown });
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.key}>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-newsreader text-lg font-bold text-on-surface">
              {section.label}
            </h2>
            <div className="h-px flex-1 bg-border/50" />
            <span className="font-manrope text-[12px] font-semibold text-on-surface-variant">
              {section.items.length} credential
              {section.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.items.map((cred) => (
              <CredentialCard
                key={cred.id}
                credential={cred}
                onDelete={onDelete}
                isDeleting={deletingId === cred.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
