-- Simple Storage Setup for BuildUnia
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- Step 1: Create the storage bucket (if it doesn't exist)
-- You might need to do this manually in the Supabase Dashboard if this fails
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'project-images',
        'project-images', 
        true,
        5242880, -- 5MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
    RAISE NOTICE 'Bucket created successfully';
EXCEPTION 
    WHEN unique_violation THEN
        RAISE NOTICE 'Bucket already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating bucket: %', SQLERRM;
END $$;

-- Step 2: Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Project images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

-- Step 4: Create storage policies
CREATE POLICY "Project images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.uid() IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can update project images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'project-images' 
    AND auth.uid() IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can delete project images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'project-images' 
    AND auth.uid() IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Step 5: Verify setup
SELECT 'Storage bucket exists' as status, id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'project-images';

-- Step 6: Check if you have admin role
SELECT 'Your admin status' as info, email, role, created_at
FROM public.profiles 
WHERE id = auth.uid();

-- If the above query returns no results or role is not 'admin', run this:
-- (Replace 'your-email@example.com' with your actual email)
/*
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
*/
