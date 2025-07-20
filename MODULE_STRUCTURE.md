# BuildUnia Module Structure

This folder contains the complete BuildUnia module that can be dropped into any Codeunia project.

## 📁 Folder Structure
```
buildunia/
├── components/           # All React components
│   ├── admin/           # Admin panel components
│   ├── projects/        # Project display components
│   ├── cart/           # Shopping cart components
│   ├── mentorship/     # Mentorship booking components
│   └── ui/             # Shared UI components
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Database connection
│   ├── stripe.ts       # Payment processing
│   └── imageUpload.ts  # File upload utilities
├── app/                # Next.js app router pages
│   ├── projects/       # Projects listing and details
│   ├── admin/          # Admin dashboard
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Payment processing
│   └── mentorship/     # Mentorship booking
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions

## 🔗 Integration Points

### 1. **Navigation Integration**
```tsx
// Add to your main Codeunia navigation
const navigation = [
  { name: 'Courses', href: '/courses' },
  { name: 'Projects & Kits', href: '/buildunia' }, // <-- Add this
  { name: 'Community', href: '/community' }
];
```

### 2. **API Routes**
All BuildUnia APIs are namespaced under `/api/buildunia/`:
- `/api/buildunia/projects` - Project management
- `/api/buildunia/cart` - Cart operations
- `/api/buildunia/checkout` - Payment processing
- `/api/buildunia/mentorship` - Session booking

### 3. **Database Integration**
All tables are prefixed with `buildunia_` to avoid conflicts:
- `buildunia_projects`
- `buildunia_orders`
- `buildunia_components`
- `buildunia_progress`

### 4. **Shared Authentication**
Uses the same Supabase auth as main Codeunia platform.

### 5. **Unified User Profiles**
Extends the existing `profiles` table with BuildUnia-specific fields.

## 🚀 Quick Setup

1. **Copy module**: `cp -r buildunia /path/to/codeunia/modules/`
2. **Run database setup**: Execute `enhanced-buildunia-setup.sql`
3. **Configure environment**: Add BuildUnia vars to `.env.local`
4. **Add navigation link**: Update main navigation
5. **Test integration**: Visit `/buildunia` route

## 📊 Business Model Support

### **Purchase Options**
- ✅ Complete Kits (Hardware + Software + Learning)
- ✅ Components Only (Just hardware parts)
- ✅ Learning Only (Tutorials for existing components)
- ✅ Code Only (Source code + documentation)
- ✅ Mentorship (1-on-1 guidance sessions)

### **Project Types**
- ✅ IoT Projects (Arduino, ESP32, Raspberry Pi)
- ✅ Software Projects (Web, Mobile, Desktop apps)
- ✅ Hybrid Projects (Mix of hardware and software)

### **Learning Paths**
- ✅ Beginner (Step-by-step guidance)
- ✅ Intermediate (Skip basics, focus on implementation)
- ✅ Advanced (Concepts + challenges)
- ✅ DIY (Resources only, minimal guidance)

## 🔄 Data Flow

```
Codeunia Main Platform
         ↓
   User Authentication
         ↓
   BuildUnia Module
         ↓
   Shared Database
         ↓
   Unified User Experience
```

## 💰 Revenue Integration

All BuildUnia revenue automatically integrates with main Codeunia analytics:
- Shared payment processing
- Unified revenue reporting
- Cross-platform user analytics
- Combined subscription management
```
