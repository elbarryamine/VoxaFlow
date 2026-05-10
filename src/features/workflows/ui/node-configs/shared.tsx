"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
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
      <div className="flex-shrink-0">{hint}</div>
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

export const MODEL_OPTIONS = [
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { value: "claude-sonnet", label: "Claude Sonnet" },
  { value: "custom", label: "Custom (Override)" },
];

export const getConnectionType = (modelName: string) =>
  modelName.startsWith("claude") ? "anthropic" : "openai";

export interface NodeConfigProps {
  data: Record<string, unknown>;
  onUpdate: (
    field: string,
    value: string | number | boolean | unknown[] | Record<string, unknown> | undefined,
  ) => void;
  inputVariables?: { 
    nodeId: string; 
    nodeLabel: string; 
    fields: { name: string; type: string; description: string }[];
  }[];
}

import { Key, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useState, useRef, KeyboardEvent, useEffect } from "react";

interface Credential {
  id: string;
  name: string;
  service: string;
}

/** Reusable credential picker that fetches from /api/credentials */
export function CredentialPicker({
  service,
  value,
  onChange,
}: {
  service: string;
  value?: string;
  onChange: (id: string) => void;
}) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.json())
      .then((all: Credential[]) => {
        setCredentials(all.filter((c) => c.service === service));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [service]);

  return (
    <div>
      <FieldLabel
        htmlFor={`cred-${service}`}
        hint={
          <a
            href="/dashboard/credentials"
            target="_blank"
            className="flex items-center gap-1 text-[10px] text-primary hover:underline"
          >
            <Key className="h-3 w-3" />
            Manage
          </a>
        }
      >
        Credential
      </FieldLabel>
      {loading ? (
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground">
          <CircleNotch className="h-3.5 w-3.5 animate-spin" />
          Loading…
        </div>
      ) : credentials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2.5 text-[11px] text-muted-foreground">
          No {service} credentials found.{" "}
          <a href="/dashboard/credentials" target="_blank" className="text-primary hover:underline">
            Add one →
          </a>
        </div>
      ) : (
        <SelectInput
          id={`cred-${service}`}
          value={value ?? ""}
          onChange={onChange}
          options={credentials.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select credential…"
        />
      )}
    </div>
  );
}

export interface AutocompleteOption {
  label: string;
  value: string;
  type?: string;
  description?: string;
}

interface AutocompleteTextAreaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  rows?: number;
}

export const AutocompleteTextArea = ({
  id,
  value,
  onChange,
  options,
  placeholder,
  rows = 3,
}: AutocompleteTextAreaProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterText, setFilterText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const checkCursor = () => {
    if (!textareaRef.current) return;
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    
    // Match {{ followed by anything except whitespace/braces, up to the cursor
    const match = textBeforeCursor.match(/\{\{([^{}\s]*)$/);
    if (match) {
      setShowSuggestions(true);
      setFilterText(match[1]);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Check cursor position when value changes (e.g. typing)
  useEffect(() => {
    checkCursor();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(filterText.toLowerCase()) ||
      o.value.toLowerCase().includes(filterText.toLowerCase())
  );

  const insertOption = (option: AutocompleteOption) => {
    if (!textareaRef.current) return;
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    
    const match = textBeforeCursor.match(/\{\{([^{}\s]*)$/);
    if (match) {
      const startPos = cursorPosition - match[0].length;
      const newBefore = value.slice(0, startPos);
      const inserted = `{{${option.value}}}`;
      const newValue = newBefore + inserted + textAfterCursor;
      
      onChange(newValue);
      setShowSuggestions(false);
      
      // Restore focus and put cursor after the inserted variable
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = startPos + inserted.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || filteredOptions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((s) => (s + 1) % filteredOptions.length);
      scrollSelectedIntoView(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((s) => (s - 1 + filteredOptions.length) % filteredOptions.length);
      scrollSelectedIntoView(selectedIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      insertOption(filteredOptions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const scrollSelectedIntoView = (index: number) => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll("li");
    const normalizedIndex = (index + filteredOptions.length) % filteredOptions.length;
    const item = items[normalizedIndex];
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  };

  return (
    <div className="relative">
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onClick={checkCursor}
        onKeyUp={checkCursor}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring"
      />
      
      {showSuggestions && filteredOptions.length > 0 && (
        <div 
          ref={menuRef}
          className="absolute left-0 right-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md border border-border bg-card shadow-lg"
        >
          <ul className="py-1">
            {filteredOptions.map((opt, i) => (
              <li
                key={opt.value}
                onClick={() => insertOption(opt)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`flex cursor-pointer flex-col px-3 py-1.5 transition-colors ${
                  i === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {opt.label}
                  </span>
                  {opt.type && (
                    <span className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] font-medium uppercase text-muted-foreground">
                      {opt.type}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/70">
                  {`{{${opt.value}}}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
