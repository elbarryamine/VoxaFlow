# Architecture

Workflow Automation platform with Supabase backend and Next.js frontend.

## App Routes (`app/`)

```
app/
├── auth/                               # Supabase Authentication routes
│   ├── callback/route.ts               # OAuth callback handler
│   ├── confirm/route.ts                # Email verification handler
│   └── sign-in/page.tsx                # Thin entry → SignInScreen
├── dashboard/                          # Protected dashboard area
│   ├── layout.tsx                      # Dashboard shell (Sidebar + Main)
│   ├── page.tsx                        # Overview with stats and recent activity
│   ├── workflows/                      # Workflow management
│   │   ├── page.tsx                    # Workflows list
│   │   ├── new/page.tsx                # Create new workflow
│   │   ├── templates/page.tsx          # Workflow templates gallery
│   │   └── [id]/page.tsx               # Workflow editor (Canvas)
│   ├── executions/                     # Run history
│   │   ├── page.tsx                    # List of all runs
│   │   └── [id]/page.tsx               # Detailed execution logs/steps
│   ├── credentials/                    # API Credentials / Auth keys
│   │   └── page.tsx                    # List of stored credentials
│   ├── connections/                    # (Legacy) Moving to Credentials
│   │   └── [id]/page.tsx               # Connection configuration form
│   └── settings/                       # Workspace & Profile settings
├── api/                                # Next.js API Routes
│   ├── workflows/                      # GET (list), POST (create)
│   ├── workflows/[id]/                 # GET, PATCH (save), DELETE
│   ├── workflows/[id]/test/            # POST (trigger test execution)
│   ├── credentials/                    # GET (list), POST (create)
│   ├── credentials/[id]/               # DELETE
│   └── executions/                     # Run management & logs
├── page.tsx                            # Public landing (logged-in → dashboard)
├── layout.tsx                          # Root layout with providers
└── globals.css                         # Global styles & Tailwind config
```

## Source (`src/`)

```
src/
├── features/
│   ├── workflows/                      # Workflow-specific logic
│   │   ├── ui/                         # WorkflowCanvas, WorkflowNode, NodePalette, NodeTypeIcon
│   │   ├── types/                      # Workflow & Node TypeScript definitions
│   │   ├── constants/                  # Node templates, NODE_TYPE_ICONS (brand SVG paths)
│   │   └── hooks/                      # Modular hooks (State, Palette, Events, etc.)
│   ├── executions/                     # Run history UI, hooks (live data), types
│   ├── credentials/                    # CredentialCard, CredentialsList; CREDENTIAL_SERVICES; Credential.types
│   │   ├── constants/                  # CREDENTIAL_SERVICES — per-service icons, fields, rail colors
│   │   ├── types/                      # Credential, CredentialService
│   │   └── ui/                         # CredentialCard, CredentialsList (grouped by service)
│   ├── dashboard/                      # DashboardOverview, usage + KPI (recharts), loadDashboardData (server)
│   ├── auth/                           # SignInScreen, SignInHero, SignInFeatureShowcase, SignInForm; AUTH_UI
│   ├── landing/                        # Marketing: home, pricing, privacy, terms; LANDING_COPY, LEGAL_COPY, …
│   │   ├── constants/                  # LANDING_COPY, PRICING_COPY, LEGAL_COPY, LANDING_FLOWS
│   │   ├── hooks/                      # useLandingFlowDemo — flow rotation + cursor path
│   │   └── ui/                         # MarketingShell, LandingFooter, PricingPage, LandingWorkflowCanvas, …
│   └── settings/                       # SettingsScreen, internal nav + panel layout
├── shared/                             # Cross-cutting concerns
│   ├── constants/                      # BRAND, plans (pricing limits)
│   ├── ui/                             # PageLayout, TopBar, TopBarButton, ModalShell, Sidebar, AurenLogo, EmptyState
│   ├── utils/                          # Supabase clients, realtime auth, cn helper
│   └── theme/                          # ThemeProvider, favicon swap (theme-aware tab icon)
└── server/                             # Server-side specific logic
    └── modules/auth/                   # Auth helpers
```

## Backend (`supabase/`)

```
supabase/
├── migrations/                         # SQL schema and RLS policies
│   └── 20260521000000_initial_schema.sql             # Full schema: workflows, executions, node_executions, node_execution_logs, credentials, RLS, realtime
└── functions/                          # Edge Functions (Deno)
    ├── _shared/                        # Shared engine logic & executors
    │   └── engine/
    │       ├── NodeLogger.ts           # Inserts structured log rows to node_execution_logs during execution;
    │       │                           #   instantiated in execute-node with the node_executions.id UUID
    │       ├── runExecuteNode.ts       # Core node runner + in-process invokeExecuteNode (no edge-to-edge HTTP)
    │       ├── types.ts                # Core types — ExecutionContext includes logger: NodeLogger
    │       ├── ExecutionContext.ts     # Builds ExecutionContext; accepts and exposes NodeLogger instance
    │       ├── executors/actions/      # SendEmail, ApiRequest, Slack, OpenAI — all emit log lines via context.logger
    │       └── executors/logic/        # Condition, Delay, Trigger — all emit log lines via context.logger
    ├── webhook-ingest/                 # Entry point for external triggers
    └── execute-node/                   # HTTP entry for runExecuteNode (dashboard test route still invokes this)
```
