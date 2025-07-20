# Image Upload Troubleshooting Guide

## Common Issues and Solutions

### 1. **Storage Bucket Not Created**
The most common issue is that the storage bucket hasn't been created yet.

**Solution:**
1. Go to your Supabase Dashboard
2. Navigate to Storage section
3. Create a new bucket called `project-images`
4. Make sure it's set to **Public**
5. Or run the `storage-setup.sql` script in SQL Editor

### 2. **Storage Policies Not Set**
Even if the bucket exists, you need proper policies for upload permissions.

**Check in Supabase Dashboard:**
- Go to Storage → project-images bucket → Policies
- You should see policies for SELECT, INSERT, UPDATE, DELETE

**If missing, run this SQL:**
```sql
-- Storage policies for project images
CREATE POLICY "Project images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update project images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete project images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

### 3. **User Not Admin**
The upload only works for users with admin role.

**Check your role:**
```sql
SELECT id, email, role FROM public.profiles WHERE email = 'your-email@example.com';
```

**Make yourself admin:**
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 4. **Environment Variables**
Make sure your `.env.local` has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. **File Size/Type Issues**
- Maximum file size: 5MB
- Allowed types: JPEG, PNG, WebP, GIF
- Check browser console for specific error messages

## Quick Test Steps

1. **Open Browser Developer Tools** (F12)
2. **Go to Console tab**
3. **Try uploading an image**
4. **Look for error messages**

Common error messages and solutions:
- `"Bucket not found"` → Create the bucket
- `"Row Level Security"` → Check policies
- `"Unauthorized"` → Check admin role
- `"File too large"` → Use smaller image (<5MB)

## Manual Bucket Creation

If the SQL script doesn't work, create manually:

1. Go to Supabase Dashboard → Storage
2. Click "Create bucket"
3. Name: `project-images`
4. Set to **Public**
5. Click "Create bucket"
6. Go to bucket → Policies tab
7. Add the policies from the SQL above

## Test Upload Function

Add this to your browser console to test:
```javascript
// Test if storage is working
const testUpload = async () => {
  const { data, error } = await window.supabase.storage
    .from('project-images')
    .list('', { limit: 1 });
  
  console.log('Storage test:', { data, error });
};
testUpload();
```
