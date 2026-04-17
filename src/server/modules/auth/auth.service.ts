import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export class AuthService {
  async getAuthenticatedUser() {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new Error(`Unable to fetch authenticated user: ${error.message}`);
    }

    if (!user) {
      throw new Error("Unauthorized");
    }

    return { supabase, user };
  }
}

export const authService = new AuthService();
