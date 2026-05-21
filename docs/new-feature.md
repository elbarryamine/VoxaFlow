# New Feature

Scaffold for routes, feature modules, and API controllers. React UI rules → [`react.md`](react.md). Style → [`clean-code.md`](clean-code.md). Paths → [`architecture.md`](../architecture.md).

---

## Layout

```text
app/<route-segment>/              # kebab-case
  page.tsx                        # thin entry (Server Component by default)
  layout.tsx                      # optional
  loading.tsx                     # optional
  error.tsx                       # optional (client boundary)
  not-found.tsx                   # optional

src/features/<feature-name>/      # optional; recommended when non-trivial
  ui/                             # presentational only — see react.md
  hooks/
  utils/
  constants/
  store/                          # optional Zustand
  types/

src/server/modules/<module-name>/
  <module-name>.controller.ts     # PascalCase class, returns NextResponse
  <module-name>.types.ts
```

**Naming:** kebab-case for route segments, feature folders, module folders, and file names. **No `index.ts` barrels** — import files directly.

---

## Routes (`app/`)

1. Keep `page.tsx` thin: params, data fetch, compose feature UI.
2. Put reusable UI and logic in `src/features/<feature-name>/`.
3. `"use client"` only for handlers, browser APIs, or client hooks/state.
4. Prefer route-level `loading.tsx` / `error.tsx` / `not-found.tsx` over one-off in-component fallbacks.
5. `export const metadata` or `generateMetadata` in `page.tsx` / `layout.tsx` when needed.

---

## API (`app/api/` + `src/server/modules/`)

`route.ts` is a thin adapter; logic lives in a controller class.

```ts
// src/server/modules/items/items.controller.ts
export class ItemsController {
  async list() {
    try {
      const { user } = await getAuthenticatedUser();
      const items = [{ id: "item-1", label: "Example", userId: user.id }];
      return NextResponse.json({ items });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unable to list items" },
        { status: 400 },
      );
    }
  }
}
```

```ts
// app/api/items/route.ts
const itemsController = new ItemsController();

export async function GET() {
  return itemsController.list();
}
```

- Class name: `PascalCase` + `Controller` suffix.
- One module per responsibility; optional service/repository files only when methods grow large.
- Named exports throughout.

---

## Feature checklist

1. **Route** — `app/<route-segment>/page.tsx` (+ optional layout/loading/error/not-found).
2. **Feature** — add only needed folders under `src/features/<feature-name>/`.
3. **Server** — `src/server/modules/<module-name>/` with controller + types.
4. **i18n** — user-facing strings via project i18n when enabled, not duplicated literals.
5. **Docs** — update [`architecture.md`](../architecture.md) when `src/` or `supabase/` files are added, removed, or materially changed.
