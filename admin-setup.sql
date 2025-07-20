-- Admin Setup Script
-- Run this in your Supabase SQL Editor to make yourself an admin

-- First, create the profiles table if it doesn't exist (this should already be done from the main schema)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    bio TEXT,
    role TEXT CHECK (role IN ('user', 'admin', 'moderator', 'premium')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Replace 'your-email@example.com' with your actual email address
-- This will make you an admin so you can access the admin panel
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- If the profile doesn't exist yet, you can insert it manually
-- Replace the UUID with your actual user ID from auth.users
-- You can find your user ID by running: SELECT id, email FROM auth.users;
/*
INSERT INTO public.profiles (id, email, role) 
VALUES ('your-user-id-here', 'your-email@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/

-- Verify the admin user was created
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
