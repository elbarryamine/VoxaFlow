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
    const { logger } = context;
    try {
      if (!node.data.credentialId) {
        return { status: 'failed', error: 'Missing credentialId — configure a Resend credential on this node.' };
      }

      const creds = await context.resolveCredential(node.data.credentialId as string);
      if (!creds.apiKey) {
        return { status: 'failed', error: 'Resend credential is missing apiKey field.' };
      }
      await logger.info('Credential resolved');

      const from = context.interpolate(String(node.data.from ?? node.data.emailFrom ?? ''));
      const toRaw = context.interpolate(String(node.data.to ?? node.data.emailTo ?? ''));
      const subject = context.interpolate(String(node.data.subject ?? node.data.emailSubject ?? ''));
      const html = context.interpolate(String(node.data.html ?? node.data.emailBody ?? ''));
      const text = node.data.text ? context.interpolate(node.data.text as string) : undefined;

      if (!from) return { status: 'failed', error: 'from is required.' };
      if (!toRaw) return { status: 'failed', error: 'to is required.' };
      if (!subject) return { status: 'failed', error: 'subject is required.' };
      if (!html && !text) return { status: 'failed', error: 'Either html or text is required.' };

      // Support comma-separated recipients
      const to = toRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
      await logger.info(`Variables interpolated (${to.length} recipient${to.length > 1 ? 's' : ''})`, { to, from, subject });

      const payload: Record<string, unknown> = { from, to, subject };
      if (html) payload.html = html;
      if (text) payload.text = text;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      await logger.info('POST https://api.resend.com/emails');

      let response: Response;
      try {
        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${creds.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
          await logger.error('Request timed out after 30s');
          return { status: 'failed', error: 'Resend API request timed out after 30 s.' };
        }
        throw fetchErr;
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await response.json();

      if (!response.ok) {
        await logger.error(`${response.status} ${response.statusText}`, data as Record<string, unknown>);
        return {
          status: 'failed',
          error: `Resend API error ${response.status}: ${data.message ?? JSON.stringify(data)}`,
        };
      }

      await logger.info(`${response.status} OK → email_id: ${data.id}`, { email_id: data.id, to, subject });

      return {
        status: 'success',
        output: { email_id: data.id, to, subject },
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await logger.error(errorMsg);
      return { status: 'failed', error: errorMsg };
    }
  }
}
