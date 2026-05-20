interface SettingsPanelProps {
  children: React.ReactNode;
}

export const SettingsPanel = ({ children }: SettingsPanelProps) => (
  <div className="rounded-xl border border-border/50 bg-card shadow-sm">
    <div className="space-y-4 p-4 font-manrope sm:p-5">{children}</div>
  </div>
);
