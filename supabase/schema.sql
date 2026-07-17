-- Ospyr OS — Supabase schema (run in the Supabase SQL editor).
-- Real backend for both sectors (PSG Gold jewellery + Harshdeep founder group).
-- Model: a document store — one row per (workspace, collection) holding a JSON
-- array — which maps 1:1 onto the app's DataStore, plus workspaces/members for
-- multi-user access and row-level security.

-- ── workspaces ───────────────────────────────────────────────────────────────
create table if not exists os_workspaces (
  slug        text primary key,
  name        text not null,
  sector      text not null default 'jewellery' check (sector in ('jewellery','founder')),
  owner       uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── memberships (who can access which workspace) ─────────────────────────────
create table if not exists os_members (
  workspace   text references os_workspaces(slug) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  role        text not null default 'member',
  created_at  timestamptz not null default now(),
  primary key (workspace, user_id)
);

-- ── collections (the app's data, one JSON blob per collection) ───────────────
create table if not exists os_collections (
  workspace   text references os_workspaces(slug) on delete cascade,
  collection  text not null,
  data        jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (workspace, collection)
);

-- ── inbound ingest log (n8n MEGA engines POST metrics/leads here) ────────────
create table if not exists os_ingest (
  id          bigserial primary key,
  workspace   text,
  kind        text,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

-- ── Row-Level Security ───────────────────────────────────────────────────────
alter table os_workspaces  enable row level security;
alter table os_members     enable row level security;
alter table os_collections enable row level security;

-- a user sees workspaces they belong to
create policy "member reads workspace" on os_workspaces
  for select using (exists (select 1 from os_members m where m.workspace = slug and m.user_id = auth.uid()));

create policy "member reads memberships" on os_members
  for select using (user_id = auth.uid());

-- members read/write their workspace's collections
create policy "member reads collections" on os_collections
  for select using (exists (select 1 from os_members m where m.workspace = os_collections.workspace and m.user_id = auth.uid()));
create policy "member writes collections" on os_collections
  for all using (exists (select 1 from os_members m where m.workspace = os_collections.workspace and m.user_id = auth.uid()))
  with check (exists (select 1 from os_members m where m.workspace = os_collections.workspace and m.user_id = auth.uid()));

-- Helper: create a workspace and add the caller as owner.
create or replace function os_create_workspace(p_slug text, p_name text, p_sector text)
returns void language plpgsql security definer as $$
begin
  insert into os_workspaces(slug, name, sector, owner) values (p_slug, p_name, p_sector, auth.uid())
    on conflict (slug) do nothing;
  insert into os_members(workspace, user_id, role) values (p_slug, auth.uid(), 'owner')
    on conflict do nothing;
end; $$;
