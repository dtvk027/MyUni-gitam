-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  team_size integer default 1,
  required_skills text[],
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

create policy "projects_select_all"
  on public.projects for select
  using (true);

create policy "projects_insert_authenticated"
  on public.projects for insert
  with check (auth.uid() = created_by);

create policy "projects_update_creator"
  on public.projects for update
  using (auth.uid() = created_by);

-- Create project collaborators table
create table if not exists public.project_collaborators (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'contributor' check (role in ('contributor', 'maintainer')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, user_id)
);

-- Enable RLS for collaborators
alter table public.project_collaborators enable row level security;

create policy "project_collaborators_select_all"
  on public.project_collaborators for select
  using (true);

create policy "project_collaborators_insert_own"
  on public.project_collaborators for insert
  with check (auth.uid() = user_id);
