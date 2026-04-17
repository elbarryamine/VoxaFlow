# New feature template (Next.js App Router)

Use this when adding a user-facing feature screen in this Next.js app. Route entry points live in `app/`; frontend feature code lives in `src/features/`; backend domain logic lives in `src/server/modules/`.

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
└── ...                              # no index.ts re-export barrel

src/server/                          # backend only
└── modules/
    └── <module-name>/
        ├── <module-name>.controller.ts # class-based request + business logic
        ├── <module-name>.types.ts      # module input/output/domain types
        └── ...                         # import files directly, no index.ts barrel
```

Use **kebab-case** for `<route-segment>` and `<feature-name>`.
Use **kebab-case** for `<module-name>` as well.

## Backend controller style (simple)

- Use `route.ts` as a very thin pass-through adapter.
- Put request handling and business logic in a **controller** class.
- Name controller classes in **PascalCase** with `Controller` suffix (example: `ModuleController`).
- Keep each class focused on one module responsibility.
- Return `NextResponse` from controller methods.
- Service files are optional; add them only if controller methods become too large.
- Import module files directly (no `index.ts` re-export barrels).

## API usage example

```ts
// src/server/modules/<module-name>/<module-name>.controller.ts
export class ModuleController {
  async list() {
    try {
      const { user } = await getAuthenticatedUser();
      // Business logic can live here directly (or call optional service/repository)
      const items = [{ id: "item-1", label: "Example Item", userId: user.id }];
      return NextResponse.json({ items });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Unable to list items",
        },
        { status: 400 },
      );
    }
  }
}
```

```ts
// app/api/<module-name>/route.ts
const moduleController = new ModuleController();

export async function GET() {
  return moduleController.list();
}
```

## Screen pattern

1. Keep `app/<route-segment>/page.tsx` thin: parse route/search params, fetch data, and compose feature UI.
2. Move reusable UI and logic into `src/features/<feature-name>/`.
3. Add `"use client"` only where client-only behavior is required (event handlers, browser APIs, client state/hooks).
4. Prefer route-level files (`loading.tsx`, `error.tsx`, `not-found.tsx`) over ad-hoc in-component fallbacks when possible.
5. Define route metadata via `export const metadata` or `generateMetadata` in `page.tsx`/`layout.tsx` when needed.

## Checklist

1. **Route** — add `app/<route-segment>/page.tsx` (and optional `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
2. **Feature module** — add/update `src/features/<feature-name>/` folders only as needed (`ui`, `hooks`, `utils`, `constants`, `store`, `types`).
3. **Server module** — add/update `src/server/modules/<module-name>/` with class-based `<module-name>.controller.ts` that contains module logic and returns responses.
4. **Exports** — use named exports and direct file imports (no `index.ts` re-export barrels).
5. **Copy** — add user-facing text via the project's i18n setup (if enabled) instead of hardcoding repeated strings.
6. **Docs** — update [`architecture.md`](../architecture.md) in the same change when files under `src/` or `scripts/` are added, removed, or materially changed.

## References

- Components and props: [`docs/react.md`](react.md)
- Clean code conventions: [`docs/clean-code.md`](clean-code.md)
- Repo map: [`architecture.md`](../architecture.md)
