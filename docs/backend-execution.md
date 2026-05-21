# Workflow Execution Architecture

> **Stack:** Next.js 16 · Supabase (Postgres + Realtime + Edge Functions) · Deno  
> **Model:** Step-based DAG — one node step per engine invocation, state in Postgres

**Related:** [`architecture.md`](../architecture.md) (file map) · [`CLAUDE.md`](../CLAUDE.md) (agent entry) · [`new-feature.md`](new-feature.md) (routes/API layout)

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level System Diagram](#2-high-level-system-diagram)
3. [Database Schema](#3-database-schema)
4. [Core Types](#4-core-types)
5. [Engine & Entry Points](#5-engine--entry-points)
6. [Node Identity](#6-node-identity)
7. [Variable Interpolation](#7-variable-interpolation)
8. [Condition Nodes & Branching](#8-condition-nodes--branching)
9. [Fan-In (Join / Merge)](#9-fan-in-join--merge)
10. [Structured Logging](#10-structured-logging)
11. [Error Handling & Retries](#11-error-handling--retries)
12. [Credential Vault](#12-credential-vault)
13. [Executor Registry](#13-executor-registry)
14. [RLS & Realtime](#14-rls--realtime)
15. [Maintenance (planned)](#15-maintenance-planned)
16. [Directory Structure](#16-directory-structure)
17. [Trade-offs & Roadmap](#17-trade-offs--roadmap)

---

## 1. Architecture Philosophy

### Why not one monolithic BFS

A single Edge Function that walks the whole DAG hits the wall-clock limit (~400s). Slow APIs, parallel branches, or delays kill the run with no per-node recovery.

### Step-based execution

Each graph node is processed in **one engine step**. Output is written to `node_executions`; downstream nodes are scheduled from there.

```
node A completes → DB row success → invokeExecuteNode(B), invokeExecuteNode(C)
node B completes → invokeExecuteNode(D)  (deferred until C succeeds if fan-in)
```

**Benefits:** fresh timeout budget per HTTP entry; crash-safe state in Postgres; parallel branches without threads; per-node retries; full audit trail + live logs.

### In-process downstream calls

Downstream nodes are invoked via **`invokeExecuteNode`** inside `runExecuteNode.ts` — not edge-to-edge HTTP. That avoids JWT issues when one function calls another.

HTTP to `execute-node` is only for **external entry** (webhook, dashboard test, rerun API). Once inside the engine, the chain stays in-process until the branch finishes or defers.

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        TRIGGER LAYER                         │
│                                                             │
│  External webhook ──► webhook-ingest (Edge Function)        │
│  Canvas "Test"      ──► POST /api/workflows/[id]/test       │
│  Rerun              ──► POST /api/executions/[id]/rerun     │
│                           • Create executions row           │
│                           • Insert pending node_executions  │
│                           • HTTP → execute-node (first hop) │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXECUTION LAYER                         │
│                                                             │
│  execute-node/index.ts  →  runExecuteNode()                 │
│                                                             │
│   1. Fan-in gate (parents success / skip failed branch)     │
│   2. NodeLogger + interpolate config                        │
│   3. ExecutorRegistry.get(node.data.type)                   │
│   4. Write node_executions + logs                           │
│   5. invokeExecuteNode() for each downstream (in-process)   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Supabase)                     │
│                                                             │
│  workflows · executions · node_executions ·                 │
│  node_execution_logs · credentials                          │
│  Realtime on executions, node_executions, node_execution_logs│
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

Source of truth: `supabase/migrations/20260521000000_initial_schema.sql`.

### `workflows`

Canvas definition stored as JSONB.

```sql
CREATE TABLE workflows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  definition    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `executions`

One row per workflow run.

```sql
CREATE TABLE executions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id     UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','running','success','failed','timed_out')),
  trigger_payload JSONB NOT NULL DEFAULT '{}',
  finished_at     TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `node_executions`

Per-node state within a run — enables step-based execution between invocations.

```sql
CREATE TABLE node_executions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id  UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  node_id       TEXT NOT NULL,
  node_type     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','running','success','failed','skipped')),
  input_data    JSONB NOT NULL DEFAULT '{}',
  output_data   JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  retry_count   INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (execution_id, node_id)
);
```

### `node_execution_logs`

Structured log lines for the execution detail UI (Realtime-enabled).

```sql
CREATE TABLE node_execution_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_execution_id UUID NOT NULL REFERENCES node_executions(id) ON DELETE CASCADE,
  level             TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error')),
  message           TEXT NOT NULL,
  data              JSONB,
  elapsed_ms        INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `credentials`

Encrypted API keys; configs store `credentialId` only.

```sql
CREATE TABLE credentials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  service        TEXT NOT NULL,
  encrypted_data JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);
```

---

## 4. Core Types

Defined in `supabase/functions/_shared/engine/types.ts`.

| Type | Role |
| --- | --- |
| `WorkflowDefinition` | `{ nodes, edges }` from the canvas |
| `WorkflowNode` | `id`, React Flow `type`, `data` (config + **`data.type`** executor key) |
| `ExecutionContext` | `state`, `interpolate()`, `resolveCredential()`, **`logger: NodeLogger`** |
| `ExecutionResult` | `status`, `output`, `error`, optional `branchTarget` |
| `NodeExecutor` | `execute(node, context) → ExecutionResult` |

---

## 5. Engine & Entry Points

### Layering

| File | Responsibility |
| --- | --- |
| `execute-node/index.ts` | Thin HTTP handler: parse `{ executionId, nodeId }`, call `runExecuteNode` |
| `runExecuteNode.ts` | Full engine: fan-in, run executor, write results, schedule downstream |
| `invokeExecuteNode()` | In-process wrapper around `runExecuteNode` (retries + downstream) |
| `webhook-ingest/index.ts` | Create execution + pending rows, `await invokeExecuteNode` per trigger |
| `executors/init.ts` | Register all executors on module load |

### `webhook-ingest` (external webhook)

1. Load workflow by `workflowId` query param.
2. Insert `executions` (`status: running`, `trigger_payload` from body).
3. Find trigger nodes (no incoming edges).
4. Insert `node_executions` (`pending`).
5. **`await Promise.all(triggerNodes.map(n => invokeExecuteNode(...)))`** — must await; fire-and-forget fetch is cancelled on function exit.
6. Return `{ executionId }` immediately (caller does not wait for DAG completion).

### Dashboard test (`app/api/workflows/[id]/test/route.ts`)

Same data setup as webhook, but:

- Auth via Supabase session (`user_id` scoped).
- Mock payload from `node.data.testMockData` or `DEFAULT_TRIGGER_MOCK_DATA`.
- First hop via `supabase.functions.invoke('execute-node', { body })` (HTTP entry only).

### `runExecuteNode` flow (summary)

1. Load execution + workflow definition; bail if execution already `failed`.
2. **Fan-in:** all parent `node_executions` must be `success`. If any parent is terminal but not all success → mark this node `skipped`. Else → `deferred`.
3. Mark node `running`; create **`NodeLogger(node_executions.id)`**.
4. Build `state` from `trigger_payload` + successful siblings' `output_data`.
5. `buildExecutionContext` → interpolate `node.data`.
6. `ExecutorRegistry.get(node.data.type)` → `execute()`.
7. Persist `input_data`, `output_data`, `status`, `error_message`, `finished_at`.
8. On failure: retry via `invokeExecuteNode` if `retry_count < node.data.maxRetries`, else `maybeMarkExecutionFailed`.
9. On success: follow active edges (`branchTarget` filters condition handles); insert pending downstream rows; **`Promise.all(downstream.map(invokeExecuteNode))`**.
10. Leaf node → `maybeMarkExecutionComplete`.

See `runExecuteNode.ts` for the full implementation — do not duplicate logic in this doc.

---

## 6. Node Identity

**Executor lookup uses `node.data.type`**, not React Flow's top-level `node.type`.

`node_executions.node_type` stores the same value (`data.type` with fallback to `node.type` on insert).

Trigger types registered in `init.ts`: `webhook-shopify`, `webhook-lightfunnels`, `webhook-youcan`, `webhook-custom` (all use `TriggerExecutor`).

---

## 7. Variable Interpolation

Syntax: `{{path.to.value}}` (n8n-style).

| Template | Resolves from |
| --- | --- |
| `{{trigger.email}}` | `executions.trigger_payload` |
| `{{node_abc.body.id}}` | `output_data` of node `node_abc` |

Implementation: `ExecutionContext.ts` — custom path resolver (supports `foo[0].bar`), recursive over strings/objects/arrays. Credentials are **not** interpolated; use `resolveCredential(credentialId)`.

---

## 8. Condition Nodes & Branching

`ConditionExecutor` returns `branchTarget: 'true' | 'false'` matching `sourceHandle` on outgoing edges.

- Active handle → downstream nodes enqueued (`pending` + `invokeExecuteNode`).
- Inactive handle → targets inserted as `skipped` (if row did not exist).

Canvas: two outgoing handles per condition node (`true` / `false`).

---

## 9. Fan-In (Join / Merge)

When parallel parents converge on one node:

1. First parent finishes → `invokeExecuteNode(C)` → parents not all `success` → **`deferred`** (no row update).
2. Last parent finishes → gate passes → node runs.

If a parent **`failed`** or was **`skipped`**, and all parents are terminal → child marked **`skipped`**, then `maybeMarkExecutionComplete`.

---

## 10. Structured Logging

`NodeLogger` (`NodeLogger.ts`) writes to `node_execution_logs` with `level`, `message`, optional `data`, and `elapsed_ms` since logger creation.

Executors should log milestones via `context.logger.info|warn|error(...)` — not `console.log` for user-visible trace.

**Frontend:** `useExecutionLiveData` subscribes to Realtime `INSERT` on `node_execution_logs`; `useExecutionsListLive` for the executions list.

---

## 11. Error Handling & Retries

### Per-node retry

`node.data.maxRetries` (default `0`). On failure:

1. Increment `retry_count`, set `pending`.
2. `invokeExecuteNode` again (in-process).
3. After max → `failed` + `maybeMarkExecutionFailed`.

### Execution-level completion

`helpers.ts`:

- **`maybeMarkExecutionFailed`** — any `failed` and no `pending`/`running` → execution `failed`.
- **`maybeMarkExecutionComplete`** — all nodes terminal (`success` | `failed` | `skipped`) → execution `success` or `failed`.

No `definition` argument — status is derived only from `node_executions` rows.

---

## 12. Credential Vault

1. UI stores credentials via Next.js API (`encrypted_data` JSONB, often `{ encoded: base64(...) }`).
2. At runtime: `context.resolveCredential(credentialId)` in `ExecutionContext.ts`.
3. Decoded secrets stay in memory for the executor call — not written to `node_executions.input_data`.

---

## 13. Executor Registry

`executors/Registry.ts` + `executors/init.ts` (loaded at top of `runExecuteNode.ts`).

| `node.data.type` | Executor | Category |
| --- | --- | --- |
| `api-request` | `ApiRequestExecutor` | Action |
| `send-email`, `integration-email` | `SendEmailExecutor` | Action |
| `slack` | `SlackExecutor` | Action |
| `openai` | `OpenAIExecutor` | Action |
| `condition` | `ConditionExecutor` | Logic |
| `delay` | `DelayExecutor` | Logic (in-function `setTimeout`, ≤300s) |
| `webhook-*` | `TriggerExecutor` | Trigger (pass-through `trigger_payload`) |

To add a node type: implement `NodeExecutor`, register in `init.ts`, add UI template + icon in `src/features/workflows/`.

---

## 14. RLS & Realtime

RLS on all tables; `node_executions` / `node_execution_logs` scoped through `executions.user_id`.

Edge Functions use the **service role** and must still filter by `user_id` from the execution row.

**Realtime publication** (migration): `executions`, `node_executions`, `node_execution_logs`.

`node_execution_logs` INSERT policy allows service role writes; SELECT is user-scoped via execution ownership.

---

## 15. Maintenance (planned)

`pg_cron` jobs described in earlier design docs are **not yet in migrations**. Intended jobs:

- Time out `executions` stuck in `running` / `pending`
- Purge old runs / logs
- Fail orphaned `node_executions` when parent execution ended

Until then, rely on explicit failure paths in `runExecuteNode` and manual ops.

---

## 16. Directory Structure

```
supabase/
├── migrations/
│   └── 20260521000000_initial_schema.sql
└── functions/
    ├── webhook-ingest/index.ts
    ├── execute-node/index.ts          # HTTP → runExecuteNode
    └── _shared/engine/
        ├── types.ts
        ├── runExecuteNode.ts          # Engine + invokeExecuteNode
        ├── ExecutionContext.ts
        ├── NodeLogger.ts
        ├── helpers.ts
        ├── supabaseClient.ts
        └── executors/
            ├── Registry.ts
            ├── init.ts
            ├── actions/               # ApiRequest, SendEmail, Slack, OpenAI
            └── logic/                 # Condition, Delay, Trigger

app/api/
├── workflows/[id]/test/route.ts       # Canvas test run
└── executions/[id]/rerun/route.ts       # Re-trigger from failed run

src/features/executions/               # List + detail UI, live hooks
src/features/workflows/                # Canvas, node config, test mock data
```

Full app map → [`architecture.md`](../architecture.md). Update that file when adding routes or engine files.

---

## 17. Trade-offs & Roadmap

| Decision | Choice | Trade-off |
| --- | --- | --- |
| Execution model | Step-based + DB state | More moving parts than one BFS loop; survives timeouts |
| Downstream dispatch | In-process `invokeExecuteNode` | No edge-to-edge HTTP/JWT pain; first hop still HTTP |
| State | `node_executions` + logs table | DB round-trip per step; simple recovery |
| Fan-in | Re-check on every invoke; defer or skip | Correct; last successful parent wins |
| Retries | Inline, no backoff scheduler | Simple; add pg_cron later for backoff |
| Delay | `setTimeout` in Edge Function | Works ≤300s; long delays need scheduled re-invoke |
| Credentials | JSONB + base64 from API | Vault/pgsodium upgrade path still open |

### Implemented

- `webhook-ingest`, `execute-node`, `runExecuteNode`, executor set above
- `node_execution_logs` + `NodeLogger`
- Executions list/detail with Realtime
- Workflow test API + canvas mock data

### Next (priority)

1. **pg_cron** maintenance jobs in a migration
2. **Long delays** — schedule re-fire instead of blocking the function
3. **Retry backoff** — delayed re-invoke via cron, not immediate loop
4. **Schedule trigger** — cron entry parallel to webhook-ingest
5. **Code node** — sandboxed executor (not registered yet)
