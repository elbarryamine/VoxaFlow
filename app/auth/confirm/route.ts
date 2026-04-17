import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export async function GET(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") || "/dashboard";

  const redirectToSignIn = (status: "verified" | "verify_failed", message?: string) => {
    const destination = new URL("/auth/sign-in", request.url);
    destination.searchParams.set("next", next);
    destination.searchParams.set("auth_status", status);
    if (message) {
      destination.searchParams.set("auth_message", message);
    }
    return destination;
  };

  let response = NextResponse.redirect(redirectToSignIn("verify_failed"));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.redirect(redirectToSignIn("verified"));
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      redirectToSignIn("verify_failed", "Invalid verification link. Please request a new email."),
    );
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(
      redirectToSignIn("verify_failed", "Verification link expired or invalid. Please try again."),
    );
  }

  return response;
}
