-- supabase/migrations/20260520000002_node_execution_logs.sql

CREATE TABLE node_execution_logs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_execution_id uuid        NOT NULL REFERENCES node_executions(id) ON DELETE CASCADE,
  level             text        NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error')),
  message           text        NOT NULL,
  data              jsonb,
  elapsed_ms        integer,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON node_execution_logs (node_execution_id, created_at);

ALTER TABLE node_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own node execution logs"
  ON node_execution_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM node_executions ne
      JOIN executions e ON e.id = ne.execution_id
      WHERE ne.id = node_execution_logs.node_execution_id
        AND e.user_id = auth.uid()
    )
  );

-- Service role can insert (Edge Functions run as service role)
CREATE POLICY "Service role can insert node execution logs"
  ON node_execution_logs FOR INSERT
  WITH CHECK (true);

-- Grants
GRANT ALL ON TABLE node_execution_logs TO authenticated;
GRANT ALL ON TABLE node_execution_logs TO service_role;
GRANT ALL ON TABLE node_execution_logs TO postgres;

-- Enable Realtime so the dashboard can stream logs live
ALTER PUBLICATION supabase_realtime ADD TABLE node_execution_logs;
