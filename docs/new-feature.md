# New feature template (Next.js App Router)

Use this when adding a user-facing feature screen in this Next.js app. Route entry points live in `app/`; feature code can live in `src/features/` (or the project's chosen feature directory) and stay UI/business-logic focused.

## Layout

```text
app/
└── <route-segment>/                 # kebab-case route segment
    ├── page.tsx                     # route screen entry (Server Component by default)
    ├── loading.tsx                  # optional: route-level loading UI
    ├── error.tsx                    # optional: route-level error boundary (client component)
    ├── not-found.tsx                # optional: route-level 404 UI
    └── layout.tsx                   # optional: route-specific layout

src/features/<feature-name>/         # optional, recommended for non-trivial features
├── ui/                              # presentational components
├── hooks/                           # feature hooks
├── utils/                           # pure helper functions
├── constants/                       # feature constants
├── store/                           # optional client state (e.g. Zustand)
├── types/                           # feature-only types
└── index.ts                         # feature public API (named exports)
```

Use **kebab-case** for `<route-segment>` and `<feature-name>`.

## Screen pattern

1. Keep `app/<route-segment>/page.tsx` thin: parse route/search params, fetch data, and compose feature UI.
2. Move reusable UI and logic into `src/features/<feature-name>/`.
3. Add `"use client"` only where client-only behavior is required (event handlers, browser APIs, client state/hooks).
4. Prefer route-level files (`loading.tsx`, `error.tsx`, `not-found.tsx`) over ad-hoc in-component fallbacks when possible.
5. Define route metadata via `export const metadata` or `generateMetadata` in `page.tsx`/`layout.tsx` when needed.

## Checklist

1. **Route** — add `app/<route-segment>/page.tsx` (and optional `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
2. **Feature module** — add/update `src/features/<feature-name>/` folders only as needed (`ui`, `hooks`, `utils`, `constants`, `store`, `types`).
3. **Exports** — use named exports for feature components/hooks and re-export from `src/features/<feature-name>/index.ts`.
4. **Copy** — add user-facing text via the project's i18n setup (if enabled) instead of hardcoding repeated strings.
5. **Docs** — update [`architecture.md`](../architecture.md) in the same change when files under `src/` or `scripts/` are added, removed, or materially changed.

## References

- Components and props: [`docs/react.md`](react.md)
- Clean code conventions: [`docs/clean-code.md`](clean-code.md)
- Repo map: [`architecture.md`](../architecture.md)
