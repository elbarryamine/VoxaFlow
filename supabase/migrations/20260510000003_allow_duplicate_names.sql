-- Remove unique constraint on workflow names to allow duplicate names per user
DROP INDEX IF EXISTS idx_workflows_user_id;
-- Re-create as a non-unique index for performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id, name);
