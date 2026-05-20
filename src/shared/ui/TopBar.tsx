"use client";

import Link from "next/link";
import {
  MagnifyingGlass,
  Bell,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";

interface TopBarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  onTitleChange?: (newTitle: string) => void;
}

export const TopBar = ({
  title,
  description,
  actions,
  backHref,
  onTitleChange,
}: TopBarProps) => {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between px-6 border-b border-border/40 bg-surface/50 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-300 hover:bg-surface-variant hover:text-on-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div>
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
              className="bg-transparent text-2xl font-newsreader font-bold tracking-tight text-on-surface outline-none border-b border-transparent hover:border-outline-variant/50 focus:border-primary transition-all px-0 w-full min-w-[200px]"
            />
          ) : (
            <h1 className="text-2xl font-newsreader font-bold tracking-tight text-on-surface">{title}</h1>
          )}
          {description && (
            <p className="text-[14px] font-manrope font-medium text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <ThemeToggle />
        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-300 hover:bg-surface-variant hover:text-on-surface">
          <MagnifyingGlass className="h-5 w-5" />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-300 hover:bg-surface-variant hover:text-on-surface">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface" />
        </button>
      </div>
    </header>
  );
};
