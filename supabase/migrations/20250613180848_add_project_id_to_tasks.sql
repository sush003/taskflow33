-- This migration adds the project_id column to the tasks table
-- and sets up a foreign key constraint to the projects table.

ALTER TABLE public.tasks
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Optional: Add a policy to allow users to update tasks with a project_id
-- (assuming you have RLS enabled for tasks table, which you do)
CREATE POLICY "Users can update tasks with project ID" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id AND project_id IS NOT NULL);

-- You may also want to update your INSERT policy for tasks
-- to explicitly allow inserting with a project_id.
-- Example (modify your existing "Users can insert own tasks" policy if needed):
-- ALTER POLICY "Users can insert own tasks" ON public.tasks WITH CHECK (auth.uid() = user_id AND (project_id IS NULL OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())));
