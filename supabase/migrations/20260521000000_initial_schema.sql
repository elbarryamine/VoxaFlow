-- Auren — fresh initial schema (tables, RLS, grants, realtime)

DROP TABLE IF EXISTS node_execution_logs CASCADE;
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

CREATE INDEX idx_node_executions_execution_id ON node_executions(execution_id);
CREATE INDEX idx_node_executions_status       ON node_executions(execution_id, status);

-- 4. NODE EXECUTION LOGS
CREATE TABLE node_execution_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_execution_id UUID NOT NULL REFERENCES node_executions(id) ON DELETE CASCADE,
  level             TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error')),
  message           TEXT NOT NULL,
  data              JSONB,
  elapsed_ms        INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_node_execution_logs_node_execution_id ON node_execution_logs(node_execution_id, created_at);

-- 5. CREDENTIALS
CREATE TABLE credentials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  service        TEXT NOT NULL,
  encrypted_data JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, name)
);

-- RLS
ALTER TABLE workflows           ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_executions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_workflows" ON workflows FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_own_executions" ON executions FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_own_credentials" ON credentials FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

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

CREATE POLICY "users_own_node_execution_logs" ON node_execution_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM node_executions ne
      JOIN executions e ON e.id = ne.execution_id
      WHERE ne.id = node_execution_logs.node_execution_id
        AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "service_role_insert_node_execution_logs" ON node_execution_logs FOR INSERT
  WITH CHECK (true);

-- Grants
GRANT ALL ON TABLE workflows TO authenticated, service_role, postgres, anon;
GRANT ALL ON TABLE executions TO authenticated, service_role, postgres;
GRANT ALL ON TABLE node_executions TO authenticated, service_role, postgres;
GRANT ALL ON TABLE node_execution_logs TO authenticated, service_role, postgres;
GRANT ALL ON TABLE credentials TO authenticated, service_role, postgres;

GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE node_execution_logs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE executions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE node_executions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
