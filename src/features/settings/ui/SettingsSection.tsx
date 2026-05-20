import type { IconProps } from "@phosphor-icons/react";
import { cn } from "@/src/shared/utils/cn";

interface SettingsSectionProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection = ({
  icon: Icon,
  title,
  description,
  children,
  className,
}: SettingsSectionProps) => (
  <section
    className={cn(
      "overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm",
      className,
    )}
  >
    <div className="flex items-center gap-3 border-b border-border/50 bg-surface-container-low/40 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container/50 text-on-secondary-container">
        <Icon className="h-4.5 w-4.5" weight="duotone" />
      </div>
      <div className="min-w-0">
        <h2 className="font-newsreader text-lg font-bold leading-tight text-on-surface">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 font-manrope text-[12px] font-medium text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
    </div>
    <div className="space-y-4 px-4 py-4 font-manrope">{children}</div>
  </section>
);
