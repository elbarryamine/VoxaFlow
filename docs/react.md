# React Guide

UI components, props, state, and hooks. Routes and server modules → [`new-feature.md`](new-feature.md). General style → [`clean-code.md`](clean-code.md).

---

## Philosophy

- Components are **UI units**, not data pipelines. More than ~5 props usually means the split is wrong.
- Lift state to the **nearest** shared parent, not the top of the tree.
- Prefer **composition** over configuration props.

---

## Props

**≤ 5 props.** If you need more: children/render props, compound components, context, or a feature store.

**No drilling past 2 levels** — use composition, context, or Zustand (`store/`).

**Variants, not booleans:**

```tsx
// ❌
<Button primary large disabled loading />

// ✅
<Button variant="primary" size="lg" state="loading" />
```

**No pass-through props** — if a prop only exists to forward to a child, compose instead:

```tsx
// ❌
<Card title={title} avatar={avatar} badge={badge} />

// ✅
<Card>
  <CardHeader>
    <Avatar />
    <CardTitle />
    <Badge />
  </CardHeader>
</Card>
```

**Group related fields** into one object when they belong together (`user`, `execution`, etc.).

---

## Composition

- Prefer `children` over `content` / `body` props.
- Use **compound components** for tightly coupled UI (tabs, modals, accordions).
- `ui/*.tsx` is **presentation only** — no fetching, no store access, no `router.push` / `Link` navigation logic. Keep `ui/` flat (no nested `ui/foo/bar/`).

---

## State

| Need | Use |
| --- | --- |
| Local UI (open, hover) | `useState` |
| Siblings in same subtree | Lift to nearest parent |
| Server / async data | React Query or SWR — not `useState` for server payloads |
| Cross-feature / persisted client state | Zustand in `store/` |
| Complex transitions | `useReducer` |
| URL / deep links | Route/search params |
| Theme | `useTheme()` from `@/src/shared/theme/ThemeProvider` |

**Never:** theme via raw `useState` / `useColorScheme()` in features; dumping all client state into Zustand; syncing two `useState`s with `useEffect` when you can derive inline or `useMemo`.

---

## Hooks

- One responsibility per hook.
- Name: `use<WhatItDoes>` — `useSaveWorkflow` ✅, `useWorkflowScreen` ❌.
- Return only what the caller needs.

---

## TypeScript (components)

- Explicit prop interfaces on every component — no `any`.
- Optional props with `?`; defaults via destructuring.
- Discriminated unions for mutually exclusive prop shapes.

---

## Theme & styling

- Use `useTheme()` for light/dark — not ad-hoc `useColorScheme()` in feature code.
- Use semantic Tailwind tokens backed by CSS variables in `app/globals.css` — not raw hex in feature files.
- New palette values belong in `app/globals.css`, not scattered in components.

---

## Performance

Don't memoize by default — only when profiling shows a problem.

- `useMemo` — expensive derivations
- `useCallback` — stable callbacks passed to memoized children
- `React.memo` — pure `ui/` components that re-render often with the same props
- Avoid inline object/array literals in JSX when they are effect dependencies

---

## Anti-patterns

| Problem | Fix |
| --- | --- |
| 6+ props | Composition, object prop, or split component |
| Many callback props | Single handler with action/type |
| `useFeatureScreen` mega-hook | Split focused hooks |
| Logic in `ui/*.tsx` | Move to hook or route screen |
| `navigate('…' as any)` | Typed route params |
| Hex colors in features | `globals.css` variables + Tailwind tokens |

---

## Component checklist

- [ ] ≤5 props or justified split (composition / store / context)
- [ ] No drilling past 2 levels
- [ ] `ui/*.tsx` presentation-only
- [ ] Hooks named and scoped by concern
- [ ] All props typed — no `any`
- [ ] Theme via `useTheme()` and semantic tokens
- [ ] Memoization only where measured
