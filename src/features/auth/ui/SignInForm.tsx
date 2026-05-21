"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import {
  AUTH_AUTOCOMPLETE,
  AUTH_FIELD_NAME,
} from "@/src/features/auth/constants/AUTH_AUTOCOMPLETE";
import {
  authAutofillTrapClass,
  authInputClass,
  authModeSwitchActiveClass,
  authModeSwitchIdleClass,
  authModeSwitchWrapClass,
} from "@/src/features/auth/constants/AUTH_UI";
import { getSupabaseClient } from "@/src/shared/utils/supabase-client";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import { cn } from "@/src/shared/utils/cn";

type AuthMode = "sign-in" | "sign-up";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0">
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

const AuthAutofillTrap = () => (
  <div className={authAutofillTrapClass} aria-hidden="true">
    <input type="text" name="username" autoComplete="username" tabIndex={-1} defaultValue="" />
    <input
      type="password"
      name="password"
      autoComplete="current-password"
      tabIndex={-1}
      defaultValue=""
    />
  </div>
);

interface AuthFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  readOnlyUntilFocus?: boolean;
  minLength?: number;
  placeholder: string;
  hasError?: boolean;
}

const AuthField = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  autoComplete,
  inputMode,
  readOnlyUntilFocus = false,
  minLength,
  placeholder,
  hasError,
}: AuthFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isReadOnly = readOnlyUntilFocus && !isFocused;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-manrope text-[11px] font-bold uppercase tracking-wide text-on-surface-variant"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        readOnly={isReadOnly}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={inputMode === "email" ? false : undefined}
        minLength={minLength}
        placeholder={placeholder}
        className={cn(
          authInputClass,
          isReadOnly && "cursor-text",
          hasError && "border-error focus:border-error focus:ring-error/20",
        )}
      />
    </div>
  );
};

interface AuthPasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  readOnlyUntilFocus?: boolean;
  minLength?: number;
  placeholder: string;
  hasError?: boolean;
}

const AuthPasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  readOnlyUntilFocus = false,
  minLength,
  placeholder,
  hasError,
}: AuthPasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isReadOnly = readOnlyUntilFocus && !isFocused;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-manrope text-[11px] font-bold uppercase tracking-wide text-on-surface-variant"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          readOnly={isReadOnly}
          autoComplete={isVisible ? "off" : autoComplete}
          minLength={minLength}
          placeholder={placeholder}
          className={cn(
            authInputClass,
            "pr-11",
            isReadOnly && "cursor-text",
            hasError && "border-error focus:border-error focus:ring-error/20",
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeSlash className="h-4 w-4" weight="bold" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" weight="bold" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
};

interface AuthAlertProps {
  tone: "error" | "success";
  message: string;
}

const AuthAlert = ({ tone, message }: AuthAlertProps) => (
  <p
    role="alert"
    className={cn(
      "rounded-xl border px-4 py-3 font-manrope text-[14px] font-bold",
      tone === "error"
        ? "border-error/30 bg-error-container/40 text-error"
        : "border-success/30 bg-success/10 text-success",
    )}
  >
    {message}
  </p>
);

export const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign-in");
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
  const isBusy = isSubmitting || isGoogleSubmitting;

  const switchMode = (nextMode: AuthMode) => {
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
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
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user && !data.session) {
        setSuccessMessage(
          "Account created. Check your email to confirm your account, then sign in.",
        );
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
      if (error) setErrorMessage(error.message);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start Google sign-in.",
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={authModeSwitchWrapClass} role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-in"}
          onClick={() => switchMode("sign-in")}
          className={mode === "sign-in" ? authModeSwitchActiveClass : authModeSwitchIdleClass}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-up"}
          onClick={() => switchMode("sign-up")}
          className={mode === "sign-up" ? authModeSwitchActiveClass : authModeSwitchIdleClass}
        >
          Create account
        </button>
      </div>

      <TopBarButton
        type="button"
        variant="secondary"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
        className="w-full justify-center py-3"
      >
        <GoogleIcon />
        {isGoogleSubmitting ? "Connecting…" : "Continue with Google"}
      </TopBarButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border/50" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 font-manrope text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          or email
        </p>
      </div>

      <form
        key={mode}
        onSubmit={handleSubmit}
        className="space-y-4"
        autoComplete="off"
        name={mode === "sign-in" ? "auren-sign-in" : "auren-sign-up"}
        data-1p-ignore
        data-bwignore
        data-lpignore="true"
      >
        <AuthAutofillTrap />

        {mode === "sign-up" && (
          <AuthField
            id="full-name"
            name={AUTH_FIELD_NAME.signUp.fullName}
            label="Full name"
            type="text"
            value={fullName}
            onChange={setFullName}
            autoComplete={AUTH_AUTOCOMPLETE.signUp.fullName}
            placeholder="Jane Doe"
          />
        )}

        <AuthField
          id={mode === "sign-in" ? "auren-sign-in-email" : "auren-sign-up-email"}
          name={
            mode === "sign-in"
              ? AUTH_FIELD_NAME.signIn.email
              : AUTH_FIELD_NAME.signUp.email
          }
          label="Email"
          type="text"
          inputMode="email"
          readOnlyUntilFocus={mode === "sign-in"}
          value={email}
          onChange={setEmail}
          autoComplete={
            mode === "sign-in"
              ? AUTH_AUTOCOMPLETE.signIn.email
              : AUTH_AUTOCOMPLETE.signUp.email
          }
          placeholder="you@example.com"
        />

        <AuthPasswordField
          id={mode === "sign-in" ? "auren-sign-in-password" : "auren-sign-up-password"}
          name={
            mode === "sign-in"
              ? AUTH_FIELD_NAME.signIn.password
              : AUTH_FIELD_NAME.signUp.password
          }
          label="Password"
          readOnlyUntilFocus={mode === "sign-in"}
          value={password}
          onChange={setPassword}
          autoComplete={
            mode === "sign-in"
              ? AUTH_AUTOCOMPLETE.signIn.password
              : AUTH_AUTOCOMPLETE.signUp.password
          }
          minLength={8}
          placeholder={mode === "sign-in" ? "Enter your password" : "At least 8 characters"}
        />

        {mode === "sign-up" && (
          <>
            <AuthPasswordField
              id="auren-sign-up-confirm-password"
              name={AUTH_FIELD_NAME.signUp.confirmPassword}
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete={AUTH_AUTOCOMPLETE.signUp.confirmPassword}
              minLength={8}
              placeholder="Repeat your password"
              hasError={passwordMismatch}
            />
            {passwordMismatch && (
              <p className="font-manrope text-[13px] font-bold text-error">Passwords must match.</p>
            )}
          </>
        )}

        {errorMessage && <AuthAlert tone="error" message={errorMessage} />}
        {successMessage && <AuthAlert tone="success" message={successMessage} />}
        {!successMessage && statusMessage && (
          <AuthAlert
            tone={authStatus === "verify_failed" ? "error" : "success"}
            message={statusMessage}
          />
        )}

        <TopBarButton
          type="submit"
          disabled={isBusy || passwordMismatch}
          className="mt-2 w-full justify-center gap-2 py-3.5"
        >
          {mode === "sign-in"
            ? isSubmitting
              ? "Signing in…"
              : "Sign in"
            : isSubmitting
              ? "Creating account…"
              : "Create account"}
          {!isSubmitting && <ArrowRight className="h-5 w-5" weight="bold" aria-hidden />}
        </TopBarButton>

        <p className="text-center font-manrope text-[13px] font-medium text-on-surface-variant">
          {mode === "sign-in"
            ? "Access your dashboard, workflows, and execution history."
            : "You may need to confirm your email before the first sign in."}
        </p>
      </form>
    </div>
  );
};
