-- Add timing columns so the dashboard can display per-node start time and duration
ALTER TABLE node_executions
  ADD COLUMN IF NOT EXISTS started_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ;
