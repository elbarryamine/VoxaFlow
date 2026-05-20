-- Consolidate everything into a clean, minimal initial schema file.

-- Drop existing tables to start all over
DROP TABLE IF EXISTS node_executions CASCADE;
DROP TABLE IF EXISTS executions CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;

-- 1. WORKFLOWS
CREATE TABLE workflows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  definition    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching workflows by user
CREATE INDEX idx_workflows_user_id ON workflows(user_id, name);

-- 2. EXECUTIONS
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

CREATE INDEX idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX idx_executions_user_id     ON executions(user_id);
CREATE INDEX idx_executions_status      ON executions(status);

-- 3. NODE EXECUTIONS
CREATE TABLE node_executions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id  UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  node_id       TEXT NOT NULL,       -- React Flow node id
  node_type     TEXT NOT NULL,       -- e.g. 'api-request', 'condition', 'send-email'
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','running','success','failed','skipped')),
  input_data    JSONB NOT NULL DEFAULT '{}',   -- interpolated config snapshot
  output_data   JSONB NOT NULL DEFAULT '{}',   -- what the executor returned
  error_message TEXT,
  retry_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate node execution rows within the same run
  UNIQUE (execution_id, node_id)
);

CREATE INDEX idx_node_executions_execution_id ON node_executions(execution_id);
CREATE INDEX idx_node_executions_status       ON node_executions(execution_id, status);

-- 4. CREDENTIALS
CREATE TABLE credentials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,       -- user-facing label: "My OpenAI Key"
  service        TEXT NOT NULL,       -- 'openai' | 'slack' | etc.
  encrypted_data JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, name)
);

-- Enable RLS
ALTER TABLE workflows       ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials     ENABLE ROW LEVEL SECURITY;

-- Users can access/manage their own rows
CREATE POLICY "users_own_workflows"       ON workflows       FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_own_executions"      ON executions      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_own_credentials"     ON credentials     FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_own_node_executions" ON node_executions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM executions e
      WHERE e.id = node_executions.execution_id
        AND e.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM executions e
      WHERE e.id = node_executions.execution_id
        AND e.user_id = auth.uid()
    )
  );

-- Grants
GRANT ALL ON TABLE workflows TO authenticated;
GRANT ALL ON TABLE workflows TO service_role;
GRANT ALL ON TABLE workflows TO postgres;
GRANT ALL ON TABLE workflows TO anon;

GRANT ALL ON TABLE executions TO authenticated;
GRANT ALL ON TABLE executions TO service_role;
GRANT ALL ON TABLE executions TO postgres;

GRANT ALL ON TABLE node_executions TO authenticated;
GRANT ALL ON TABLE node_executions TO service_role;
GRANT ALL ON TABLE node_executions TO postgres;

GRANT ALL ON TABLE credentials TO authenticated;
GRANT ALL ON TABLE credentials TO service_role;
GRANT ALL ON TABLE credentials TO postgres;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
