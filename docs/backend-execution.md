# Workflow Execution Architecture

> **Stack:** Next.js · Supabase (Postgres + Edge Functions + pg_net + pg_cron) · Deno  
> **Model:** Step-based DAG execution — one Edge Function call per node, fully durable

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level System Diagram](#2-high-level-system-diagram)
3. [Database Schema](#3-database-schema)
4. [Core TypeScript Interfaces](#4-core-typescript-interfaces)
5. [Execution Flow — Step by Step](#5-execution-flow--step-by-step)
6. [Variable Interpolation](#6-variable-interpolation)
7. [Condition Nodes & Branching](#7-condition-nodes--branching)
8. [Fan-In (Join / Merge Nodes)](#8-fan-in-join--merge-nodes)
9. [Error Handling & Retries](#9-error-handling--retries)
10. [Credential Vault](#10-credential-vault)
11. [Executor Registry & Node Types](#11-executor-registry--node-types)
12. [Multi-Tenancy & Row-Level Security](#12-multi-tenancy--row-level-security)
13. [Maintenance Jobs (pg_cron)](#13-maintenance-jobs-pg_cron)
14. [Directory Structure](#14-directory-structure)
15. [Key Design Decisions & Trade-offs](#15-key-design-decisions--trade-offs)

---

## 1. Architecture Philosophy

### Why NOT a monolithic BFS in one Edge Function

The naive approach — load the workflow, traverse the entire DAG in one function call using BFS, run every node sequentially — has a fatal flaw: **one function call = one timeout budget**.

Supabase Edge Functions have a wall-clock limit (~400s on paid plans, less on free). Any workflow that chains slow external APIs, has parallel branches, or includes delay nodes will hit this ceiling and die mid-execution with **no recovery path**.

### The Solution: Step-Based Execution

Each node in the graph maps to exactly **one isolated Edge Function call**.

```
node A fires → writes output to DB → calls execute-node for B and C
node B fires → writes output to DB → calls execute-node for D (if C also done)
node C fires → writes output to DB → calls execute-node for D (fan-in gate)
```

**Benefits:**

- Each node has its own fresh 400s budget — workflows can run for hours
- DB is the single source of truth between steps — crash-safe by default
- Parallel branches are just parallel pg_net calls — no thread management
- Every node's input/output is logged — full observability for your dashboard
- Retries are per-node — a transient failure doesn't re-run the whole workflow

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        TRIGGER LAYER                         │
│                                                             │
│  External Webhook ──► webhook-ingest (Edge Function)        │
│  Manual Trigger   ──►                                       │
│  Schedule (cron)  ──►    • Creates execution row            │
│                           • Inserts trigger node_executions  │
│                           • Fires pg_net → execute-node      │
└─────────────────────────────┬───────────────────────────────┘
                              │ pg_net HTTP POST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXECUTION LAYER                         │
│                                                             │
│              execute-node (Edge Function)                   │
│                                                             │
│   1. Fan-in check (all parents success?)                    │
│   2. Interpolate node config with previous outputs          │
│   3. Resolve credentials from vault                         │
│   4. Dispatch to NodeExecutor via Registry                  │
│   5. Write output to node_executions                        │
│   6. Fire pg_net for each downstream node                   │
└─────────────────────────────┬───────────────────────────────┘
                              │ reads/writes
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Supabase)                  │
│                                                             │
│  workflows          — definition (nodes + edges JSON)       │
│  executions         — overall run state                     │
│  node_executions    — per-node state within a run           │
│  credentials        — encrypted API keys per user           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MAINTENANCE LAYER                         │
│                                                             │
│  pg_cron — marks stuck executions as failed                 │
│           — purges old execution logs                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 `workflows`

Stores the workflow definition as saved from the React Flow canvas.

```sql
CREATE TABLE workflows (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  definition    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Webhook URL slug per workflow (unique, user-visible)
CREATE UNIQUE INDEX idx_workflows_user_id ON workflows(user_id, name);
```

### 3.2 `executions`

One row per workflow run (trigger event).

```sql
CREATE TABLE executions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id     UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','running','success','failed','timed_out')),
  trigger_source  TEXT NOT NULL DEFAULT 'webhook'
                  CHECK (trigger_source IN ('webhook','manual','schedule')),
  trigger_payload JSONB NOT NULL DEFAULT '{}',
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX idx_executions_user_id     ON executions(user_id);
CREATE INDEX idx_executions_status      ON executions(status);
```

### 3.3 `node_executions` ← the critical addition

One row per node per execution run. This is what makes step-based execution possible — the DB carries state between isolated function calls.

```sql
CREATE TABLE node_executions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id  UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  node_id       TEXT NOT NULL,       -- React Flow node id, e.g. 'node_abc123'
  node_type     TEXT NOT NULL,       -- e.g. 'api-request', 'condition', 'send-email'
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','running','success','failed','skipped')),
  input_data    JSONB NOT NULL DEFAULT '{}',   -- interpolated config snapshot
  output_data   JSONB NOT NULL DEFAULT '{}',   -- what the executor returned
  error_message TEXT,
  retry_count   INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  duration_ms   INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate node execution rows within the same run
  UNIQUE (execution_id, node_id)
);

CREATE INDEX idx_node_executions_execution_id ON node_executions(execution_id);
CREATE INDEX idx_node_executions_status       ON node_executions(execution_id, status);
```

### 3.4 `credentials`

Encrypted API keys and tokens per user/service. Executors receive the decrypted value at runtime only.

```sql
CREATE TABLE credentials (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,       -- user-facing label: "My OpenAI Key"
  service        TEXT NOT NULL,       -- 'openai' | 'slack' | 'http' | 'vapi' | etc.
  encrypted_data JSONB NOT NULL,      -- encrypted with Supabase Vault or pgcrypto
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, name)
);
```

> **Encryption:** Use `pgsodium` (built into Supabase via the Vault extension). Never store raw API keys. Node configs reference a `credentialId` — the executor resolves and decrypts it at runtime.

---

## 4. Core TypeScript Interfaces

Lives in `supabase/functions/_shared/engine/types.ts`. Imported by both Edge Functions.

```typescript
// ─── Graph Primitives ────────────────────────────────────────────────────────

export type NodeId = string;

export interface WorkflowEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  sourceHandle?: string; // e.g. 'true' | 'false' for condition nodes
  targetHandle?: string;
}

export interface WorkflowNode {
  id: NodeId;
  type: string; // matches a key in ExecutorRegistry
  data: Record<string, unknown>; // config set in the UI, may contain {{variables}}
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Execution Runtime ───────────────────────────────────────────────────────

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  userId: string;
  triggerPayload: Record<string, unknown>;

  // Keyed by node_id. Populated from node_executions rows before each step.
  // e.g. state['node_abc'] = { email: 'user@example.com', id: 42 }
  state: Record<NodeId, unknown>;

  // Recursively replaces {{...}} templates in any string or nested object/array
  interpolate<T>(template: T): T;

  // Resolves and decrypts a credential by ID
  resolveCredential(credentialId: string): Promise<Record<string, string>>;
}

export interface ExecutionResult {
  status: "success" | "failed";
  output?: Record<string, unknown>; // stored in node_executions.output_data
  error?: string;
  // Returned by condition nodes to control which branch fires next
  // Must match a sourceHandle value on the node's outgoing edges
  branchTarget?: string;
}

// ─── Executor Contract ───────────────────────────────────────────────────────

export interface NodeExecutor {
  execute(
    node: WorkflowNode,
    context: ExecutionContext,
  ): Promise<ExecutionResult>;
}
```

---

## 5. Execution Flow — Step by Step

### Part A: `webhook-ingest` — Entry Point

Responds immediately (< 50ms). Never runs any executor logic itself.

```typescript
// supabase/functions/webhook-ingest/index.ts

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get("workflowId");
  if (!workflowId) return new Response("missing workflowId", { status: 400 });

  const triggerPayload = await req.json().catch(() => ({}));

  const supabase = createSupabaseClient();

  // 1. Load workflow (verify it exists + get definition + user_id)
  const { data: workflow, error } = await supabase
    .from("workflows")
    .select("id, user_id, definition, is_active")
    .eq("id", workflowId)
    .single();

  if (error || !workflow || !workflow.is_active) {
    return new Response("workflow not found or inactive", { status: 404 });
  }

  const definition: WorkflowDefinition = workflow.definition;

  // 2. Create execution row
  const { data: execution } = await supabase
    .from("executions")
    .insert({
      workflow_id: workflow.id,
      user_id: workflow.user_id,
      status: "running",
      trigger_source: "webhook",
      trigger_payload: triggerPayload,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  // 3. Find trigger nodes: nodes with zero incoming edges
  const nodesWithIncoming = new Set(definition.edges.map((e) => e.target));
  const triggerNodes = definition.nodes.filter(
    (n) => !nodesWithIncoming.has(n.id),
  );

  if (triggerNodes.length === 0) {
    await supabase
      .from("executions")
      .update({ status: "failed", error_message: "No trigger node found" })
      .eq("id", execution.id);
    return new Response("no trigger nodes", { status: 400 });
  }

  // 4. Insert pending node_executions for each trigger node
  await supabase.from("node_executions").insert(
    triggerNodes.map((n) => ({
      execution_id: execution.id,
      node_id: n.id,
      node_type: n.type,
      status: "pending",
    })),
  );

  // 5. Fire execute-node for each trigger node via pg_net
  for (const node of triggerNodes) {
    await supabase.rpc("net.http_post", {
      url: `${Deno.env.get("SUPABASE_FUNCTIONS_URL")}/execute-node`,
      headers: JSON.stringify({
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      }),
      body: JSON.stringify({ executionId: execution.id, nodeId: node.id }),
    });
  }

  // Immediate 200 — caller doesn't wait for execution
  return new Response(JSON.stringify({ executionId: execution.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### Part B: `execute-node` — Core Engine

One call per node. Handles fan-in checking, interpolation, execution, logging, and firing downstream nodes.

```typescript
// supabase/functions/execute-node/index.ts

Deno.serve(async (req: Request) => {
  const { executionId, nodeId } = await req.json();
  const supabase = createSupabaseClient();

  // ── 1. Load execution + workflow ─────────────────────────────────────────

  const { data: execution } = await supabase
    .from("executions")
    .select("*, workflows(definition, user_id)")
    .eq("id", executionId)
    .single();

  if (!execution || execution.status === "failed") {
    return new Response("execution not found or already failed", {
      status: 200,
    });
  }

  const definition: WorkflowDefinition = execution.workflows.definition;
  const node = definition.nodes.find((n) => n.id === nodeId);
  if (!node)
    return new Response("node not found in definition", { status: 200 });

  // ── 2. Fan-in gate: all parent nodes must be 'success' ───────────────────

  const parentNodeIds = definition.edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source);

  if (parentNodeIds.length > 0) {
    const { data: parentRows } = await supabase
      .from("node_executions")
      .select("node_id, status")
      .eq("execution_id", executionId)
      .in("node_id", parentNodeIds);

    const allDone = parentNodeIds.every(
      (id) => parentRows?.find((r) => r.node_id === id)?.status === "success",
    );

    if (!allDone) {
      // Another parallel branch hasn't finished yet.
      // The last parent to complete will also call execute-node for this node,
      // and at that point the gate will pass.
      return new Response("deferred — waiting for other parents", {
        status: 200,
      });
    }
  }

  // ── 3. Mark this node as running (upsert handles retry re-entry) ─────────

  await supabase
    .from("node_executions")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("execution_id", executionId)
    .eq("node_id", nodeId);

  // ── 4. Load all previous node outputs to build interpolation state ────────

  const { data: completedNodes } = await supabase
    .from("node_executions")
    .select("node_id, output_data")
    .eq("execution_id", executionId)
    .eq("status", "success");

  const state: Record<string, unknown> = {
    trigger: execution.trigger_payload,
    ...Object.fromEntries(
      (completedNodes ?? []).map((r) => [r.node_id, r.output_data]),
    ),
  };

  // ── 5. Build context and interpolate node config ──────────────────────────

  const context = buildExecutionContext({
    executionId,
    workflowId: execution.workflow_id,
    userId: execution.workflows.user_id,
    triggerPayload: execution.trigger_payload,
    state,
  });

  const interpolatedNode: WorkflowNode = {
    ...node,
    data: context.interpolate(node.data),
  };

  // ── 6. Execute ────────────────────────────────────────────────────────────

  const executor = ExecutorRegistry.get(node.type);
  if (!executor) {
    await failNode(
      supabase,
      executionId,
      nodeId,
      `Unknown node type: ${node.type}`,
    );
    await maybeMarkExecutionFailed(supabase, executionId, definition);
    return new Response("unknown executor", { status: 200 });
  }

  const startMs = Date.now();
  let result: ExecutionResult;
  try {
    result = await executor.execute(interpolatedNode, context);
  } catch (err) {
    result = { status: "failed", error: String(err) };
  }
  const durationMs = Date.now() - startMs;

  // ── 7. Write result ───────────────────────────────────────────────────────

  await supabase
    .from("node_executions")
    .update({
      status: result.status,
      output_data: result.output ?? {},
      input_data: interpolatedNode.data,
      error_message: result.error ?? null,
      finished_at: new Date().toISOString(),
      duration_ms: durationMs,
    })
    .eq("execution_id", executionId)
    .eq("node_id", nodeId);

  // ── 8. Handle failure ─────────────────────────────────────────────────────

  if (result.status === "failed") {
    const { data: nodeExec } = await supabase
      .from("node_executions")
      .select("retry_count")
      .eq("execution_id", executionId)
      .eq("node_id", nodeId)
      .single();

    const MAX_RETRIES = (node.data.maxRetries as number) ?? 0;
    if ((nodeExec?.retry_count ?? 0) < MAX_RETRIES) {
      // Schedule retry
      await supabase
        .from("node_executions")
        .update({
          status: "pending",
          retry_count: (nodeExec?.retry_count ?? 0) + 1,
        })
        .eq("execution_id", executionId)
        .eq("node_id", nodeId);

      // Re-fire after delay (simple version — use pg_cron for backoff)
      await supabase.rpc("net.http_post", {
        url: `${Deno.env.get("SUPABASE_FUNCTIONS_URL")}/execute-node`,
        body: JSON.stringify({ executionId, nodeId }),
      });
    } else {
      await maybeMarkExecutionFailed(supabase, executionId, definition);
    }
    return new Response("node failed", { status: 200 });
  }

  // ── 9. Determine which downstream nodes to activate ───────────────────────

  const outgoingEdges = definition.edges.filter((e) => e.source === nodeId);

  // For condition nodes: only follow the branch that matches branchTarget
  const activeEdges = result.branchTarget
    ? outgoingEdges.filter((e) => e.sourceHandle === result.branchTarget)
    : outgoingEdges;

  // For condition false-path skip: mark skipped branches
  if (result.branchTarget) {
    const skippedEdges = outgoingEdges.filter(
      (e) => e.sourceHandle !== result.branchTarget,
    );
    for (const edge of skippedEdges) {
      await supabase.from("node_executions").upsert(
        {
          execution_id: executionId,
          node_id: edge.target,
          node_type:
            definition.nodes.find((n) => n.id === edge.target)?.type ??
            "unknown",
          status: "skipped",
        },
        { onConflict: "execution_id,node_id", ignoreDuplicates: true },
      );
    }
  }

  // ── 10. Insert pending rows and fire downstream ───────────────────────────

  for (const edge of activeEdges) {
    const nextNode = definition.nodes.find((n) => n.id === edge.target);
    if (!nextNode) continue;

    // Upsert with ignoreDuplicates — multiple parents may try to insert the same row
    await supabase.from("node_executions").upsert(
      {
        execution_id: executionId,
        node_id: edge.target,
        node_type: nextNode.type,
        status: "pending",
      },
      { onConflict: "execution_id,node_id", ignoreDuplicates: true },
    );

    await supabase.rpc("net.http_post", {
      url: `${Deno.env.get("SUPABASE_FUNCTIONS_URL")}/execute-node`,
      body: JSON.stringify({ executionId, nodeId: edge.target }),
    });
  }

  // ── 11. Check if execution is complete ────────────────────────────────────

  if (activeEdges.length === 0) {
    await maybeMarkExecutionComplete(supabase, executionId, definition);
  }

  return new Response("ok", { status: 200 });
});
```

---

## 6. Variable Interpolation

Template syntax is `{{path.to.value}}` — same as n8n/Handlebars.

| Template               | Resolves from                            |
| ---------------------- | ---------------------------------------- |
| `{{trigger.email}}`    | Initial webhook payload                  |
| `{{node_abc.body.id}}` | `output_data` of node with id `node_abc` |
| `{{node_abc.status}}`  | Top-level field on node output           |

```typescript
// supabase/functions/_shared/engine/ExecutionContext.ts

import { get } from "https://deno.land/x/lodash/get.js";

export function buildExecutionContext(params: {
  executionId: string;
  workflowId: string;
  userId: string;
  triggerPayload: Record<string, unknown>;
  state: Record<string, unknown>;
}): ExecutionContext {
  const { executionId, workflowId, userId, triggerPayload, state } = params;

  function interpolateValue(value: unknown): unknown {
    if (typeof value === "string") {
      return value.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
        const resolved = get(
          { trigger: triggerPayload, ...state },
          path.trim(),
        );
        return resolved !== undefined ? String(resolved) : "";
      });
    }
    if (Array.isArray(value)) return value.map(interpolateValue);
    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [
          k,
          interpolateValue(v),
        ]),
      );
    }
    return value;
  }

  return {
    executionId,
    workflowId,
    userId,
    triggerPayload,
    state,
    interpolate: <T>(template: T): T => interpolateValue(template) as T,
    resolveCredential: async (credentialId: string) => {
      const supabase = createSupabaseClient();
      const { data } = await supabase
        .from("credentials")
        .select("encrypted_data")
        .eq("id", credentialId)
        .eq("user_id", userId)
        .single();
      // Decrypt here via Supabase Vault / pgsodium
      return decryptCredential(data.encrypted_data);
    },
  };
}
```

---

## 7. Condition Nodes & Branching

A condition node evaluates a rule and returns `branchTarget` to tell the engine which outgoing edge handle to follow.

```typescript
// supabase/functions/_shared/engine/executors/logic/ConditionExecutor.ts

export class ConditionExecutor implements NodeExecutor {
  async execute(
    node: WorkflowNode,
    context: ExecutionContext,
  ): Promise<ExecutionResult> {
    // node.data.rules: Array of { field, operator, value }
    // node.data.logic: 'AND' | 'OR'
    const rules = node.data.rules as ConditionRule[];
    const logic = (node.data.logic as string) ?? "AND";

    const results = rules.map((rule) => evaluateRule(rule, context.state));
    const passed =
      logic === "AND" ? results.every(Boolean) : results.some(Boolean);

    return {
      status: "success",
      output: { passed, results },
      branchTarget: passed ? "true" : "false", // matches sourceHandle on edges
    };
  }
}

function evaluateRule(
  rule: ConditionRule,
  state: Record<string, unknown>,
): boolean {
  const left = get({ trigger: state.trigger, ...state }, rule.field);
  const right = rule.value;

  switch (rule.operator) {
    case "equals":
      return String(left) === String(right);
    case "not_equals":
      return String(left) !== String(right);
    case "contains":
      return String(left).includes(String(right));
    case "greater_than":
      return Number(left) > Number(right);
    case "less_than":
      return Number(left) < Number(right);
    case "exists":
      return left !== undefined && left !== null;
    case "not_exists":
      return left === undefined || left === null;
    default:
      return false;
  }
}
```

**On the React Flow canvas**, condition nodes have two outgoing edge handles:

- `sourceHandle: 'true'` → the "yes" branch
- `sourceHandle: 'false'` → the "no" branch

The engine only enqueues nodes connected to the matching handle. Nodes on the other branch get `status: 'skipped'`.

---

## 8. Fan-In (Join / Merge Nodes)

When two parallel branches converge into a single node, that node must not execute until **all** its parents have completed. This is handled by the fan-in gate in `execute-node` (Step 2 above).

```
   node_A ──┐
            ├──► node_C   (only runs after BOTH A and B succeed)
   node_B ──┘
```

**How it works:**

1. `node_A` completes → fires pg_net for `node_C`
2. `execute-node` for `node_C` runs → fan-in gate checks parents → `node_B` is still `pending` → returns `deferred`, does nothing
3. `node_B` completes → also fires pg_net for `node_C`
4. `execute-node` for `node_C` runs again → fan-in gate checks → both `A` and `B` are `success` → proceeds to execute

> **Edge case:** If `node_B` fails, `node_C` will never receive a passing fan-in check. `maybeMarkExecutionFailed` catches this by checking if any node is `failed` and no nodes are `pending` or `running`.

---

## 9. Error Handling & Retries

### Node-level retry

Configured per-node in the UI via `node.data.maxRetries` (default: 0).

On failure:

1. Increment `retry_count` on the `node_executions` row
2. Re-fire `execute-node` for the same node
3. After `maxRetries` exhausted → mark node `failed`, call `maybeMarkExecutionFailed`

### Execution-level failure detection

```typescript
// supabase/functions/_shared/engine/helpers.ts

export async function maybeMarkExecutionFailed(
  supabase,
  executionId,
  definition,
) {
  const { data: rows } = await supabase
    .from("node_executions")
    .select("status")
    .eq("execution_id", executionId);

  const hasFailed = rows?.some((r) => r.status === "failed");
  const hasActive = rows?.some(
    (r) => r.status === "pending" || r.status === "running",
  );

  if (hasFailed && !hasActive) {
    await supabase
      .from("executions")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
      })
      .eq("id", executionId);
  }
}

export async function maybeMarkExecutionComplete(
  supabase,
  executionId,
  definition,
) {
  const { data: rows } = await supabase
    .from("node_executions")
    .select("status")
    .eq("execution_id", executionId);

  const allDone = rows?.every((r) =>
    ["success", "failed", "skipped"].includes(r.status),
  );
  const anyFailed = rows?.some((r) => r.status === "failed");

  if (allDone) {
    await supabase
      .from("executions")
      .update({
        status: anyFailed ? "failed" : "success",
        finished_at: new Date().toISOString(),
      })
      .eq("id", executionId);
  }
}
```

### pg_cron safety net

Handles crashes, network failures, or any scenario where `execute-node` dies without writing a final status:

```sql
-- Runs every 5 minutes
-- Marks executions stuck in 'running' for >15 min as timed_out
SELECT cron.schedule(
  'timeout-stuck-executions',
  '*/5 * * * *',
  $$
    UPDATE executions
    SET status = 'timed_out',
        finished_at = NOW(),
        error_message = 'Execution timed out — no activity for 15 minutes'
    WHERE status IN ('running', 'pending')
      AND started_at < NOW() - INTERVAL '15 minutes';
  $$
);
```

---

## 10. Credential Vault

Node configs store only a `credentialId` reference — never raw keys.

**Storage flow:**

1. User adds credential in UI (name, service type, API key)
2. Next.js backend encrypts with Supabase Vault before insert
3. `credential.encrypted_data` is stored in Postgres

**Resolution flow at runtime:**

1. Executor calls `context.resolveCredential(node.data.credentialId)`
2. `ExecutionContext` fetches and decrypts the credential
3. Decrypted value (e.g. `{ apiKey: 'sk-...' }`) is passed to the executor
4. It never touches `node_executions.input_data` — not logged

```typescript
// Example: how an executor uses credentials
export class OpenAIExecutor implements NodeExecutor {
  async execute(
    node: WorkflowNode,
    context: ExecutionContext,
  ): Promise<ExecutionResult> {
    const creds = await context.resolveCredential(
      node.data.credentialId as string,
    );

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: node.data.model,
        messages: [
          { role: "user", content: context.interpolate(node.data.prompt) },
        ],
      }),
    });

    const data = await response.json();
    return { status: "success", output: data };
  }
}
```

---

## 11. Executor Registry & Node Types

```typescript
// supabase/functions/_shared/engine/executors/Registry.ts

const registry = new Map<string, NodeExecutor>();

export const ExecutorRegistry = {
  register(type: string, executor: NodeExecutor) {
    registry.set(type, executor);
  },
  get(type: string): NodeExecutor | undefined {
    return registry.get(type);
  },
};
```

```typescript
// supabase/functions/_shared/engine/executors/init.ts
// Call this at the top of execute-node/index.ts

import { ApiRequestExecutor } from "./actions/ApiRequestExecutor.ts";
import { SendEmailExecutor } from "./actions/SendEmailExecutor.ts";
import { SlackExecutor } from "./actions/SlackExecutor.ts";
import { OpenAIExecutor } from "./actions/OpenAIExecutor.ts";
import { ConditionExecutor } from "./logic/ConditionExecutor.ts";
import { DelayExecutor } from "./logic/DelayExecutor.ts";
import { CodeExecutor } from "./logic/CodeExecutor.ts";

export function initExecutors() {
  ExecutorRegistry.register("api-request", new ApiRequestExecutor());
  ExecutorRegistry.register("send-email", new SendEmailExecutor());
  ExecutorRegistry.register("slack", new SlackExecutor());
  ExecutorRegistry.register("openai", new OpenAIExecutor());
  ExecutorRegistry.register("condition", new ConditionExecutor());
  ExecutorRegistry.register("delay", new DelayExecutor());
  ExecutorRegistry.register("code", new CodeExecutor());
}
```

### Built-in Node Types (initial set)

| Node Type     | Category | Description                             |
| ------------- | -------- | --------------------------------------- |
| `api-request` | Action   | HTTP request to any URL                 |
| `send-email`  | Action   | Send via SMTP / Resend                  |
| `slack`       | Action   | Post to Slack channel                   |
| `openai`      | Action   | Chat completion / embedding             |
| `condition`   | Logic    | If/else branching                       |
| `delay`       | Logic    | Wait N seconds (reschedule via pg_net)  |
| `code`        | Logic    | Run user-provided JS snippet in sandbox |

---

## 12. Multi-Tenancy & Row-Level Security

Every table has a `user_id` column. RLS policies ensure users can only read their own data.

```sql
-- Enable RLS
ALTER TABLE workflows      ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials    ENABLE ROW LEVEL SECURITY;

-- Users can only access their own rows
CREATE POLICY "users_own_workflows"       ON workflows       USING (user_id = auth.uid());
CREATE POLICY "users_own_executions"      ON executions      USING (user_id = auth.uid());
CREATE POLICY "users_own_credentials"     ON credentials     USING (user_id = auth.uid());

-- node_executions is accessed through executions (no direct user_id)
CREATE POLICY "users_own_node_executions" ON node_executions
  USING (
    EXISTS (
      SELECT 1 FROM executions e
      WHERE e.id = node_executions.execution_id
        AND e.user_id = auth.uid()
    )
  );
```

Edge Functions use the **service role key** (bypasses RLS) and manually scope all queries to the `user_id` extracted from the execution row.

---

## 13. Maintenance Jobs (pg_cron)

```sql
-- 1. Time out stuck executions (every 5 minutes)
SELECT cron.schedule('timeout-executions', '*/5 * * * *', $$
  UPDATE executions
  SET status = 'timed_out', finished_at = NOW()
  WHERE status IN ('running','pending')
    AND started_at < NOW() - INTERVAL '15 minutes';
$$);

-- 2. Purge old execution logs older than 30 days (daily at 3am)
SELECT cron.schedule('purge-old-logs', '0 3 * * *', $$
  DELETE FROM node_executions
  WHERE execution_id IN (
    SELECT id FROM executions WHERE created_at < NOW() - INTERVAL '30 days'
  );
  DELETE FROM executions WHERE created_at < NOW() - INTERVAL '30 days';
$$);

-- 3. Mark orphaned node_executions as failed (every 10 minutes)
-- Catches nodes stuck in 'running' whose parent execution already failed/timed_out
SELECT cron.schedule('orphan-node-cleanup', '*/10 * * * *', $$
  UPDATE node_executions ne
  SET status = 'failed', error_message = 'Parent execution ended'
  FROM executions e
  WHERE ne.execution_id = e.id
    AND ne.status IN ('running','pending')
    AND e.status IN ('failed','timed_out','success');
$$);
```

---

## 14. Directory Structure

```
supabase/
└── functions/
    ├── webhook-ingest/
    │   └── index.ts                    # Webhook entry point, fires trigger nodes
    │
    ├── execute-node/
    │   └── index.ts                    # Core engine: one call per node
    │
    └── _shared/
        └── engine/
            ├── types.ts                # WorkflowNode, WorkflowEdge, ExecutionResult, etc.
            ├── ExecutionContext.ts     # interpolate(), resolveCredential()
            ├── supabaseClient.ts       # createSupabaseClient() helper
            │
            ├── helpers/
            │   ├── maybeMarkExecutionFailed.ts
            │   └── maybeMarkExecutionComplete.ts
            │
            └── executors/
                ├── Registry.ts         # ExecutorRegistry map
                ├── init.ts             # Register all executors
                │
                ├── actions/
                │   ├── ApiRequestExecutor.ts
                │   ├── SendEmailExecutor.ts
                │   ├── SlackExecutor.ts
                │   └── OpenAIExecutor.ts
                │
                └── logic/
                    ├── ConditionExecutor.ts
                    ├── DelayExecutor.ts
                    └── CodeExecutor.ts

src/                                    # Next.js app
└── app/
    └── api/
        ├── workflows/                  # CRUD for workflows
        ├── executions/                 # Read execution history for dashboard
        └── credentials/               # Create/delete credentials (encrypt before insert)
```

---

## 15. Key Design Decisions & Trade-offs

| Decision                  | Chosen Approach                                    | Trade-off                                                           |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| **Execution model**       | Step-based (one Edge Function per node)            | Slightly more complex than monolithic BFS, but survives any timeout |
| **Queue**                 | `pg_net` HTTP calls (Supabase native)              | No external infra (Upstash/SQS), but no built-in dead-letter queue  |
| **State between steps**   | `node_executions` table in Postgres                | DB round-trips per step, but zero shared memory needed              |
| **Fan-in**                | Re-check parents on every call, defer if not ready | Simple and correct; last parent to finish always wins the race      |
| **Retries**               | Per-node, inline in `execute-node`                 | No backoff scheduling (add pg_cron for exponential backoff later)   |
| **Credential encryption** | Supabase Vault / pgsodium                          | Keys never in plaintext in logs or DB rows                          |
| **RLS**                   | Per-table, scoped to `user_id`                     | Edge Functions use service role and manually enforce tenancy        |
| **Timeout recovery**      | pg_cron scans for stuck executions                 | ~5 min detection window, not instant                                |

### What to build next (priority order)

1. **`webhook-ingest` + `execute-node` + `ApiRequestExecutor`** — proves the whole pipeline end-to-end
2. **Execution dashboard in Next.js** — queries `executions` + `node_executions`, shows per-node status
3. **`ConditionExecutor`** — unlocks branching, core to any real workflow
4. **Credential UI** — add/manage keys before adding more executors
5. **`DelayExecutor`** — use pg_cron to re-fire `execute-node` after N seconds instead of blocking
6. **Retry UI** — allow users to set `maxRetries` and inspect retry history per node
