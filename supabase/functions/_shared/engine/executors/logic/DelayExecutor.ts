import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

/**
 * DelayExecutor — pauses workflow progression for N seconds.
 *
 * Since Edge Functions are stateless, we can't truly "sleep" inside one.
 * Instead, this executor marks itself as succeeded immediately but the
 * delay is enforced by the caller scheduling the next node via pg_net
 * with a delay. For a simple implementation we use Deno's setTimeout
 * (works within the 400s budget for short delays).
 *
 * For delays > 30s, the node data should include `useSchedule: true`
 * and this executor would write to a scheduled job table (future work).
 */
export class DelayExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    const { logger } = context;
    const seconds = Number(node.data.seconds ?? 5);

    if (seconds < 0 || seconds > 300) {
      return {
        status: 'failed',
        error: `Delay must be between 0 and 300 seconds. Got: ${seconds}`,
      };
    }

    await logger.info(`Waiting ${seconds}s`);
    await new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
    await logger.info(`Resumed after ${seconds}s`);

    return {
      status: 'success',
      output: { delayed_seconds: seconds },
    };
  }
}
