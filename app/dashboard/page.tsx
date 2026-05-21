import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";
import { DashboardOverview } from "@/src/features/dashboard/ui/DashboardOverview";
import { loadDashboardData } from "@/src/features/dashboard/utils/loadDashboardData";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const data = await loadDashboardData(user);

  return <DashboardOverview {...data} />;
}
