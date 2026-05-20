import { Sidebar } from "@/src/shared/ui/Sidebar";
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
  const userName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "VoxaFlow User";

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
