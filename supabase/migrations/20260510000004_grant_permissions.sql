-- Explicitly grant permissions to standard Supabase roles
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

-- Also ensure sequences are granted if any (for serial ids, though we use UUIDs)
-- But just in case
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
