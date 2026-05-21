"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/dashboard";
  const authStatus = searchParams.get("auth_status");
  const authMessage = searchParams.get("auth_message");
  const statusMessage = authMessage
    ? authMessage
    : authStatus === "verified"
      ? "Email verified successfully. You can now sign in."
      : authStatus === "verify_failed"
        ? "We could not verify your email. Please request a new confirmation link."
        : null;
  const passwordMismatch = useMemo(
    () => mode === "sign-up" && confirmPassword.length > 0 && password !== confirmPassword,
    [confirmPassword, mode, password],
  );

  const switchMode = (nextMode: "sign-in" | "sign-up") => {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "sign-up" && passwordMismatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.replace(nextPath);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user && !data.session) {
        setSuccessMessage("Account created. Check your email to confirm your account, then sign in.");
        setMode("sign-in");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : mode === "sign-in"
            ? "Unable to sign in. Please try again."
            : "Unable to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start Google sign-in.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-manrope">
      <div className="grid grid-cols-2 rounded-xl border border-border/50 bg-surface-variant/30 p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => switchMode("sign-in")}
          className={`rounded-lg px-4 py-2.5 text-[14px] font-bold transition-all ${
            mode === "sign-in"
              ? "bg-card text-on-surface shadow-sm ring-1 ring-border/50"
              : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode("sign-up")}
          className={`rounded-lg px-4 py-2.5 text-[14px] font-bold transition-all ${
            mode === "sign-up"
              ? "bg-card text-on-surface shadow-sm ring-1 ring-border/50"
              : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
          }`}
        >
          Create account
        </button>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting || isSubmitting}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border/50 bg-card px-5 py-3 text-[14px] font-bold shadow-sm transition-all hover:border-outline-variant hover:bg-surface-variant/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {isGoogleSubmitting ? "Connecting Google..." : `Continue with Google`}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "sign-up" && (
          <div className="space-y-2">
            <label htmlFor="full-name" className="block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Jane Doe"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder={mode === "sign-in" ? "Enter your password" : "Use at least 8 characters"}
          />
        </div>

        {mode === "sign-up" && (
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={`w-full rounded-xl border bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                passwordMismatch ? "border-error focus:border-error" : "border-border/50 focus:border-primary"
              }`}
              placeholder="Repeat your password"
            />
            {passwordMismatch && <p className="text-[13px] font-bold text-error">Passwords must match.</p>}
          </div>
        )}

        {errorMessage && (
          <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-[14px] font-bold text-error shadow-sm">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-[14px] font-bold text-success shadow-sm">
            {successMessage}
          </p>
        )}
        {!successMessage && statusMessage && (
          <p
            className={`rounded-xl border px-4 py-3 text-[14px] font-bold shadow-sm ${
              authStatus === "verify_failed"
                ? "border-error/30 bg-error/10 text-error"
                : "border-success/30 bg-success/10 text-success"
            }`}
          >
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting || passwordMismatch}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[15px] font-bold text-on-primary shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "sign-in" ? (
            isSubmitting ? "Signing in..." : "Sign in"
          ) : isSubmitting ? (
            "Creating account..."
          ) : (
            <>
              Create account <Sparkle className="h-5 w-5" weight="duotone" />
            </>
          )}
        </button>

        <p className="text-center text-[13px] font-medium text-on-surface-variant">
          {mode === "sign-in"
            ? "Use your Auren account credentials to access your dashboard."
            : "A confirmation email may be required before your first sign in."}
        </p>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.5 0-.71-.06-1.39-.18-2.05H12Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.3-2.56c-.92.62-2.1.99-3.32.99-2.55 0-4.71-1.72-5.48-4.03l-3.42 2.64C4.73 19.95 8.08 22 12 22Z"
      />
      <path
        fill="#4A90E2"
        d="M6.52 13.97A5.98 5.98 0 0 1 6.2 12c0-.68.12-1.34.32-1.97L3.1 7.4A9.97 9.97 0 0 0 2 12c0 1.61.39 3.13 1.1 4.43l3.42-2.46Z"
      />
      <path
        fill="#FBBC05"
        d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.97 2.98 14.7 2 12 2 8.08 2 4.73 4.05 3.1 7.4l3.42 2.63C7.29 7.72 9.45 6 12 6Z"
      />
    </svg>
  );
}
