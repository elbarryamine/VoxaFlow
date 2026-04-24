"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";
import {
  SquaresFour,
  Robot,
  GitBranch,
  Gear,
  Headphones,
  Link as LinkIcon,
  SignOut,
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

  return (
    <aside className="z-30 flex h-full w-18 shrink-0 flex-col rounded-2xl border border-sidebar-border bg-sidebar-bg text-sidebar-fg shadow-xl xl:w-64">
      <div className="flex h-16 items-center justify-center gap-3 border-b border-sidebar-border px-3 xl:justify-start xl:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-active">
          <Headphones className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="hidden text-lg font-semibold tracking-tight text-sidebar-title xl:block">
          VoiceFlow
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4 xl:px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors xl:justify-start ${
                active
                  ? "bg-sidebar-active text-primary-foreground"
                  : "text-sidebar-fg hover:bg-sidebar-hover-bg hover:text-sidebar-title"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden xl:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 xl:justify-start">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-active/30 text-sm font-semibold text-primary-foreground">
              {initial}
            </div>
            <div className="min-w-0 flex-1 hidden xl:block">
              <p className="truncate text-sm font-medium text-sidebar-title">{userName}</p>
              <p className="truncate text-xs text-sidebar-fg/50">{userEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm font-medium text-sidebar-fg transition-colors hover:bg-sidebar-hover-bg hover:text-sidebar-title xl:justify-start"
          >
            <SignOut className="h-4 w-4" />
            <span className="hidden xl:inline">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
