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
  Link as LinkIcon,
  SignOut,
  SidebarSimple,
} from "@phosphor-icons/react/dist/ssr";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/executions", label: "Executions", icon: Pulse },
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
    return <aside className="z-30 flex h-full w-16 shrink-0 flex-col rounded-xl border border-border/40 bg-card shadow-2xl xl:w-[260px]" />;
  }

  return (
    <aside
      className={cn(
        "relative z-30 flex h-full shrink-0 flex-col rounded-xl border border-border/40 bg-card/80 text-sidebar-fg shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      <div className="flex flex-col p-3 transition-all duration-300">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between px-2")}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
                <Lightning weight="duotone" className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="truncate text-[17px] font-bold tracking-tight text-sidebar-title">
                VoxaFlow
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-secondary hover:text-primary",
              isCollapsed ? "bg-secondary/50 text-primary shadow-sm" : "text-sidebar-fg"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarSimple weight="regular" className="h-5 w-5" />
          </button>
        </div>

        {isCollapsed && (
          <div className="mt-4 flex justify-center border-b border-border/40 pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Lightning weight="duotone" className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
          </div>
        )}
        {!isCollapsed && <div className="mt-4 border-b border-border/40" />}
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center rounded-lg transition-all duration-200",
                isCollapsed 
                  ? "h-10 w-10 justify-center mx-auto" 
                  : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-fg hover:bg-secondary hover:text-sidebar-title"
              )}
              title={isCollapsed ? label : undefined}
            >
              <Icon 
                weight={active ? "duotone" : "regular"} 
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  active ? "text-primary-foreground" : "text-sidebar-fg group-hover:text-sidebar-title"
                )} 
              />
              {!isCollapsed && (
                <span className="truncate text-[13px] font-semibold">
                  {label}
                </span>
              )}
              {active && !isCollapsed && (
                <div className="absolute left-0 h-4 w-1 rounded-r-full bg-primary-foreground/40" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/40 px-3 py-6">
        <div className="space-y-6">
          <div
            className={cn(
              "flex items-center transition-all",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20 shadow-sm">
              {initial}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-sidebar-title leading-tight">{userName}</p>
                <p className="truncate text-[11px] text-sidebar-fg/60 leading-tight">{userEmail}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "group inline-flex items-center rounded-lg border border-border/50 bg-secondary/30 text-sidebar-fg transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20",
              isCollapsed 
                ? "h-10 w-10 justify-center mx-auto" 
                : "w-full gap-2 px-3 py-2.5 text-[12px] font-bold"
            )}
            title={isCollapsed ? "Sign out" : undefined}
          >
            <SignOut weight="regular" className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110" />
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
