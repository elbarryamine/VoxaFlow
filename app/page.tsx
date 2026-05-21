import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/src/features/landing/ui/LandingPage";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export const metadata: Metadata = {
  title: "Auren — AI Workflow Automations",
  description:
    "Design visual workflows, connect integrations, and monitor AI-powered automations in one workspace.",
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
