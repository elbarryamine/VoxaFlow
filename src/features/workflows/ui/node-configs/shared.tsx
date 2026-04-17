"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}

export const FieldLabel = ({ children, htmlFor, hint }: FieldLabelProps) => (
  <div className="mb-1.5 flex items-baseline justify-between">
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </label>
    {hint && (
      <span className="text-[10px] text-muted-foreground/60">{hint}</span>
    )}
  </div>
);

interface TextInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  disabled,
}: TextInputProps) => (
  <input
    id={id}
    type="text"
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    onChange={(e) => onChange(e.currentTarget.value)}
    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
  />
);

interface TextAreaInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaInput = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextAreaInputProps) => (
  <textarea
    id={id}
    value={value}
    placeholder={placeholder}
    rows={rows}
    onChange={(e) => onChange(e.currentTarget.value)}
    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring"
  />
);

interface SelectInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectInput = ({
  id,
  value,
  onChange,
  options,
  placeholder,
}: SelectInputProps) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition-colors focus:border-ring"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <CaretDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
);

interface SectionDividerProps {
  label: string;
}

export const SectionDivider = ({ label }: SectionDividerProps) => (
  <div className="flex items-center gap-2 pt-2">
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
      {label}
    </span>
    <div className="h-px flex-1 bg-border" />
  </div>
);

export interface NodeConfigProps {
  data: Record<string, unknown>;
  onUpdate: (
    field: string,
    value: string | number | boolean | undefined,
  ) => void;
}
