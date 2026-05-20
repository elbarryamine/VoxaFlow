import { NodeExecutor, WorkflowNode, ExecutionContext, ExecutionResult } from '../../types.ts';

export class ApiRequestExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
    const { logger } = context;
    try {
      const url = node.data.url as string;
      const method = (node.data.method as string) ?? 'GET';
      const headers = (node.data.headers as Record<string, string>) ?? {};
      const body = node.data.body;

      if (!url) {
        return { status: 'failed', error: 'Missing URL' };
      }

      // Automatically add Content-Type if body is an object and no Content-Type is provided
      if (body && typeof body === 'object' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (body) {
        options.body = typeof body === 'object' ? JSON.stringify(body) : String(body);
      }

      // If a credential is provided, resolve it and append to headers/auth
      if (node.data.credentialId) {
        const creds = await context.resolveCredential(node.data.credentialId as string);
        if (creds.apiKey) {
          headers['Authorization'] = `Bearer ${creds.apiKey}`;
        }
        await logger.info('Credential resolved');
      }

      await logger.info(`${method} ${url}`);

      const response = await fetch(url, options);

      let responseBody;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (!response.ok) {
        await logger.error(`${response.status} ${response.statusText}`, { body: responseBody });
        return {
          status: 'failed',
          error: `HTTP Error ${response.status}: ${JSON.stringify(responseBody)}`,
          output: { statusCode: response.status, body: responseBody },
        };
      }

      await logger.info(`${response.status} OK`, { statusCode: response.status });

      return {
        status: 'success',
        output: { statusCode: response.status, body: responseBody },
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await logger.error(errorMsg);
      return { status: 'failed', error: errorMsg };
    }
  }
}
