-- gen_random_uuid() is built-in on Supabase (pgcrypto); no extension needed.


CREATE TABLE IF NOT EXISTS workflows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  definition    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Webhook URL slug per workflow (unique, user-visible)
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id, name);

CREATE TABLE IF NOT EXISTS executions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_user_id     ON executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_status      ON executions(status);

CREATE TABLE IF NOT EXISTS node_executions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_node_executions_execution_id ON node_executions(execution_id);
CREATE INDEX IF NOT EXISTS idx_node_executions_status       ON node_executions(execution_id, status);

CREATE TABLE IF NOT EXISTS credentials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,       -- user-facing label: "My OpenAI Key"
  service        TEXT NOT NULL,       -- 'openai' | 'slack' | 'http' | 'vapi' | etc.
  encrypted_data JSONB NOT NULL,      -- encrypted with Supabase Vault or pgcrypto
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, name)
);

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
