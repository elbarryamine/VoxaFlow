"use client";

import Link from "next/link";
import {
  MagnifyingGlass,
  Bell,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
}

export const TopBar = ({
  title,
  description,
  actions,
  backHref,
}: TopBarProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <ThemeToggle />
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
          <MagnifyingGlass className="h-4 w-4" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  );
};
