// supabase/functions/_shared/engine/NodeLogger.ts
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

export class NodeLogger {
  private nodeExecutionId: string;
  private supabase: SupabaseClient;
  private startedAt: number;

  constructor(nodeExecutionId: string, supabase: SupabaseClient) {
    this.nodeExecutionId = nodeExecutionId;
    this.supabase = supabase;
    this.startedAt = Date.now();
  }

  async log(
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    const elapsed_ms = Date.now() - this.startedAt;
    await this.supabase.from('node_execution_logs').insert({
      node_execution_id: this.nodeExecutionId,
      level,
      message,
      data: data ?? null,
      elapsed_ms,
    });
  }

  info(message: string, data?: Record<string, unknown>): Promise<void> {
    return this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): Promise<void> {
    return this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>): Promise<void> {
    return this.log('error', message, data);
  }
}
