# React Component Guide

Applies on top of root `AGENTS.md` — both always in effect.

## 1. Core Philosophy

- Components are UI units, not data pipelines. >4–5 props = doing too much.
- Lift state to the **right** level, not the highest. Co-locate close to usage.
- Prefer **composition** over configuration.

## 2. Prop Discipline

**5-Prop Rule:** If >5 props, ask: use context/`useAppTheme()`? Use children/render props? Split into `ui/*.tsx`? Move to Zustand store?

**No prop drilling past 2 levels** — use Zustand, Context, or composition instead.

**Avoid boolean explosion:**

```tsx
❌ <Button primary large disabled loading />
✅ <Button variant="primary" size="lg" state="loading" />
```

**Avoid pass-through props** — if a prop is only forwarded to a child, the abstraction is wrong. Use composition:

```tsx
❌ <Card title={title} avatar={avatar} badge={badge} />
✅ <Card><CardHeader><Avatar /><CardTitle /><Badge /></CardHeader></Card>
```

**Group related props into objects:**

```tsx
❌ <UserCard firstName="Jane" lastName="Doe" avatarUrl="..." role="admin" />
✅ <UserCard user={{ firstName, lastName, avatarUrl, role }} />
```

---

## 3. Composition Patterns

- Prefer `children` over content props.
- Use **compound components** for tightly coupled UI (tabs, modals, accordions).
- `ui/*.tsx` = **presentation only** — no fetching, no store access, no navigation.

---

## 4. State Decision Tree

| State type                    | Solution                           |
| ----------------------------- | ---------------------------------- |
| Local UI (open/closed, hover) | `useState`                         |
| Shared between siblings       | Lift to nearest parent             |
| Server/async data             | React Query / SWR                  |
| Cross-feature / persisted     | Zustand (`stores/`)                |
| Complex with transitions      | `useReducer`                       |
| URL / deep-link driven        | Nav params via `types.ts`          |
| Theme / color mode            | `useAppTheme()` — never `useState` |

**Never:** put server data in `useState`, dump everything in Zustand, or call `useColorScheme()` directly in features.

---

## 5. Hook Rules

- One responsibility per hook.
- Name: `use<WhatItDoes>` — explicit (`useSaveProductItems` ✅, `useProductScreen` ❌).
- Return only what the caller needs.

---

## 6. TypeScript Rules

- Always define explicit prop interfaces — no `any`.
- Mark optional props with `?`, default via destructuring.
- Use discriminated unions for mutually exclusive shapes.
- Never `as any` in navigation calls — use typed params from `types.ts`.

---

## 7. Performance

Don't memoize by default — only when profiler confirms a problem.

- `useMemo` → expensive derivations.
- `useCallback` → callbacks to memoized children.
- `React.memo` → pure `ui/` components with frequent identical renders.
- Never inline objects/arrays in JSX used as effect dependencies.

---

## 8. Agent Checklist

- [ ] ≤5 props, or justified via composition/store/context?
- [ ] No prop drilling past 2 levels?
- [ ] State co-located as close to usage as possible?
- [ ] No pass-through props?
- [ ] `ui/*.tsx` presentation-only?
- [ ] Hooks split by concern, explicitly named?
- [ ] All props typed — no `any`?
- [ ] `useAppTheme()` for all styling — no raw hex, no `useColorScheme()`?
- [ ] New theme values in `src/theme/tokens/`, not inline?
- [ ] Memoization only where demonstrated?

---

## 9. Anti-Patterns — Never Generate

| Anti-Pattern                              | Fix                                |
| ----------------------------------------- | ---------------------------------- |
| 6+ props on a component                   | Composition or object prop         |
| Multiple callback props                   | Single `onChange` with action type |
| `useFeatureScreen` mega hook              | Split into focused hooks           |
| `useState` / `useColorScheme()` for theme | `useAppTheme()`                    |
| Hex colors in feature files               | Add to `src/theme/tokens/`         |
| `navigate('Screen' as any)`               | Typed params via `types.ts`        |
| Logic inside `ui/*.tsx`                   | Move to hook or screen             |
| `useEffect` to sync two `useState`s       | Compute inline or `useMemo`        |
| Nested `ui/foo/bar/` folders              | Keep `ui/` flat                    |
