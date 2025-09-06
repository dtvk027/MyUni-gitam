-- Create clubs table
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  image_url text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  member_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.clubs enable row level security;

create policy "clubs_select_all"
  on public.clubs for select
  using (true);

create policy "clubs_insert_authenticated"
  on public.clubs for insert
  with check (auth.uid() = created_by);

create policy "clubs_update_creator"
  on public.clubs for update
  using (auth.uid() = created_by);

-- Create club memberships table
create table if not exists public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin', 'moderator')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(club_id, user_id)
);

-- Enable RLS for memberships
alter table public.club_memberships enable row level security;

create policy "club_memberships_select_all"
  on public.club_memberships for select
  using (true);

create policy "club_memberships_insert_own"
  on public.club_memberships for insert
  with check (auth.uid() = user_id);

create policy "club_memberships_delete_own"
  on public.club_memberships for delete
  using (auth.uid() = user_id);
