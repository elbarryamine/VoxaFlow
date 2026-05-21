"use client";

import Link from "next/link";
import { Bell, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";
import { SidebarMobileMenuButton } from "@/src/shared/ui/SidebarMobileContext";
import { cn } from "@/src/shared/utils/cn";

interface TopBarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  onTitleChange?: (newTitle: string) => void;
}

const toolbarIconClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-300 hover:bg-surface-variant hover:text-on-surface";

export const TopBar = ({
  title,
  description,
  actions,
  backHref,
  onTitleChange,
}: TopBarProps) => {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border/50 bg-surface-container-low px-6 transition-colors duration-300">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarMobileMenuButton />
        {backHref && (
          <Link
            href={backHref}
            className={toolbarIconClass}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="min-w-0">
          {onTitleChange ? (
            <input
              key={title}
              type="text"
              defaultValue={title}
              onBlur={(e) => {
                if (e.target.value && e.target.value !== title) {
                  onTitleChange(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full min-w-[200px] border-b border-transparent bg-transparent px-0 font-newsreader text-2xl font-bold tracking-tight text-on-surface outline-none transition-all hover:border-outline-variant/50 focus:border-primary"
            />
          ) : (
            title && (
              <h1 className="truncate font-newsreader text-2xl font-bold tracking-tight text-on-surface">
                {title}
              </h1>
            )
          )}
          {description && (
            <p className="mt-0.5 truncate font-manrope text-[14px] font-medium text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions && (
          <>
            <div className="flex items-center gap-2">{actions}</div>
            <div
              className="mx-1 hidden h-6 w-px bg-outline-variant/60 sm:block"
              aria-hidden
            />
          </>
        )}
        <button
          type="button"
          className={cn(toolbarIconClass, "relative")}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-surface-container-low" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};
