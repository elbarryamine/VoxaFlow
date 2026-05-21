"use client";

import { Sidebar } from "@/src/shared/ui/Sidebar";
import { SidebarMobileProvider } from "@/src/shared/ui/SidebarMobileContext";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export const DashboardShell = ({
  children,
  userName,
  userEmail,
}: DashboardShellProps) => (
  <SidebarMobileProvider>
    <div className="relative flex h-screen overflow-hidden bg-background">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  </SidebarMobileProvider>
);
