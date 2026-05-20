-- Enable Realtime for node_execution_logs so the dashboard streams logs live
ALTER PUBLICATION supabase_realtime ADD TABLE node_execution_logs;
