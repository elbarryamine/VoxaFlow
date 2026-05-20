import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

/**
 * TriggerExecutor — pass-through executor for trigger nodes.
 *
 * When a trigger fires, the input payload is captured in the execution record's
 * trigger_payload field. This executor retrieves that payload from the context
 * and outputs it in a structured format matching the output schema.
 */
export class TriggerExecutor implements NodeExecutor {
  async execute(_node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    const { logger } = context;
    const payload = context.triggerPayload || {};

    // Check if the payload is already structured with body/headers/etc.
    // If it has a 'body' or 'headers' key, use it. Otherwise, treat the whole payload as 'body'.
    const hasBodyOrHeaders = ('body' in payload) || ('headers' in payload);

    const body = hasBodyOrHeaders ? (payload.body ?? {}) : payload;
    const headers = hasBodyOrHeaders ? (payload.headers ?? {}) : {};
    const topic = payload.topic ?? '';
    const query = payload.query ?? {};

    const bodyKeys = Object.keys(body as object).length;
    await logger.info(`Trigger payload received (${bodyKeys} field${bodyKeys !== 1 ? 's' : ''})`);

    return {
      status: 'success',
      output: { body, headers, topic, query },
    };
  }
}
