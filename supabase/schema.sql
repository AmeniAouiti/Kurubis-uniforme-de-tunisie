-- Kurubis uniforme — exécuter dans l'éditeur SQL Supabase

create extension if not exists "uuid-ossp";

-- Profils (rôle admin créé manuellement dans Supabase)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  company text,
  role text not null default 'user' check (role in ('admin', 'user')),
  status text not null default 'actif' check (status in ('actif', 'inactif')),
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- Conversations (plateforme — source account uniquement)
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.profiles(id) on delete set null,
  client_email text not null,
  client_name text not null,
  phone text,
  company text,
  subject text not null,
  type text not null default 'devis' check (type in ('devis', 'contact')),
  source text not null default 'account' check (source in ('landing', 'account')),
  quote_status text not null default 'nouveau' check (quote_status in ('nouveau', 'en_cours', 'accepte', 'refuse')),
  admin_notes text,
  unread_by_admin boolean not null default true,
  unread_by_client boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  product_id text,
  product_name text not null,
  sku text,
  quantity int not null default 1
);

create table if not exists public.conversation_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('client', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_client_email on public.conversations(client_email);
create index if not exists idx_conversations_updated on public.conversations(updated_at desc);
create index if not exists idx_messages_conversation on public.conversation_messages(conversation_id);

-- Trigger profil à l'inscription (rôle user)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone, company, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company',
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.quote_items enable row level security;
alter table public.conversation_messages enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_select_admin" on public.profiles for select using (public.is_admin());
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Conversations
create policy "conv_select_own" on public.conversations for select
  using (client_id = auth.uid() or client_email = (select email from public.profiles where id = auth.uid()) or public.is_admin());

create policy "conv_insert_account" on public.conversations for insert
  with check (source = 'account' and auth.uid() is not null);

create policy "conv_update_admin" on public.conversations for update using (public.is_admin());
create policy "conv_update_own_read" on public.conversations for update
  using (client_id = auth.uid() or client_email = (select email from public.profiles where id = auth.uid()));

-- Quote items
create policy "items_select" on public.quote_items for select
  using (exists (select 1 from public.conversations c where c.id = conversation_id and (
    c.client_id = auth.uid() or public.is_admin()
  )));

create policy "items_insert" on public.quote_items for insert
  with check (exists (select 1 from public.conversations c where c.id = conversation_id and c.client_id = auth.uid()));

-- Messages
create policy "msg_select" on public.conversation_messages for select
  using (exists (select 1 from public.conversations c where c.id = conversation_id and (
    c.client_id = auth.uid() or c.client_email = (select email from public.profiles where id = auth.uid()) or public.is_admin()
  )));

create policy "msg_insert_client" on public.conversation_messages for insert
  with check (
    sender = 'client' and exists (
      select 1 from public.conversations c where c.id = conversation_id
      and (c.client_id = auth.uid() or c.client_email = (select email from public.profiles where id = auth.uid()))
    )
  );

create policy "msg_insert_admin" on public.conversation_messages for insert
  with check (sender = 'admin' and public.is_admin());

-- Realtime
alter publication supabase_realtime add table public.conversation_messages;
alter publication supabase_realtime add table public.conversations;
