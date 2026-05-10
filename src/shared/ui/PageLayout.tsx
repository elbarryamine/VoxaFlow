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
  onTitleChange?: (newTitle: string) => void;
}

export const PageLayout = ({
  children,
  title,
  description,
  actions,
  backHref,
  onTitleChange,
  contentClassName = "",
  withContentPadding = true,
}: PageLayoutProps) => {
  const contentPaddingClass = withContentPadding ? "p-4" : "";
  const contentClasses =
    `flex-1 overflow-y-auto ${contentPaddingClass} ${contentClassName}`.trim();

  return (
    <>
      <TopBar
        title={title}
        description={description}
        actions={actions}
        backHref={backHref}
        onTitleChange={onTitleChange}
      />
      <div className={contentClasses}>{children}</div>
    </>
  );
};
