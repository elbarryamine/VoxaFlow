import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

/**
 * OpenAIExecutor — calls OpenAI Chat Completions API.
 *
 * Node config (node.data):
 *   credentialId: string  — references a 'openai' credential with { apiKey }
 *   model: string         — e.g. 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'
 *   systemPrompt: string  — (optional) system message, supports {{variables}}
 *   prompt: string        — user message, supports {{variables}}
 *   temperature: number   — (optional) 0-2, default 0.7
 *   maxTokens: number     — (optional) default 1000
 */
export class OpenAIExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    try {
      if (!node.data.credentialId) {
        return { status: 'failed', error: 'Missing credentialId — configure an OpenAI credential on this node.' };
      }

      const creds = await context.resolveCredential(node.data.credentialId as string);
      if (!creds.apiKey) {
        return { status: 'failed', error: 'OpenAI credential is missing apiKey field.' };
      }

      const model = (node.data.model as string) || 'gpt-4o-mini';
      const temperature = Number(node.data.temperature ?? 0.7);
      const maxTokens = Number(node.data.maxTokens ?? 1000);
      const prompt = context.interpolate(node.data.prompt as string || '');
      const systemPrompt = context.interpolate((node.data.systemPrompt as string) || '');

      if (!prompt) {
        return { status: 'failed', error: 'prompt is required for the OpenAI node.' };
      }

      const messages: { role: string; content: string }[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'failed',
          error: `OpenAI API error ${response.status}: ${data.error?.message ?? JSON.stringify(data)}`,
        };
      }

      const choice = data.choices?.[0];
      return {
        status: 'success',
        output: {
          text: choice?.message?.content ?? '',
          model: data.model,
          usage: data.usage,
          finish_reason: choice?.finish_reason,
        },
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { status: 'failed', error: errorMsg };
    }
  }
}
