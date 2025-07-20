# BuildUnia Admin Panel

The admin panel provides comprehensive management tools for your BuildUnia IoT e-commerce platform.

## Features

### 🎯 Projects Management
- **Add New Projects**: Create IoT project kits with detailed information
- **Edit Projects**: Update project details, pricing, and descriptions
- **Delete Projects**: Remove projects from the platform (includes automatic image cleanup)
- **Direct Image Upload**: Upload images directly to Supabase Storage (no external URLs needed)
- **Project Details**:
  - Name and description
  - Price and category
  - Difficulty level (Beginner, Intermediate, Advanced)
  - Components list
  - Skills required
  - High-quality project images (drag-and-drop or click to upload)
  - Automatic image optimization and storage

### 👥 Users Management
- **View All Users**: See all registered users
- **User Search**: Find users by name or email
- **Role Management**: Assign roles (Admin, Moderator, Premium, User)
- **User Statistics**: Track user counts by role
- **User Profiles**: View user details and activity

### 📊 Analytics & Statistics
- **Platform Overview**: Total projects, users, orders, and revenue
- **Recent Projects**: Latest projects added to the platform
- **Popular Categories**: Most popular project categories
- **Future Features**: Sales analytics and user engagement metrics (coming soon)

### ⚙️ Settings
- **Platform Configuration**: Global settings management (coming soon)

## Accessing the Admin Panel

1. **Sign up/Sign in** to your BuildUnia account
2. **Become an Admin**:
   - Run the SQL script in `admin-setup.sql` in your Supabase SQL Editor
   - Update your email in the script to make yourself an admin
3. **Access the Panel**: Navigate to `/admin` or click the "Admin" button in the navbar (only visible to admins)

## Database Setup

### Required Tables
The admin panel requires these Supabase tables:

- **projects**: IoT project kits and their details (includes image_url and image_path for Supabase Storage)
- **profiles**: Extended user profiles with role management
- **orders**: Customer orders (for analytics)
- **order_items**: Individual items in orders

### Required Storage
- **project-images bucket**: Stores uploaded project images with automatic optimization

### Setting Up Admin Access

1. **Run the main schema**: Execute `supabase-schema.sql` in your Supabase SQL Editor
2. **Setup storage**: Execute `storage-setup.sql` to create the image storage bucket and policies
3. **Create admin user**: Run `admin-setup.sql` and update the email to your account
4. **Verify setup**: Check that your profile has the 'admin' role and storage bucket exists

```sql
-- Check your admin status
SELECT id, email, role FROM public.profiles WHERE email = 'your-email@example.com';

-- Verify storage bucket
SELECT id, name, public FROM storage.buckets WHERE id = 'project-images';
```

## Security Features

- **Role-Based Access**: Only users with 'admin' role can access the panel
- **Row Level Security**: Supabase RLS policies protect data access
- **Authentication Required**: Must be logged in to access admin features
- **Storage Security**: Images stored with proper access controls
- **File Validation**: Strict file type and size validation for uploads
- **Automatic Cleanup**: Orphaned images automatically removed

## Technical Implementation

### Components Structure
```
src/components/admin/
├── AdminDashboard.tsx      # Main dashboard with tabs
├── ProjectsManager.tsx     # Project CRUD operations
├── UsersManager.tsx        # User management and roles
└── AdminStats.tsx          # Analytics and statistics
```

### Key Features
- **Real-time Updates**: Changes reflect immediately
- **Responsive Design**: Works on desktop and mobile
- **Form Validation**: Proper input validation and error handling
- **Confirmation Dialogs**: Prevent accidental deletions
- **Search and Filters**: Easy data management

## Usage Guide

### Adding a New Project
1. Go to Admin Panel → Projects tab
2. Click "Add New Project"
3. Fill in all required fields:
   - Project name and description
   - Price and difficulty level
   - Category
   - Components (comma-separated)
   - Skills (comma-separated)
4. Upload a high-quality project image:
   - Drag and drop an image file, or click to browse
   - Supports JPEG, PNG, WebP, and GIF formats
   - Maximum file size: 5MB
   - Recommended size: 800x600px or larger
5. Click "Create Project"

**Image Upload Features:**
- **Drag & Drop**: Simply drag image files into the upload area
- **Preview**: See image preview before saving
- **Validation**: Automatic file type and size validation
- **Storage**: Images stored securely in Supabase Storage
- **Optimization**: Automatic image optimization for web
- **Cleanup**: Old images automatically deleted when projects are updated/deleted

### Managing Users
1. Go to Admin Panel → Users tab
2. View all users with their roles
3. Use search to find specific users
4. Change user roles using the action buttons
5. Monitor user statistics in the overview cards

### Viewing Analytics
1. Go to Admin Panel → Analytics tab
2. See platform overview statistics
3. Review recent projects and popular categories
4. Monitor platform growth and activity

## Future Enhancements

- **Order Management**: Complete order processing and tracking
- **Revenue Analytics**: Detailed sales reports and charts
- **User Engagement**: Activity tracking and engagement metrics
- **Bulk Operations**: Mass project and user management
- **Export Features**: Data export for reporting
- **Email Notifications**: Admin alerts and notifications

## Support

For technical support or feature requests, contact the development team or create an issue in the project repository.
