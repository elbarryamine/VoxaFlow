<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:coding-agent-rules -->

# Agent Guide

Read the guide that matches the work **before** writing or refactoring code.

## Doc map

| Topic                                                        | Document                                     |
| ------------------------------------------------------------ | -------------------------------------------- |
| React components and props                                   | [`docs/react.md`](docs/react.md)             |
| New feature under `src/features/` (layout, navigation, i18n) | [`docs/new-feature.md`](docs/new-feature.md) |
| Code style and structure                                     | [`docs/clean-code.md`](docs/clean-code.md)   |

## Repo tree and file lookup

Annotated directory map: [`architecture.md`](architecture.md) (`src/` and `scripts/`, per-file blurbs).

- **Lookup** — If the path you need is not already in context, read `architecture.md` first, then open or search specific files.
- **Maintenance** — Update `architecture.md` in the **same change** when you add, move, remove, or materially change files under `src/` or `scripts/`.

<!-- END:coding-agent-rules -->
