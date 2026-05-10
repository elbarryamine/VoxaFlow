-- Fix RLS policies to allow INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "users_own_workflows" ON workflows;
CREATE POLICY "users_own_workflows" ON workflows FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_own_executions" ON executions;
CREATE POLICY "users_own_executions" ON executions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_own_credentials" ON credentials;
CREATE POLICY "users_own_credentials" ON credentials FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_own_node_executions" ON node_executions;
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
