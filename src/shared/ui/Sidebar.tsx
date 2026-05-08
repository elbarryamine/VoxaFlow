"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";
import { cn } from "@/src/shared/utils/cn";
import {
  SquaresFour,
  Robot,
  GitBranch,
  Gear,
  Headphones,
  Link as LinkIcon,
  SignOut,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/agents", label: "Agents", icon: Robot },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/connections", label: "Connections", icon: LinkIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Gear },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export const Sidebar = ({ userName, userEmail }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-collapse on smaller screens on initial load
    if (window.innerWidth < 1280) {
      setIsCollapsed(true);
    }
  }, []);

  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/auth/sign-in");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return <aside className="z-30 flex h-full w-20 shrink-0 flex-col rounded-2xl border border-sidebar-border bg-sidebar-bg xl:w-64" />;
  }

  return (
    <aside
      className={cn(
        "relative z-30 flex h-full shrink-0 flex-col rounded-2xl border border-sidebar-border bg-sidebar-bg text-sidebar-fg shadow-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-bg text-sidebar-fg shadow-sm transition-transform hover:scale-110 hover:text-sidebar-title"
      >
        {isCollapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
      </button>

      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-sidebar-border px-3 transition-all",
          isCollapsed ? "justify-center" : "justify-start px-6"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-active">
          <Headphones className="h-5 w-5 text-primary-foreground" />
        </div>
        <span
          className={cn(
            "truncate text-lg font-semibold tracking-tight text-sidebar-title transition-all duration-300",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          VoiceFlow
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "justify-start",
                active
                  ? "bg-sidebar-active text-primary-foreground"
                  : "text-sidebar-fg hover:bg-sidebar-hover-bg hover:text-sidebar-title"
              )}
              title={isCollapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "truncate transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div
            className={cn(
              "flex items-center gap-3 transition-all",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-active/30 text-sm font-semibold text-primary-foreground">
              {initial}
            </div>
            <div
              className={cn(
                "min-w-0 flex-1 transition-all duration-300",
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              <p className="truncate text-sm font-medium text-sidebar-title">{userName}</p>
              <p className="truncate text-xs text-sidebar-fg/50">{userEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "inline-flex w-full items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm font-medium text-sidebar-fg transition-colors hover:bg-sidebar-hover-bg hover:text-sidebar-title",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Sign out" : undefined}
          >
            <SignOut className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300",
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              Sign out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
