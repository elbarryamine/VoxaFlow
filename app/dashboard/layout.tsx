import { DashboardShell } from "@/src/shared/ui/DashboardShell";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const userEmail = user.email ?? "";
  const userName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Anonymous";

  return (
    <DashboardShell userName={userName} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
