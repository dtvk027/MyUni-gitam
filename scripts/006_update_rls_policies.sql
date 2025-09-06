-- Update RLS policies to be more role-specific

-- Drop existing policies
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;

-- Create new role-aware policies for posts
CREATE POLICY "posts_insert_authenticated"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update_own_or_admin"
  ON public.posts FOR UPDATE
  USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "posts_delete_own_or_admin"
  ON public.posts FOR DELETE
  USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Update clubs policies for faculty/admin management
DROP POLICY IF EXISTS "clubs_update_creator" ON public.clubs;

CREATE POLICY "clubs_update_creator_or_admin"
  ON public.clubs FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Update projects policies
DROP POLICY IF EXISTS "projects_update_creator" ON public.projects;

CREATE POLICY "projects_update_creator_or_admin"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update events policies
DROP POLICY IF EXISTS "events_update_creator" ON public.events;

CREATE POLICY "events_update_creator_or_admin"
  ON public.events FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Add policy for faculty to create events
CREATE POLICY "events_insert_faculty_or_admin"
  ON public.events FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty', 'student')
    )
  );
