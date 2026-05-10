import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

/**
 * SendEmailExecutor — sends email via the Resend API.
 *
 * Node config (node.data):
 *   credentialId: string  — references a 'resend' credential with { apiKey }
 *   from: string          — sender, e.g. 'noreply@yourdomain.com'
 *   to: string            — recipient email (or comma-separated list), supports {{variables}}
 *   subject: string       — email subject, supports {{variables}}
 *   html: string          — HTML body, supports {{variables}}
 *   text: string          — (optional) plain-text fallback, supports {{variables}}
 */
export class SendEmailExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    try {
      if (!node.data.credentialId) {
        return { status: 'failed', error: 'Missing credentialId — configure a Resend credential on this node.' };
      }

      const creds = await context.resolveCredential(node.data.credentialId as string);
      if (!creds.apiKey) {
        return { status: 'failed', error: 'Resend credential is missing apiKey field.' };
      }

      const from = context.interpolate(node.data.from as string || '');
      const toRaw = context.interpolate(node.data.to as string || '');
      const subject = context.interpolate(node.data.subject as string || '');
      const html = context.interpolate(node.data.html as string || '');
      const text = node.data.text ? context.interpolate(node.data.text as string) : undefined;

      if (!from) return { status: 'failed', error: 'from is required.' };
      if (!toRaw) return { status: 'failed', error: 'to is required.' };
      if (!subject) return { status: 'failed', error: 'subject is required.' };
      if (!html && !text) return { status: 'failed', error: 'Either html or text is required.' };

      // Support comma-separated recipients
      const to = toRaw.split(',').map((s: string) => s.trim()).filter(Boolean);

      const payload: Record<string, unknown> = { from, to, subject };
      if (html) payload.html = html;
      if (text) payload.text = text;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'failed',
          error: `Resend API error ${response.status}: ${data.message ?? JSON.stringify(data)}`,
        };
      }

      return {
        status: 'success',
        output: {
          email_id: data.id,
          to,
          subject,
        },
      };
    } catch (err: any) {
      return { status: 'failed', error: err.message };
    }
  }
}
