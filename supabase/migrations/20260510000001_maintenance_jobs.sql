-- ─── Maintenance Jobs (pg_cron) ────────────────────────────────────────────
-- NOTE: pg_cron must be enabled first in your Supabase Dashboard under
-- Settings → Extensions → pg_cron. Without it, this migration is a no-op.

DO $$
BEGIN
  -- Only schedule jobs if pg_cron is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN

    -- 1. Time out stuck executions (every 5 minutes)
    PERFORM cron.schedule('timeout-executions', '*/5 * * * *', $job$
      UPDATE executions
      SET
        status = 'timed_out',
        finished_at = NOW(),
        error_message = 'Execution timed out — no activity for 15 minutes'
      WHERE status IN ('running', 'pending')
        AND started_at < NOW() - INTERVAL '15 minutes';
    $job$);

    -- 2. Mark orphaned node_executions as failed (every 10 minutes)
    PERFORM cron.schedule('orphan-node-cleanup', '*/10 * * * *', $job$
      UPDATE node_executions ne
      SET
        status = 'failed',
        error_message = 'Parent execution ended unexpectedly'
      FROM executions e
      WHERE ne.execution_id = e.id
        AND ne.status IN ('running', 'pending')
        AND e.status IN ('failed', 'timed_out', 'success');
    $job$);

    -- 3. Purge old execution logs older than 30 days (daily at 3am)
    PERFORM cron.schedule('purge-old-logs', '0 3 * * *', $job$
      DELETE FROM node_executions
      WHERE execution_id IN (
        SELECT id FROM executions
        WHERE created_at < NOW() - INTERVAL '30 days'
      );
      DELETE FROM executions
      WHERE created_at < NOW() - INTERVAL '30 days';
    $job$);

    RAISE NOTICE 'pg_cron jobs scheduled successfully.';
  ELSE
    RAISE NOTICE 'pg_cron not enabled — skipping maintenance job scheduling. Enable it in Supabase Dashboard → Extensions.';
  END IF;
END;
$$;
