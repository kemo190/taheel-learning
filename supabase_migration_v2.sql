-- ========================================================
-- Schema Migration: Programs -> Tracks -> Courses -> Sessions -> Tasks
-- ========================================================

-- 1. Rename tables to match new hierarchy
ALTER TABLE public.programs RENAME TO tracks_new;
ALTER TABLE public.tracks RENAME TO courses;
ALTER TABLE public.tracks_new RENAME TO tracks;

-- 2. Rename foreign key columns in tables
ALTER TABLE public.courses RENAME COLUMN program_id TO track_id;
ALTER TABLE public.sessions RENAME COLUMN track_id TO course_id;
ALTER TABLE public.enrollments RENAME COLUMN track_id TO course_id;
ALTER TABLE public.certificates RENAME COLUMN track_id TO course_id;

-- Ensure track_instructors table exists before renaming, handle if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'track_instructors') THEN
    ALTER TABLE public.track_instructors RENAME TO course_instructors;
    ALTER TABLE public.course_instructors RENAME COLUMN track_id TO course_id;
  END IF;
END $$;

-- 3. Create the Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    type VARCHAR(50) DEFAULT 'assignment', -- assignment, quiz, project, etc.
    due_date TIMESTAMP WITH TIME ZONE,
    points INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- 4. Re-create any specific Row Level Security (RLS) policies if they explicitly named old columns.
-- (Standard RLS moves with the table rename, but we need to ensure the columns match if referenced).
-- NOTE: If your RLS policies on 'courses' or 'sessions' used `program_id` or `track_id` in their expressions,
-- you must manually recreate them in the Supabase UI. 

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tasks"
ON public.tasks FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Public can view active tasks"
ON public.tasks FOR SELECT TO public USING (is_active = true);
