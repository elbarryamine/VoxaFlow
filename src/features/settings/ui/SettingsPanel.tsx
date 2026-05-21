interface SettingsPanelProps {
  children: React.ReactNode;
}

export const SettingsPanel = ({ children }: SettingsPanelProps) => (
  <div className="p-4 border border-border/50 rounded-lg bg-card">
    <div className="space-y-4 font-manrope">{children}</div>
  </div>
);
