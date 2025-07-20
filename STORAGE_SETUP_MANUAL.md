# Storage Setup Instructions

Since storage policies need special permissions, you'll need to set up the storage bucket manually through the Supabase Dashboard.

## Step 1: Run Database Setup First

1. **Go to Supabase Dashboard → SQL Editor**
2. **Run the script:** `database-only-setup.sql`
3. **This will create all tables and database policies**

## Step 2: Create Storage Bucket Manually

1. **Go to Supabase Dashboard → Storage** (left sidebar)
2. **Click "New bucket"**
3. **Configure the bucket:**
   - **Bucket name:** `project-images`
   - **Public bucket:** ✅ **YES** (toggle this on)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** 
     ```
     image/jpeg,image/png,image/webp,image/gif
     ```
4. **Click "Create bucket"**

## Step 3: Set Storage Policies

1. **Go to Storage → project-images bucket**
2. **Click "Policies" tab**
3. **Click "New policy"** for each of these:

### Policy 1: Public Read Access
- **Policy name:** `Project images are publicly viewable`
- **Allowed operation:** `SELECT`
- **Policy definition:**
  ```sql
  bucket_id = 'project-images'
  ```

### Policy 2: Admin Upload Access
- **Policy name:** `Admins can upload project images`
- **Allowed operation:** `INSERT`
- **Policy definition:**
  ```sql
  bucket_id = 'project-images' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
  ```

### Policy 3: Admin Update Access
- **Policy name:** `Admins can update project images`
- **Allowed operation:** `UPDATE`
- **Policy definition:**
  ```sql
  bucket_id = 'project-images' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
  ```

### Policy 4: Admin Delete Access
- **Policy name:** `Admins can delete project images`
- **Allowed operation:** `DELETE`
- **Policy definition:**
  ```sql
  bucket_id = 'project-images' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
  ```

## Step 4: Make Yourself Admin

**Run this in SQL Editor:**
```sql
-- Replace with your actual email
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Step 5: Test Everything

1. **Sign in to your BuildUnia account**
2. **Go to Admin Panel → Diagnostics**
3. **Run diagnostic tests**
4. **All should pass** ✅

## Alternative: Simplified Setup (No Admin Restrictions)

If you want to allow any authenticated user to upload (for testing), use these simpler policies:

### Simple Upload Policy
```sql
bucket_id = 'project-images' AND auth.uid() IS NOT NULL
```

This allows any logged-in user to upload images, which is easier for testing but less secure for production.
