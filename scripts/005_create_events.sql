-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  category text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  max_attendees integer,
  current_attendees integer default 0,
  is_public boolean default true,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.events enable row level security;

create policy "events_select_all"
  on public.events for select
  using (true);

create policy "events_insert_authenticated"
  on public.events for insert
  with check (auth.uid() = created_by);

create policy "events_update_creator"
  on public.events for update
  using (auth.uid() = created_by);

-- Create event attendees table
create table if not exists public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- Enable RLS for attendees
alter table public.event_attendees enable row level security;

create policy "event_attendees_select_all"
  on public.event_attendees for select
  using (true);

create policy "event_attendees_insert_own"
  on public.event_attendees for insert
  with check (auth.uid() = user_id);

create policy "event_attendees_delete_own"
  on public.event_attendees for delete
  using (auth.uid() = user_id);
