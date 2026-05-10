"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextInput, SelectInput, SectionDivider } from "./shared";
import { Timer } from "@phosphor-icons/react/dist/ssr";

const DELAY_UNITS = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
];

export const DelayConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const unit = String(data.delayUnit ?? "seconds");
  const rawAmount = Number(data.delayAmount ?? 10);

  // Convert displayed amount to seconds for executor
  const handleAmountChange = (v: string) => {
    onUpdate("delayAmount", v);
    const secs = unit === "minutes" ? Number(v) * 60 : Number(v);
    onUpdate("seconds", String(Math.min(secs, 300)));
  };

  const handleUnitChange = (v: string) => {
    onUpdate("delayUnit", v);
    const secs = v === "minutes" ? rawAmount * 60 : rawAmount;
    onUpdate("seconds", String(Math.min(secs, 300)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
        <Timer className="mt-0.5 h-5 w-5 shrink-0 text-primary" weight="duotone" />
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Pauses the workflow for the specified duration before triggering downstream nodes.
          Maximum delay is <strong className="text-foreground">5 minutes (300s)</strong>.
        </p>
      </div>

      <SectionDivider label="Duration" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="delay-amount">Amount</FieldLabel>
          <TextInput
            id="delay-amount"
            value={String(data.delayAmount ?? "10")}
            onChange={handleAmountChange}
            placeholder="10"
          />
        </div>
        <div>
          <FieldLabel htmlFor="delay-unit">Unit</FieldLabel>
          <SelectInput
            id="delay-unit"
            value={unit}
            onChange={handleUnitChange}
            options={DELAY_UNITS}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/70">
        Executor will pause for{" "}
        <strong className="text-foreground">
          {unit === "minutes" ? rawAmount * 60 : rawAmount}s
        </strong>{" "}
        (capped at 300s).
      </p>
    </div>
  );
};
