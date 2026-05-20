# Voxa Flow — Agent Guide

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Realtime + Edge Functions) · Zustand · XYFlow · Phosphor Icons

---

## Before You Write Any Code

Read the guide that matches the work:

| Topic | Document |
| --- | --- |
| React components & props | [`docs/react.md`](docs/react.md) |
| New route / feature / server module | [`docs/new-feature.md`](docs/new-feature.md) |
| Code style & structure | [`docs/clean-code.md`](docs/clean-code.md) |

**File lookup:** If a path isn't already in context, read [`architecture.md`](architecture.md) first, then open specific files.

---

## Project Layout (abbreviated)

```
app/                        # Next.js routes (thin page.tsx entry points)
  auth/                     # Sign-in, OAuth callback, email confirm
  dashboard/                # Protected area
    workflows/              # List · new · templates · [id] canvas editor
    executions/             # List · [id] detail with live logs
    credentials/            # Stored API keys
    settings/
  api/                      # Route handlers — thin adapters only

src/
  features/                 # Feature code (ui/, hooks/, types/, constants/)
    workflows/
    executions/
    credentials/
    dashboard/
  shared/                   # Cross-feature: PageLayout, Sidebar, TopBar, cn helper
  server/modules/           # Class-based controllers (auth, etc.)

supabase/
  migrations/               # SQL schema + RLS policies
  functions/                # Deno Edge Functions
    _shared/engine/         # Node runner, executors, NodeLogger
    webhook-ingest/
    execute-node/
```

Full annotated map → [`architecture.md`](architecture.md)

---

## Key Conventions

### Routes & API
- `app/**/page.tsx` — parse params, fetch data, compose feature UI. Keep thin.
- `app/api/**/route.ts` — thin adapter only; delegate to `src/server/modules/<name>/<name>.controller.ts`.
- Add `loading.tsx` / `error.tsx` / `not-found.tsx` at route level; don't replicate inside components.
- `"use client"` only where event handlers, browser APIs, or client hooks are needed.

### Feature modules (`src/features/<name>/`)
- Sub-folders: `ui/` (presentational only) · `hooks/` · `types/` · `constants/` · `store/` (Zustand, when needed).
- **No `index.ts` barrel re-exports.** Import files directly.
- `ui/*.tsx` = zero data-fetching, zero store access, zero navigation.

### State
| Kind | Tool |
| --- | --- |
| Local UI (open/closed) | `useState` |
| Shared between siblings | Lift to nearest parent |
| Server / async | React Query or SWR |
| Cross-feature / persisted | Zustand (`store/`) |
| Theme / color mode | `useAppTheme()` — never `useState` or `useColorScheme()` |

### Components & Props
- **≤ 5 props.** More → use composition, context, or group into an object.
- No prop drilling past 2 levels.
- No boolean explosion: `variant="primary"` not `primary large disabled`.
- No pass-through props — composition instead.

### Hooks
- One responsibility per hook.
- Name: `use<WhatItDoes>` — `useSaveWorkflow` ✅, `useWorkflowScreen` ❌.

### TypeScript
- Explicit prop interfaces everywhere. No `any`.
- Discriminated unions for mutually exclusive shapes.

### Naming
| Thing | Style |
| --- | --- |
| Variables & functions | `camelCase` |
| Classes | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` |
| Files | `kebab-case` |

### Error handling
- Throw specific, meaningful errors early. Never swallow silently.
- External API calls: validate inputs, set timeouts, treat responses as untrusted.

---

## Maintenance Rules

- **Update [`architecture.md`](architecture.md) in the same PR** whenever you add, move, remove, or materially change files under `src/` or `supabase/`.
- Keep functions under ~30 lines and pure where possible.
- No dead code, no unused imports, no debug `console.log` left behind.
- Install a new dependency only if necessary — add a comment explaining why.
- Never commit secrets or credentials.

---

## Checklist (run before opening a PR)

- [ ] Route entry point stays thin; logic lives in feature module or controller
- [ ] `ui/*.tsx` components are presentational only
- [ ] All props typed — no `any`
- [ ] Hooks split by concern, explicitly named
- [ ] State in the right layer (see table above)
- [ ] Errors handled explicitly with useful messages
- [ ] External calls have timeouts and input validation
- [ ] `architecture.md` updated if files changed
- [ ] No secrets, no dead code, no debug logs
