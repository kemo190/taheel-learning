-- ========================================================
-- Certificates Schema for Taheel Platform
-- ========================================================

-- 1. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    certificate_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. TAH-2026-XXXX
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pdf_url TEXT, -- In case the certificate is generated and stored in a bucket
    
    UNIQUE(student_id, track_id) -- A student can only have one certificate per track
);

-- 2. Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Admins can do everything
CREATE POLICY "Admins can manage certificates"
ON public.certificates
FOR ALL
TO authenticated
USING (public.is_admin());

-- Students can read their own certificates
CREATE POLICY "Students can read own certificates"
ON public.certificates
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Anyone can read a certificate by code (for verification)
CREATE POLICY "Public can verify certificates"
ON public.certificates
FOR SELECT
TO public
USING (true);

-- 4. Create the public bucket for certificates if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS for certificates bucket
-- Admins can upload
CREATE POLICY "Admins can upload certificates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'certificates' AND public.is_admin()
);

-- Admins can update/delete
CREATE POLICY "Admins can manage certificates in storage"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'certificates' AND public.is_admin()
);

-- Anyone can view certificates
CREATE POLICY "Public can view certificates"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');
