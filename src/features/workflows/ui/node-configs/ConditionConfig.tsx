"use client";

import { GitFork } from "@phosphor-icons/react/dist/ssr";

import {
  FieldLabel,
  SelectInput,
  TextInput,
  TextAreaInput,
  SectionDivider,
  type NodeConfigProps,
} from "./shared";

const CONDITION_TYPE_OPTIONS = [
  { value: "ai", label: "AI decides Yes / No" },
  { value: "field", label: "Field rule" },
];

const CONDITION_FIELD_OPTIONS = [
  { value: "leadScore", label: "leadScore" },
  { value: "intent", label: "intent" },
  { value: "sentiment", label: "sentiment" },
];

const CONDITION_OPERATOR_OPTIONS = [
  { value: "=", label: "equals" },
  { value: "!=", label: "does not equal" },
  { value: "contains", label: "contains" },
  { value: ">=", label: "greater or equal" },
  { value: "<=", label: "less or equal" },
];

export const ConditionConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const conditionType = (data.conditionType as string) ?? "ai";
  const aiConditionPrompt = (data.aiConditionPrompt as string) ?? "";
  const conditionField = (data.conditionField as string) ?? "leadScore";
  const conditionOperator = (data.conditionOperator as string) ?? "=";
  const conditionValue = (data.conditionValue as string) ?? "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-400/20 dark:bg-amber-500/5">
        <GitFork className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
          Routes the flow into Yes or No.
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="conditionType">How to decide</FieldLabel>
        <SelectInput
          id="conditionType"
          value={conditionType}
          onChange={(v) => onUpdate("conditionType", v)}
          options={CONDITION_TYPE_OPTIONS}
        />
      </div>

      {conditionType === "ai" && (
        <>
          <SectionDivider label="AI Prompt" />
          <div>
            <FieldLabel htmlFor="aiConditionPrompt">
              What should the AI evaluate?
            </FieldLabel>
            <TextAreaInput
              id="aiConditionPrompt"
              value={aiConditionPrompt}
              onChange={(v) => onUpdate("aiConditionPrompt", v)}
              placeholder={`Is this lead qualified?\n\nYES if the caller expressed purchase intent and has budget.\nNO otherwise.`}
              rows={5}
            />
            {!aiConditionPrompt && (
              <p className="mt-1.5 text-[11px] font-medium text-warning">
                Required — tell the AI what to check.
              </p>
            )}
          </div>
        </>
      )}

      {conditionType === "field" && (
        <>
          <SectionDivider label="Field Rule" />

          <div>
            <FieldLabel htmlFor="conditionField">If</FieldLabel>
            <SelectInput
              id="conditionField"
              value={conditionField}
              onChange={(v) => onUpdate("conditionField", v)}
              options={CONDITION_FIELD_OPTIONS}
            />
          </div>

          <div>
            <FieldLabel htmlFor="conditionOperator">Operator</FieldLabel>
            <SelectInput
              id="conditionOperator"
              value={conditionOperator}
              onChange={(v) => onUpdate("conditionOperator", v)}
              options={CONDITION_OPERATOR_OPTIONS}
            />
          </div>

          <div>
            <FieldLabel htmlFor="conditionValue">Value</FieldLabel>
            <TextInput
              id="conditionValue"
              value={conditionValue}
              onChange={(v) => onUpdate("conditionValue", v)}
              placeholder="qualified"
            />
          </div>
        </>
      )}
    </div>
  );
};
