import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

/**
 * SlackExecutor — posts a message to a Slack channel.
 *
 * Node config (node.data):
 *   credentialId: string  — references a 'slack' credential with { botToken }
 *   channel: string       — channel name or ID, e.g. '#general' or 'C012AB3CD'
 *   text: string          — message body, supports {{variables}}
 *   username: string      — (optional) display name override
 *   iconEmoji: string     — (optional) e.g. ':robot_face:'
 */
export class SlackExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    try {
      if (!node.data.credentialId) {
        return { status: 'failed', error: 'Missing credentialId — configure a Slack credential on this node.' };
      }

      const creds = await context.resolveCredential(node.data.credentialId as string);
      if (!creds.botToken) {
        return { status: 'failed', error: 'Slack credential is missing botToken field.' };
      }

      const channel = context.interpolate(node.data.channel as string || '');
      const text = context.interpolate(node.data.text as string || '');

      if (!channel) return { status: 'failed', error: 'channel is required for the Slack node.' };
      if (!text) return { status: 'failed', error: 'text is required for the Slack node.' };

      const payload: Record<string, unknown> = { channel, text };
      if (node.data.username) payload.username = context.interpolate(node.data.username as string);
      if (node.data.iconEmoji) payload.icon_emoji = node.data.iconEmoji;

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.ok) {
        return {
          status: 'failed',
          error: `Slack API error: ${data.error ?? JSON.stringify(data)}`,
        };
      }

      return {
        status: 'success',
        output: {
          ts: data.ts,
          channel: data.channel,
          message_text: text,
        },
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { status: 'failed', error: errorMsg };
    }
  }
}
