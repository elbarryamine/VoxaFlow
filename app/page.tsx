import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/auth/sign-in");
}
