import { cn } from "@/src/shared/utils/cn";

export const settingsInputClass =
  "w-full rounded-xl border border-border/50 bg-surface-variant/30 px-3 py-2.5 font-manrope text-[14px] text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

interface SettingsFieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsField = ({
  label,
  htmlFor,
  children,
  className,
}: SettingsFieldProps) => (
  <div className={className}>
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block font-manrope text-[11px] font-bold uppercase tracking-wide text-on-surface-variant"
    >
      {label}
    </label>
    {children}
  </div>
);

interface SettingsToggleRowProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

export const SettingsToggleRow = ({
  title,
  description,
  defaultChecked,
}: SettingsToggleRowProps) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg transition-colors hover:bg-surface-variant/30">
    <div className="min-w-0">
      <p className="text-[14px] font-bold text-on-surface">{title}</p>
      <p className="mt-0.5 text-[12px] font-medium leading-snug text-on-surface-variant">
        {description}
      </p>
    </div>
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="h-5 w-5 shrink-0 rounded-md border-border/50 accent-secondary"
    />
  </label>
);

export const SettingsDivider = () => (
  <div className="h-px bg-border/50" aria-hidden />
);

interface SettingsStatRowProps {
  label: string;
  value: string;
}

export const SettingsStatRow = ({ label, value }: SettingsStatRowProps) => (
  <div className="flex items-center justify-between rounded-lg bg-surface-variant/25 text-[13px]">
    <span className="font-medium text-on-surface-variant">{label}</span>
    <span className="font-bold text-on-surface">{value}</span>
  </div>
);
