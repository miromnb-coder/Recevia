-- Recevia V1 schema
-- Jarjestys on tarkeaa: taulut ensin, sitten funktio joka lukee profiles-taulua.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  widget_key text not null unique,
  allowed_domains text[] not null default '{}',
  plan text not null default 'start',
  status text not null default 'draft'
    check (status in ('draft', 'live', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete set null,
  email text,
  full_name text,
  role text not null default 'owner'
    check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_profiles (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  greeting text not null default 'Miten voin auttaa tanaan?',
  tone text not null default 'warm-professional',
  language text not null default 'fi',
  address text,
  phone text,
  hours jsonb not null default '{}'::jsonb,
  rules text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  duration_min integer not null default 30 check (duration_min > 0),
  price_from numeric(10, 2),
  currency text not null default 'EUR',
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null default 'faq'
    check (kind in ('faq', 'policy', 'hours', 'custom')),
  question text not null,
  answer text not null,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel text not null default 'web'
    check (channel in ('web', 'whatsapp', 'sms')),
  session_id text,
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  status text not null default 'open'
    check (status in ('open', 'lead', 'booked', 'handoff', 'closed')),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete set null,
  name text,
  phone text,
  email text,
  interest text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'won', 'lost')),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_name text,
  customer_phone text,
  gcal_event_id text,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.calendar_connections (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  google_refresh_token text,
  calendar_id text,
  timezone text not null default 'Europe/Helsinki',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_configs (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  model text not null default 'gpt-4o-mini',
  system_prompt_snapshot text,
  tools_enabled jsonb not null default '["get_services","create_lead","escalate"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_organization_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return (
    select organization_id
    from public.profiles
    where id = auth.uid()
    limit 1
  );
end;
$$;

revoke all on function public.current_organization_id() from public;
grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.current_organization_id() to service_role;

create index if not exists organizations_slug_idx on public.organizations (slug);
create index if not exists organizations_widget_key_idx on public.organizations (widget_key);
create index if not exists profiles_organization_id_idx on public.profiles (organization_id);
create index if not exists services_org_idx on public.services (organization_id);
create index if not exists knowledge_org_idx on public.knowledge_items (organization_id);
create index if not exists conversations_org_created_idx on public.conversations (organization_id, created_at desc);
create unique index if not exists conversations_org_session_idx
  on public.conversations (organization_id, session_id)
  where session_id is not null;
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists leads_org_idx on public.leads (organization_id, created_at desc);
create index if not exists bookings_org_starts_idx on public.bookings (organization_id, starts_at);

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists business_profiles_set_updated_at on public.business_profiles;
create trigger business_profiles_set_updated_at
  before update on public.business_profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();

drop trigger if exists knowledge_items_set_updated_at on public.knowledge_items;
create trigger knowledge_items_set_updated_at
  before update on public.knowledge_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute procedure public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute procedure public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

drop trigger if exists calendar_connections_set_updated_at on public.calendar_connections;
create trigger calendar_connections_set_updated_at
  before update on public.calendar_connections
  for each row execute procedure public.set_updated_at();

drop trigger if exists agent_configs_set_updated_at on public.agent_configs;
create trigger agent_configs_set_updated_at
  before update on public.agent_configs
  for each row execute procedure public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.services enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.agent_configs enable row level security;

drop policy if exists organizations_select_own on public.organizations;
create policy organizations_select_own
  on public.organizations for select to authenticated
  using (id = public.current_organization_id());

drop policy if exists organizations_update_own on public.organizations;
create policy organizations_update_own
  on public.organizations for update to authenticated
  using (id = public.current_organization_id())
  with check (id = public.current_organization_id());

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or organization_id = public.current_organization_id()
  );

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists business_profiles_tenant on public.business_profiles;
create policy business_profiles_tenant
  on public.business_profiles for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists services_tenant on public.services;
create policy services_tenant
  on public.services for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists knowledge_items_tenant on public.knowledge_items;
create policy knowledge_items_tenant
  on public.knowledge_items for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists conversations_tenant on public.conversations;
create policy conversations_tenant
  on public.conversations for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists messages_tenant on public.messages;
create policy messages_tenant
  on public.messages for all to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = messages.conversation_id
        and c.organization_id = public.current_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = messages.conversation_id
        and c.organization_id = public.current_organization_id()
    )
  );

drop policy if exists leads_tenant on public.leads;
create policy leads_tenant
  on public.leads for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists bookings_tenant on public.bookings;
create policy bookings_tenant
  on public.bookings for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists agent_configs_tenant on public.agent_configs;
create policy agent_configs_tenant
  on public.agent_configs for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

grant usage on schema public to authenticated, anon;
grant select, update on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.business_profiles to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.knowledge_items to authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.agent_configs to authenticated;

revoke all on public.calendar_connections from authenticated, anon;
