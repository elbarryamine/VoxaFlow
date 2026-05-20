import { ExecutionContext } from './types.ts';
import { createSupabaseClient } from './supabaseClient.ts';

function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    const bracketIndex = part.indexOf('[');
    if (bracketIndex !== -1) {
      const key = part.slice(0, bracketIndex);
      const arrayPart = part.slice(bracketIndex);
      let currentVal = key ? (acc as Record<string, unknown>)[key] : acc;
      const matches = arrayPart.match(/\[(\d+)\]/g);
      if (matches) {
        for (const match of matches) {
          if (currentVal === null || currentVal === undefined) return undefined;
          const idx = parseInt(match.replace(/[\[\]]/g, ''), 10);
          currentVal = (currentVal as unknown[])[idx];
        }
      }
      return currentVal;
    }
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

// Need to define decryptCredential or import it
// Assuming we'll have it in supabaseClient or a crypto utils file.
// For now, let's mock it or leave a comment.

export function buildExecutionContext(params: {
  executionId: string;
  workflowId: string;
  userId: string;
  triggerPayload: Record<string, unknown>;
  state: Record<string, unknown>;
}): ExecutionContext {
  const { executionId, workflowId, userId, triggerPayload, state } = params;

  function interpolateValue(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
        const resolved = get({ trigger: triggerPayload, ...state }, path.trim());
        return resolved !== undefined ? String(resolved) : '';
      });
    }
    if (Array.isArray(value)) return value.map(interpolateValue);
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, interpolateValue(v)])
      );
    }
    return value;
  }

  return {
    executionId,
    workflowId,
    userId,
    triggerPayload,
    state,
    interpolate: <T>(template: T): T => interpolateValue(template) as T,
    resolveCredential: async (credentialId: string) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('credentials')
        .select('encrypted_data')
        .eq('id', credentialId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new Error(`Credential not found: ${credentialId}`);
      }

      const raw = data.encrypted_data as Record<string, string>;

      // If stored as base64-encoded JSON (from the Next.js API route), decode it.
      if (raw.encoded) {
        const decoded = JSON.parse(atob(raw.encoded));
        return decoded as Record<string, string>;
      }

      // Fallback: return as-is (for Supabase Vault or direct JSONB storage)
      return raw;
    },
  };
}
