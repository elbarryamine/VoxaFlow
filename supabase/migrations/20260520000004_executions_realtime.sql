-- Enable Realtime for execution list and detail live updates (idempotent)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE executions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE node_executions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
