import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

/** Propagate the browser session JWT to Realtime (required for RLS-filtered postgres_changes). */
export async function ensureRealtimeAuth(supabase: SupabaseClient): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return false;
  await supabase.realtime.setAuth(session.access_token);
  return true;
}

/** Keep Realtime auth in sync with the browser session. Returns an unsubscribe function. */
export function bindRealtimeAuth(supabase: SupabaseClient): () => void {
  void ensureRealtimeAuth(supabase);

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.access_token) {
      void supabase.realtime.setAuth(session.access_token);
    }
  });

  return () => subscription.unsubscribe();
}

export function subscribeRealtimeChannel(
  supabase: SupabaseClient,
  channel: RealtimeChannel,
  onStatus?: (status: string) => void,
): void {
  channel.subscribe(status => {
    onStatus?.(status);
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      void ensureRealtimeAuth(supabase);
    }
  });
}
