alter table public.organizations
  add column if not exists whatsapp_number text;

create table if not exists public.inbound_message_ids (
  id text primary key,
  created_at timestamptz not null default now()
);

revoke all on public.inbound_message_ids from authenticated, anon;
