# Architecture

Annotated directory map of `src/` and `app/` routes.

## App Routes (`app/`)

```
app/
├── api/
│   ├── agents/
│   │   └── route.ts                    # Agent API — list/create authenticated user agents
│   ├── calls/
│   │   ├── route.ts                    # Calls API — list recent user call logs
│   │   └── start/
│   │       └── route.ts                # Start call API — validates payload, runs Vapi call service, persists call log
│   ├── phone-numbers/
│   │   ├── route.ts                    # Phone number API — list shared + assigned numbers
│   │   └── get/
│   │       └── route.ts                # Phone number assignment API — resolves shared/free or assigns paid dedicated number
│   └── workflows/
│       ├── route.ts                    # Workflow API — list user workflows
│       └── run/
│           └── route.ts                # Workflow run API — executes trigger dispatch and logs workflow runs
├── auth/
│   ├── callback/
│   │   └── route.ts                   # OAuth callback handler — exchanges Supabase auth code for a session cookie
│   ├── confirm/
│   │   └── route.ts                   # Email verification callback — verifies Supabase email token and redirects to sign-in
│   └── sign-in/
│       └── page.tsx                   # Sign-in screen — Supabase email/password authentication entry
├── globals.css                         # Global styles, Tailwind config, CSS variables
├── layout.tsx                          # Root layout — fonts, metadata, html/body shell
├── not-found.tsx                       # Global 404 page for unmatched routes and notFound() fallbacks
├── page.tsx                            # Root page — redirects to /dashboard for authenticated users, /auth/sign-in otherwise
└── dashboard/
    ├── layout.tsx                      # Dashboard shell — sidebar + main content area
    ├── page.tsx                        # Dashboard overview — stats, agent/workflow previews, activity feed
    ├── calls/
    │   └── page.tsx                    # Calls page — manual outbound call trigger and persisted call history
    ├── agents/
    │   ├── page.tsx                    # Agent list — grid of AgentCards with "New Agent" CTA
    │   └── new/
    │       └── page.tsx               # Create agent form — name, prompt, voice picker, language
    ├── workflows/
    │   ├── page.tsx                    # Workflow list — grid of WorkflowCards with "New Workflow" CTA
    │   └── new/
    │       └── page.tsx               # Workflow canvas — drag-and-drop React Flow editor
    ├── connections/
    │   ├── page.tsx                    # Connections list — grouped by provider, edit/delete credentials
    │   └── [id]/
    │       └── page.tsx               # Connection form — create (`new`) and edit (`conn-*`) route
    ├── phone-numbers/
    │   └── page.tsx                    # Phone number list — VoiceFlow & Twilio numbers, import modal
    └── settings/
        └── page.tsx                    # Workspace settings — profile, notifications, compliance, routing, billing

proxy.ts                                 # Route guard proxy — refreshes Supabase session and protects /dashboard/*
```

## Source (`src/`)

```
src/
├── shared/
│   ├── ui/
│   │   ├── Sidebar.tsx                # App-wide sidebar navigation (dashboard, agents, workflows, connections, phone-numbers, settings)
│   │   ├── TopBar.tsx                 # Page header bar with title, description, actions, search, notifications, theme toggle
│   │   ├── PageLayout.tsx             # Shared dashboard page shell — optional TopBar + centralized scroll container/padding
│   │   ├── StatCard.tsx               # Metric card — icon, value, label, trend indicator
│   │   ├── EmptyState.tsx             # Placeholder for empty lists — icon, title, description, optional action
│   │   └── index.ts                   # Public barrel for shared UI
│   └── theme/
│       ├── ThemeProvider.tsx          # Global light/dark theme context with localStorage persistence
│       ├── ThemeToggle.tsx            # Reusable icon toggle button for switching dark/light mode
│       └── index.ts                   # Public barrel for theme utilities
│   └── server/
│       ├── auth.ts                    # Server auth helper — returns authenticated user + Supabase server client
│       └── env.ts                     # Server environment validation helpers (Twilio, Vapi, limits)
│   └── integrations/
│       ├── twilio.ts                  # Twilio REST client helpers for on-demand dedicated number purchase
│       └── vapi.ts                    # Vapi REST client helper for outbound AI call creation
│   └── services/
│       ├── agent-service.ts           # Agent domain service — create/list user agents
│       ├── phone-number-service.ts    # Number resolution service — free shared or paid dedicated assignment
│       ├── call-service.ts            # Call execution service — validates, rate-limits, invokes Vapi, logs calls
│       └── workflow-service.ts        # Workflow executor — matches trigger, starts calls, logs workflow runs
│   └── utils/
│       ├── cn.ts                      # Class name helper — clsx + tailwind-merge utility
│       ├── supabase-client.ts         # Supabase browser client singleton with env validation
│       ├── supabase-server.ts         # Supabase server client factory for App Router guards/session checks
│       └── supabase-middleware.ts     # Middleware session updater + user lookup helper for protected routes
│
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   ├── SignInForm.tsx         # Client sign-in form — submits Supabase email/password auth
│   │   │   └── index.ts
│   │   └── index.ts                   # Public barrel for auth feature
│   │
│   ├── dashboard/
│   │   ├── ui/
│   │   │   ├── RecentActivity.tsx     # Activity panel — static examples + live aggregate count
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── agents/
│   │   ├── types/
│   │   │   └── Agent.types.ts         # Agent, AgentVoice, AgentLanguage type definitions
│   │   ├── constants/
│   │   │   └── MOCK_AGENTS.ts         # Seed data — 4 sample agents (sales, support, appointment, survey)
│   │   ├── ui/
│   │   │   ├── AgentCard.tsx          # Agent list item — name, status badge, stats (calls, duration, rate)
│   │   │   ├── AgentForm.tsx          # Create/edit agent form — basic info, voice grid, language pills
│   │   │   └── index.ts
│   │   └── index.ts                   # Public barrel for agents feature
│   │
│   ├── connections/
│   │   ├── types/
│   │   │   └── Connection.types.ts    # Connection, ConnectionType, ConnectionStatus, credential field definitions
│   │   ├── constants/
│   │   │   └── MOCK_CONNECTIONS.ts    # Seed data — 8 sample connections across all provider types
│   │   ├── store/
│   │   │   └── useConnectionsStore.ts # Zustand store — add, update, delete, getByType
│   │   ├── ui/
│   │   │   ├── ConnectionCard.tsx     # Provider card — name, status badge, test/edit/delete menu
│   │   │   ├── ConnectionForm.tsx     # Type-aware credential form — used standalone and compact/inline
│   │   │   ├── ConnectionPicker.tsx   # Node config widget — filtered dropdown + inline add-new form
│   │   │   └── index.ts
│   │   └── index.ts                   # Public barrel for connections feature
│   │
│   ├── phone-numbers/
│   │   ├── types/
│   │   │   └── PhoneNumber.types.ts   # PhoneNumber, PhoneNumberProvider, PhoneNumberStatus, PhoneNumberCapability
│   │   ├── constants/
│   │   │   └── MOCK_PHONE_NUMBERS.ts  # Seed data — 6 sample numbers (VoiceFlow-owned + Twilio-imported)
│   │   ├── ui/
│   │   │   ├── PhoneNumberCard.tsx    # Number card — flag, provider badge, capability icons, assigned agent
│   │   │   ├── ImportTwilioModal.tsx  # 3-step modal — credentials → select numbers → done
│   │   │   └── index.ts
│   │   └── index.ts                   # Public barrel for phone-numbers feature
│   │
│   └── workflows/
│       ├── types/
│       │   └── Workflow.types.ts      # Workflow, WorkflowNodeType, WorkflowNodeData type definitions
│       ├── constants/
│       │   ├── MOCK_WORKFLOWS.ts      # Seed data — 3 sample workflows (lead qual, support, reminder)
│       │   └── NODE_TEMPLATES.ts      # Palette items — trigger/intelligent/normal action templates for drag-and-drop
│       ├── hooks/
│       │   └── useWorkflowCanvas.ts   # React Flow state — nodes, animated dashed edges, drag-and-drop, node selection/config editing
│       ├── ui/
│       │   ├── WorkflowCard.tsx        # Workflow list item — name, status, agent tag, run count
│       │   ├── WorkflowCanvas.tsx      # Full-page canvas editor — toolbar, palette, React Flow viewport, node settings sidebar
│       │   ├── WorkflowNode.tsx        # Custom React Flow node — icon, label, config summary badge, condition yes/no outputs
│       │   ├── NodeConfigSidebar.tsx   # Right sidebar — dispatches to per-node config component, common fields + close button
│       │   ├── NodePalette.tsx         # Draggable component sidebar — grouped by triggers/intelligent actions/normal actions
│       │   ├── components/
│       │   │   └── node-configs/       # Per-node-type configuration forms
│       │   │       ├── shared.tsx                    # Reusable form primitives (FieldLabel, TextInput, SelectInput, TextAreaInput, etc.)
│       │   │       ├── InboundCallConfig.tsx         # Trigger — inbound customer call config + assigned agent
│       │   │       ├── OutboundCallConfig.tsx        # Trigger — outbound call config + assigned agent
│       │   │       ├── ShopifyTriggerConfig.tsx      # Trigger — Shopify event config + assigned agent
│       │   │       ├── LightfunnelsTriggerConfig.tsx # Trigger — Lightfunnels event config + assigned agent
│       │   │       ├── YoucanTriggerConfig.tsx       # Trigger — YouCan event config + assigned agent
│       │   │       ├── CustomWebhookTriggerConfig.tsx # Trigger — generated/custom POST URL + assigned agent
│       │   │       ├── AICustomModelConfig.tsx       # Intelligent action — custom model selection and prompt
│       │   │       ├── ConditionConfig.tsx           # Intelligent action — field or AI decision branching
│       │   │       ├── SlackIntegrationConfig.tsx    # Normal action — send Slack message template
│       │   │       ├── SpreadsheetIntegrationConfig.tsx # Normal action — write spreadsheet row
│       │   │       ├── EmailIntegrationConfig.tsx    # Normal action — send email template
│       │   │       ├── WebhookIntegrationConfig.tsx  # Normal action — call external API endpoint
│       │   │       └── index.ts                      # Barrel export for all node config components
│       │   └── index.ts
│       └── index.ts                   # Public barrel for workflows feature
```
