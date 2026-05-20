# Architecture

Workflow Automation platform with Supabase backend and Next.js frontend.

## App Routes (`app/`)

```
app/
├── auth/                               # Supabase Authentication routes
│   ├── callback/route.ts               # OAuth callback handler
│   ├── confirm/route.ts                # Email verification handler
│   └── sign-in/page.tsx                # Sign-in screen
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
├── layout.tsx                          # Root layout with providers
└── globals.css                         # Global styles & Tailwind config
```

## Source (`src/`)

```
src/
├── features/
│   ├── workflows/                      # Workflow-specific logic
│   │   ├── ui/                         # WorkflowCanvas, WorkflowNode, etc.
│   │   ├── types/                      # Workflow & Node TypeScript definitions
│   │   ├── constants/                  # Node templates & mock data
│   │   └── hooks/                      # Modular hooks (State, Palette, Events, etc.)
│   ├── executions/                     # Run history UI and types
│   ├── credentials/                    # Credential management UI and forms
│   └── dashboard/                      # Dashboard summary widgets
├── shared/                             # Cross-cutting concerns
│   ├── ui/                             # PageLayout, TopBar, Sidebar, Modals
│   ├── utils/                          # Supabase clients, cn helper
│   └── theme/                          # ThemeProvider & Dark mode logic
└── server/                             # Server-side specific logic
    └── modules/auth/                   # Auth helpers
```

## Backend (`supabase/`)

```
supabase/
├── migrations/                         # SQL schema and RLS policies
│   ├── 20260510000000_workflow_execution_schema.sql  # Core tables (workflows, executions, node_executions, credentials)
│   ├── 20260520000001_node_execution_timing.sql      # Adds started_at/finished_at to node_executions
│   └── 20260520000002_node_execution_logs.sql        # Adds node_execution_logs table (per-step log lines)
└── functions/                          # Edge Functions (Deno)
    ├── _shared/                        # Shared engine logic & executors
    │   └── engine/
    │       ├── NodeLogger.ts           # Inserts structured log rows to node_execution_logs during execution;
    │       │                           #   instantiated in execute-node with the node_executions.id UUID
    │       ├── types.ts                # Core types — ExecutionContext includes logger: NodeLogger
    │       ├── ExecutionContext.ts     # Builds ExecutionContext; accepts and exposes NodeLogger instance
    │       ├── executors/actions/      # SendEmail, ApiRequest, Slack, OpenAI — all emit log lines via context.logger
    │       └── executors/logic/        # Condition, Delay, Trigger — all emit log lines via context.logger
    ├── webhook-ingest/                 # Entry point for external triggers
    └── execute-node/                   # Individual node execution runner; instantiates NodeLogger after marking node running
```
