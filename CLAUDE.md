# Agent Guide

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Realtime + Edge Functions) · Zustand · XYFlow · Phosphor Icons

---

## Where to read first

| You're working on… | Read |
| --- | --- |
| React components, props, state, hooks | [`docs/react.md`](docs/react.md) |
| New route, feature module, or API controller | [`docs/new-feature.md`](docs/new-feature.md) |
| Naming, functions, errors, agent scope | [`docs/clean-code.md`](docs/clean-code.md) |
| File paths and repo map | [`architecture.md`](architecture.md) |
| Workflow execution engine (Supabase) | [`docs/backend-execution.md`](docs/backend-execution.md) |

If a path isn't in context, open [`architecture.md`](architecture.md) before guessing locations.

---

## Repo-specific rules (not covered elsewhere)

- **Update [`architecture.md`](architecture.md) in the same PR** when you add, move, remove, or materially change files under `src/` or `supabase/`.
- **No `index.ts` barrels** under `src/features/` or `src/server/modules/` — import files directly.
- **Never commit secrets** or credentials.
- **New dependencies** only when necessary; add a short comment explaining why.

---

## Pre-PR checklist

Confirm against the linked guides — don't duplicate their rules here:

- [ ] [`docs/new-feature.md`](docs/new-feature.md) — thin routes, feature/server layout, `architecture.md` updated if needed
- [ ] [`docs/react.md`](docs/react.md) — presentation `ui/`, props/state/hooks, theme via `useTheme()`
- [ ] [`docs/clean-code.md`](docs/clean-code.md) — focused functions, explicit errors, no dead code or debug logs
