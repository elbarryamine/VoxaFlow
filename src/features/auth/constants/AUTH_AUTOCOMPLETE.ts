/** Section prefix scopes browser/password-manager autofill to Auren only. */
const SECTION = "section-auren";

export const AUTH_AUTOCOMPLETE = {
  signIn: {
    email: `${SECTION} username`,
    password: `${SECTION} current-password`,
  },
  signUp: {
    fullName: `${SECTION} signup name`,
    email: `${SECTION} signup username`,
    password: `${SECTION} signup new-password`,
    confirmPassword: `${SECTION} signup new-password`,
  },
} as const;

export const AUTH_FIELD_NAME = {
  signIn: {
    email: "auren-username",
    password: "auren-password",
  },
  signUp: {
    fullName: "auren-full-name",
    email: "auren-email",
    password: "auren-new-password",
    confirmPassword: "auren-confirm-password",
  },
} as const;
