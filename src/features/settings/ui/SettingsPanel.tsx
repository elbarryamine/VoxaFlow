interface SettingsPanelProps {
  children: React.ReactNode;
}

export const SettingsPanel = ({ children }: SettingsPanelProps) => (
    <div className="space-y-4 font-manrope mt-10">{children}</div>
);
