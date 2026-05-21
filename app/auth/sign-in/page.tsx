import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInScreen } from "@/src/features/auth/ui/SignInScreen";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export const metadata: Metadata = {
  title: "Sign in | Auren",
  description: "Sign in to your Auren workspace",
};

export default async function SignInPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignInScreen />;
}
