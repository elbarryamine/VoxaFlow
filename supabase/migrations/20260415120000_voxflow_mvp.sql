create extension if not exists pgcrypto;

create table if not exists public.user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  instructions text not null,
  voice text not null,
  language text not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  e164 text not null unique,
  friendly_name text not null,
  provider text not null check (provider in ('system', 'twilio')),
  kind text not null check (kind in ('shared', 'dedicated')),
  twilio_sid text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_phone_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  phone_number_id uuid not null unique references public.phone_numbers(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  name text not null,
  description text not null default '',
  trigger_type text not null,
  payload_filter jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  trigger_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null check (status in ('started', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete set null,
  to_number text not null,
  from_number text not null,
  vapi_call_id text,
  status text not null check (status in ('queued', 'in_progress', 'completed', 'failed')),
  duration_seconds integer,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limit_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  calls_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, period_start)
);

create index if not exists agents_user_id_created_at_idx on public.agents (user_id, created_at desc);
create index if not exists workflows_user_id_trigger_type_idx on public.workflows (user_id, trigger_type);
create index if not exists calls_user_id_created_at_idx on public.calls (user_id, created_at desc);
create index if not exists workflow_runs_user_id_created_at_idx on public.workflow_runs (user_id, created_at desc);

alter table public.user_plans enable row level security;
alter table public.agents enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.user_phone_assignments enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.calls enable row level security;
alter table public.rate_limit_counters enable row level security;

create policy "user_plans_user_scope" on public.user_plans
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "agents_user_scope" on public.agents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workflows_user_scope" on public.workflows
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workflow_runs_user_scope" on public.workflow_runs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "calls_user_scope" on public.calls
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "rate_limit_user_scope" on public.rate_limit_counters
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_phone_assignments_user_scope" on public.user_phone_assignments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "phone_numbers_read_shared_or_assigned" on public.phone_numbers
  for select
  using (
    kind = 'shared'
    or exists (
      select 1
      from public.user_phone_assignments upa
      where upa.phone_number_id = phone_numbers.id
        and upa.user_id = auth.uid()
    )
  );

insert into public.phone_numbers (e164, friendly_name, provider, kind, is_active)
values ('+15550001111', 'VoxFlow Shared Line', 'system', 'shared', true)
on conflict (e164) do nothing;
