"use client";

import { TopBar } from "./TopBar";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  contentClassName?: string;
  withContentPadding?: boolean;
}

export const PageLayout = ({
  children,
  title,
  description,
  actions,
  backHref,
  contentClassName = "",
  withContentPadding = true,
}: PageLayoutProps) => {
  const contentPaddingClass = withContentPadding ? "p-8" : "";
  const contentClasses =
    `flex-1 overflow-y-auto ${contentPaddingClass} ${contentClassName}`.trim();

  return (
    <>
      {title && (
        <TopBar
          title={title}
          description={description}
          actions={actions}
          backHref={backHref}
        />
      )}
      <div className={contentClasses}>{children}</div>
    </>
  );
};
