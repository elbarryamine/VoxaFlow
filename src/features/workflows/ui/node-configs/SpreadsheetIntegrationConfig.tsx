"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput, SectionDivider, CredentialPicker } from "./shared";

const WRITE_MODE_OPTIONS = [
  { value: "append", label: "Append Row" },
  { value: "upsert", label: "Upsert by Key" },
];

export const SpreadsheetIntegrationConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  return (
    <div className="space-y-4">
      <CredentialPicker
        service="google"
        value={data.credentialId as string | undefined}
        onChange={(id) => onUpdate("credentialId", id)}
      />

      <SectionDivider label="Sheet Settings" />

      <div>
        <FieldLabel htmlFor="spreadsheet-id">Spreadsheet ID</FieldLabel>
        <TextInput
          id="spreadsheet-id"
          value={String(data.spreadsheetId ?? "")}
          onChange={(value) => onUpdate("spreadsheetId", value)}
          placeholder="sales-leads"
        />
      </div>

      <div>
        <FieldLabel htmlFor="spreadsheet-tab">Sheet Tab</FieldLabel>
        <TextInput
          id="spreadsheet-tab"
          value={String(data.spreadsheetTab ?? "")}
          onChange={(value) => onUpdate("spreadsheetTab", value)}
          placeholder="Leads"
        />
      </div>

      <div>
        <FieldLabel htmlFor="spreadsheet-write-mode">Write Mode</FieldLabel>
        <SelectInput
          id="spreadsheet-write-mode"
          value={String(data.writeMode ?? "append")}
          onChange={(value) => onUpdate("writeMode", value)}
          options={WRITE_MODE_OPTIONS}
        />
      </div>
    </div>
  );
};
