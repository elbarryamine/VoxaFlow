import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

// GET /api/credentials — list all credentials (name + service only, no keys)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('credentials')
      .select('id, name, service, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/credentials — create a new credential
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, service, data: credData } = body as {
      name: string;
      service: string;
      data: Record<string, string>;
    };

    if (!name || !service || !credData) {
      return NextResponse.json({ error: 'Missing required fields: name, service, data' }, { status: 400 });
    }

    // Store encrypted_data as-is for now. In production, use Supabase Vault:
    // const { data: vaultKey } = await supabase.rpc('vault.create_secret', { secret: JSON.stringify(credData) });
    // Then store the vault key reference instead of plaintext.
    // For development, we encode as base64 to avoid raw plaintext storage.
    const encoded = Buffer.from(JSON.stringify(credData)).toString('base64');

    const { data, error } = await supabase
      .from('credentials')
      .insert({
        user_id: user.id,
        name,
        service,
        encrypted_data: { encoded },
      })
      .select('id, name, service, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A credential with this name already exists' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
