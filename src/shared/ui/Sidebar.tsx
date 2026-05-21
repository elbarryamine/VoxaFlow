"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";
import { cn } from "@/src/shared/utils/cn";
import { useSidebarMobile } from "@/src/shared/ui/SidebarMobileContext";
import {
  SquaresFour,
  Pulse,
  GitBranch,
  Gear,
  Key,
  SignOut,
  SidebarSimple,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { APP_NAME } from "@/src/shared/constants/BRAND";
import { AurenLogo } from "@/src/shared/ui/AurenLogo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/executions", label: "Executions", icon: Pulse },
  { href: "/dashboard/credentials", label: "Credentials", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Gear },
] as const;

const MOBILE_MEDIA_QUERY = "(max-width: 1279px)";

const navLinkBase =
  "group relative flex items-center rounded-lg font-manrope transition-colors duration-300";

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export const Sidebar = ({ userName, userEmail }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen: isMobileOpen, close: closeMobile } = useSidebarMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const syncViewport = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        closeMobile();
      }
    };

    const timer = requestAnimationFrame(() => {
      setMounted(true);
      syncViewport();
    });

    mediaQuery.addEventListener("change", syncViewport);
    return () => {
      cancelAnimationFrame(timer);
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, [closeMobile]);

  useEffect(() => {
    if (isMobile) {
      closeMobile();
    }
  }, [pathname, isMobile, closeMobile]);

  useEffect(() => {
    if (!isMobile || !isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, isMobileOpen]);

  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";
  const showExpanded = isMobile || !isCollapsed;

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/auth/sign-in");
    router.refresh();
  };

  const handleSidebarControl = () => {
    if (isMobile) {
      closeMobile();
      return;
    }
    setIsCollapsed((value) => !value);
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeMobile();
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <aside className="hidden h-full w-20 shrink-0 flex-col border-r border-sidebar-border/50 bg-sidebar-bg xl:flex" />
    );
  }

  return (
    <>
      {isMobile && isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-[2px] xl:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "flex h-full flex-col border-r border-sidebar-border/50 bg-sidebar-bg text-sidebar-fg transition-all duration-300 ease-in-out",
          "fixed inset-y-0 left-0 z-50 w-[280px] shadow-xl transition-transform xl:relative xl:z-30 xl:shrink-0 xl:translate-x-0 xl:shadow-none",
          isMobile && !isMobileOpen && "-translate-x-full",
          !isMobile && (isCollapsed ? "xl:w-20" : "xl:w-[280px]"),
        )}
      >
        {/* Header */}
        <div className="flex flex-col p-4 transition-all duration-300">
          <div
            className={cn(
              "flex items-center",
              showExpanded ? "justify-between px-1" : "justify-center",
            )}
          >
            {showExpanded && (
              <Link
                href="/dashboard"
                className="flex min-w-0 items-end gap-3"
                aria-label={`${APP_NAME} home`}
                onClick={handleNavClick}
              >
                <AurenLogo size="md" />
                <span className="truncate font-newsreader text-xl font-bold leading-none tracking-tight text-sidebar-title">
                  {APP_NAME}
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={handleSidebarControl}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-300",
                !showExpanded
                  ? "bg-surface-variant text-on-surface shadow-sm"
                  : "hover:bg-surface-variant hover:text-on-surface",
              )}
              title={
                isMobile
                  ? "Close menu"
                  : isCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
              }
              aria-label={
                isMobile
                  ? "Close menu"
                  : isCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
              }
            >
              {isMobile ? (
                <X weight="regular" className="h-4.5 w-4.5" />
              ) : (
                <SidebarSimple weight="regular" className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

          {!showExpanded && (
            <div className="mt-6 flex justify-center border-b border-sidebar-border/50 pb-5">
              <Link
                href="/dashboard"
                aria-label={`${APP_NAME} home`}
                onClick={handleNavClick}
              >
                <AurenLogo size="sm" />
              </Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 gap-2 px-2 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className={cn(
                  navLinkBase,
                  "border",
                  showExpanded
                    ? "gap-2 px-2 py-1.5"
                    : "mx-auto h-9 w-9 justify-center",
                  active
                    ? "border-primary/25 bg-primary text-on-primary"
                    : "border-transparent text-on-surface-variant hover:border-border/50 hover:bg-surface-variant/50 hover:text-on-surface",
                )}
                title={!showExpanded ? label : undefined}
              >
                {showExpanded ? (
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
                ) : (
                  <Icon
                    weight={active ? "duotone" : "regular"}
                    className="h-4 w-4 shrink-0"
                  />
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
                showExpanded ? "gap-3.5 px-1" : "justify-center",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container shadow-sm ring-1 ring-border/20">
                {initial}
              </div>
              {showExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold leading-tight text-sidebar-title">
                    {userName}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] leading-tight text-sidebar-fg">
                    {userEmail}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                "group inline-flex items-center rounded-xl transition-all duration-300",
                showExpanded
                  ? "w-full gap-3 border border-transparent px-3.5 py-2.5 text-[13px] font-bold bg-surface-variant/50 text-sidebar-fg hover:border-error/10 hover:bg-error-container hover:text-on-error-container"
                  : "mx-auto h-12 w-12 justify-center bg-surface-variant/50 text-sidebar-fg hover:bg-error-container hover:text-on-error-container",
              )}
              title={!showExpanded ? "Sign out" : undefined}
            >
              <SignOut
                weight="regular"
                className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              {showExpanded && <span className="truncate">Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
