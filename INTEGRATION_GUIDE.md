# BuildUnia Integration Guide for Codeunia

## Overview
BuildUnia is now a **modular e-learning marketplace** that can be seamlessly integrated into the main Codeunia platform. It supports both **IoT and Software projects** with flexible learning and purchasing options.

## Integration Steps

### 1. **Copy to Codeunia**
```bash
# Copy the entire BuildUnia folder to your Codeunia project
cp -r /path/to/buildunia /path/to/codeunia/modules/buildunia
```

### 2. **Add Route Integration**
In your main Codeunia `app/layout.tsx` or navigation:
```tsx
// Add to your main navigation
{
  name: "Projects & Kits",
  href: "/buildunia",
  description: "IoT & Software projects, components, and mentorship"
}
```

### 3. **Environment Variables**
Add to your main Codeunia `.env.local`:
```env
# BuildUnia Module Configuration
NEXT_PUBLIC_BUILDUNIA_ENABLED=true
NEXT_PUBLIC_BUILDUNIA_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_BUILDUNIA_SUPABASE_ANON_KEY=your_supabase_key
BUILDUNIA_STRIPE_SECRET_KEY=your_stripe_key
```

### 4. **Database Integration**
The BuildUnia tables will coexist with your main Codeunia database:
- `buildunia_projects` - All projects (IoT + Software)
- `buildunia_orders` - Order management
- `buildunia_learning_paths` - Custom learning tracks
- `buildunia_components` - Individual components catalog

## New Features & Business Models

### **1. Project Types**
- **IoT Projects**: Hardware + Software + Learning
- **Software Projects**: Code + Documentation + Tutorials
- **Hybrid Projects**: Mix of both

### **2. Purchase Options**
- **Complete Kit**: Components + Code + Full Support
- **Components Only**: Just the hardware parts
- **Learning Only**: Access to tutorials/wiring guides (if they have components)
- **Code Only**: Source code + documentation
- **Mentorship**: 1-on-1 guidance sessions

### **3. Learning Flexibility**
- **Beginner Path**: Complete guidance from scratch
- **Intermediate Path**: Skip basics, focus on implementation
- **Advanced Path**: Concepts + challenges only
- **DIY Path**: Just the resources, minimal guidance

## API Integration Points

### **Fetch Projects for Main Site**
```javascript
// In your main Codeunia components
const builduniaProjects = await fetch('/api/buildunia/projects').then(r => r.json());

// Display as featured content
<FeaturedProjects projects={builduniaProjects.featured} />
```

### **User Progress Sync**
```javascript
// Sync learning progress with main Codeunia profile
await syncBuilduniaProgress(userId, projectId, progress);
```

### **Unified Cart System**
```javascript
// Add BuildUnia items to main Codeunia cart
await addToCart({
  type: 'buildunia_project',
  id: projectId,
  variant: 'complete_kit' // or 'components_only', 'learning_only'
});
```

## Revenue Streams

1. **Complete Project Kits**: ₹2,000 - ₹15,000
2. **Individual Components**: ₹50 - ₹5,000  
3. **Learning Subscriptions**: ₹299/month
4. **Mentorship Sessions**: ₹500/hour
5. **Certification Programs**: ₹1,500/course
6. **Enterprise Packages**: Custom pricing

## Automatic Data Fetching

When integrated into Codeunia, BuildUnia will automatically:
- ✅ Sync user profiles
- ✅ Share authentication
- ✅ Combine shopping carts
- ✅ Unify progress tracking
- ✅ Cross-promote content
- ✅ Shared payment system

## Next Steps

1. **Run the updated setup script** (I'll create this)
2. **Copy module to Codeunia**
3. **Configure environment variables**
4. **Test integration**
5. **Launch! 🚀**
