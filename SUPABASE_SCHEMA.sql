-- =========================================================================
-- CYBER DETECTIVE ACADEMY — SUPABASE DATABASE SCHEMA (CONSOLIDATED UPDATE)
-- =========================================================================

-- 1. CREATE 'profiles' TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  cases_solved integer default 0 not null,
  solved_case_ids jsonb default '[]'::jsonb not null,
  achievements jsonb default '[]'::jsonb not null,
  xp integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

-- 2. CREATE 'cases_state' TABLE
create table if not exists public.cases_state (
  user_id uuid references auth.users(id) on delete cascade not null,
  case_id text not null,
  state_data jsonb default '{}'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (user_id, case_id)
);

-- 3. CREATE 'custom_cases' TABLE
create table if not exists public.custom_cases (
  id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  case_data jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

-- 4. ENABLE ROW-LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.cases_state enable row level security;
alter table public.custom_cases enable row level security;

-- =========================================================================
-- 5. RLS POLICIES
--    Drop existing policies (safe to rerun)
-- =========================================================================

-- -------------------------
-- profiles
-- -------------------------
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- -------------------------
-- cases_state
-- -------------------------
drop policy if exists "Users can view their own case states" on public.cases_state;
drop policy if exists "Users can insert their own case states" on public.cases_state;
drop policy if exists "Users can update their own case states" on public.cases_state;
drop policy if exists "Users can delete their own case states" on public.cases_state;

create policy "Users can view their own case states"
  on public.cases_state for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can insert their own case states"
  on public.cases_state for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own case states"
  on public.cases_state for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own case states"
  on public.cases_state for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- -------------------------
-- custom_cases
-- -------------------------
drop policy if exists "Users can view their own custom cases" on public.custom_cases;
drop policy if exists "Users can insert their own custom cases" on public.custom_cases;
drop policy if exists "Users can update their own custom cases" on public.custom_cases;
drop policy if exists "Users can delete their own custom cases" on public.custom_cases;

create policy "Users can view their own custom cases"
  on public.custom_cases for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can insert their own custom cases"
  on public.custom_cases for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own custom cases"
  on public.custom_cases for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own custom cases"
  on public.custom_cases for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- =========================================================================
-- 6. AUTO-CREATE PROFILE TRIGGER (hardening + rerunnable)
-- =========================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, cases_solved, solved_case_ids, achievements)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    0,
    '[]'::jsonb,
    '[]'::jsonb
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- =========================================================================
-- 7. AUTO-CONFIRM USER EMAIL TRIGGER (Bypasses email verification)
-- =========================================================================

create or replace function public.handle_auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email_confirmed_at = now();
  new.confirmed_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_confirm on auth.users;

create trigger on_auth_user_created_confirm
  before insert on auth.users
  for each row
  execute procedure public.handle_auto_confirm_email();


-- =========================================================================
-- 8. MANUAL AUTO-CONFIRM RPC (Allows confirming existing unconfirmed emails programmatically)
-- =========================================================================

create or replace function public.confirm_user_email_by_email(target_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update auth.users 
  set email_confirmed_at = now(), confirmed_at = now() 
  where email = target_email;
end;
$$;
