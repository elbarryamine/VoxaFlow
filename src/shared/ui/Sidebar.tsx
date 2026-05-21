"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";
import { cn } from "@/src/shared/utils/cn";
import {
  SquaresFour,
  Pulse,
  GitBranch,
  Gear,
  Lightning,
  Key,
  SignOut,
  SidebarSimple,
} from "@phosphor-icons/react/dist/ssr";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/executions", label: "Executions", icon: Pulse },
  { href: "/dashboard/credentials", label: "Credentials", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Gear },
] as const;

const navLinkBase =
  "group relative flex items-center rounded-lg font-manrope transition-colors duration-300";

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
    const timer = requestAnimationFrame(() => {
      setMounted(true);
      // Auto-collapse on smaller screens on initial load
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      }
    });
    return () => cancelAnimationFrame(timer);
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
    return <aside className="z-30 flex h-full w-20 shrink-0 flex-col border-r border-sidebar-border/50 bg-sidebar-bg xl:w-[280px]" />;
  }

  return (
    <aside
      className={cn(
        "relative z-30 flex h-full shrink-0 flex-col border-r border-sidebar-border/50 bg-sidebar-bg text-sidebar-fg transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Header */}
      <div className="flex flex-col p-4 transition-all duration-300">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between px-1")}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Lightning weight="duotone" className="h-5 w-5" />
              </div>
              <span className="truncate text-xl font-newsreader font-bold tracking-tight text-sidebar-title">
                Auren
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-300",
              isCollapsed
                ? "bg-surface-variant text-on-surface shadow-sm"
                : "hover:bg-surface-variant hover:text-on-surface",
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarSimple weight="regular" className="h-4.5 w-4.5" />
          </button>
        </div>
        
        {isCollapsed && (
          <div className="mt-6 flex justify-center border-b border-sidebar-border/50 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Lightning weight="duotone" className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-2 gap-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                navLinkBase,
                "border",
                isCollapsed
                  ? "mx-auto h-9 w-9 justify-center"
                  : "gap-2 px-2 py-1.5",
                active
                  ? "border-primary/25 bg-primary text-on-primary"
                  : "border-transparent text-on-surface-variant hover:border-border/50 hover:bg-surface-variant/50 hover:text-on-surface",
              )}
              title={isCollapsed ? label : undefined}
            >
              {isCollapsed ? (
                <Icon
                  weight={active ? "duotone" : "regular"}
                  className="h-4 w-4 shrink-0"
                />
              ) : (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      active
                        ? "bg-on-primary/15 text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant group-hover:bg-secondary-container/50 group-hover:text-on-secondary-container",
                    )}
                  >
                    <Icon
                      weight={active ? "duotone" : "regular"}
                      className="h-4 w-4 shrink-0"
                    />
                  </span>
                  <span
                    className={cn(
                      "truncate text-[14px] font-semibold leading-tight",
                      active ? "text-on-primary" : "text-on-surface",
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="border-t border-sidebar-border/50 p-4 font-manrope">
        <div className="space-y-4">
          <div
            className={cn(
              "flex items-center transition-all",
              isCollapsed ? "justify-center" : "gap-3.5 px-1"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container ring-1 ring-border/20 shadow-sm">
              {initial}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-sidebar-title leading-tight">{userName}</p>
                <p className="truncate text-[12px] text-sidebar-fg mt-0.5 leading-tight">{userEmail}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "group inline-flex items-center rounded-xl transition-all duration-300",
              isCollapsed 
                ? "h-12 w-12 justify-center mx-auto bg-surface-variant/50 text-sidebar-fg hover:bg-error-container hover:text-on-error-container" 
                : "w-full gap-3 px-3.5 py-2.5 text-[13px] font-bold bg-surface-variant/50 text-sidebar-fg hover:bg-error-container hover:text-on-error-container border border-transparent hover:border-error/10"
            )}
            title={isCollapsed ? "Sign out" : undefined}
          >
            <SignOut weight="regular" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {!isCollapsed && (
              <span className="truncate">
                Sign out
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
