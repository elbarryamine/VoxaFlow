# Architecture

UI-only app with Supabase Auth.

## App Routes (`app/`)

```
app/
├── auth/
│   ├── callback/
│   │   └── route.ts                    # OAuth callback handler — exchanges Supabase auth code for a session cookie
│   ├── confirm/
│   │   └── route.ts                    # Email verification callback — verifies Supabase email token and redirects to sign-in
│   └── sign-in/
│       └── page.tsx                    # Sign-in screen — Supabase email/password authentication entry
├── dashboard/
│   ├── layout.tsx                      # Dashboard shell — sidebar + main content area
│   ├── page.tsx                        # Dashboard overview — static mock stats/cards
│   ├── executions/
│   │   └── page.tsx                    # Executions page — list of workflow runs
│   ├── workflows/
│   │   ├── page.tsx                    # Workflows page — list of automation flows
│   │   └── new/
│   │       └── page.tsx                # Workflow canvas UI
│   ├── connections/
│   │   ├── page.tsx                    # Connections list UI
│   │   └── [id]/
│   │       └── page.tsx                # Connection form UI
│   └── settings/
│       └── page.tsx                    # Workspace settings UI
├── layout.tsx                          # Root layout
├── globals.css                         # Global styles
├── not-found.tsx                       # 404 page
└── page.tsx                            # Auth-aware root redirect

proxy.ts                                # Middleware auth gate for /dashboard/*
```

## Source (`src/`)

```
src/
├── server/
│   └── modules/
│       └── auth/
│           ├── auth.service.ts         # Auth module helper — returns authenticated user + Supabase server client
│           └── ...                     # Direct file imports (no index.ts re-export barrel)
├── shared/
│   ├── utils/
│   │   ├── cn.ts                       # Class name helper
│   │   ├── supabase-client.ts          # Browser Supabase client
│   │   ├── supabase-server.ts          # Server Supabase client factory
│   │   └── supabase-middleware.ts      # Middleware session updater
│   ├── ui/
│   │   └── index.ts                    # Shared UI barrel
│   └── theme/
│       └── index.ts                    # Theme barrel
└── features/
    ├── auth/                           # Sign-in UI
    ├── dashboard/                      # Dashboard widgets
    ├── executions/                     # Execution types, mock data, cards
    ├── workflows/                      # Workflow types, mock data, canvas components
    └── connections/                    # Connection types, mock data, forms, store
```
