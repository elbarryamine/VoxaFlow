import type { IconProps } from "@phosphor-icons/react";
import { cn } from "@/src/shared/utils/cn";

type EmptyStateLayout = "page" | "section";

interface EmptyStateProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
  action?: React.ReactNode;
  layout?: EmptyStateLayout;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  layout = "section",
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center px-6 text-center font-manrope",
      layout === "page" ? "min-h-0 flex-1 py-12" : "py-10",
      className,
    )}
  >
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container/60 text-on-secondary-container">
      <Icon className="h-8 w-8" weight="duotone" />
    </div>
    <h3 className="font-newsreader text-2xl font-bold text-on-surface sm:text-3xl">
      {title}
    </h3>
    <p className="mt-3 max-w-md text-[15px] font-medium leading-relaxed text-on-surface-variant">
      {description}
    </p>
    {action ? <div className="mt-8">{action}</div> : null}
  </div>
);
