# BuildUnia - Modular E-Learning Marketplace

**BuildUnia** is now a complete **modular marketplace** that supports both **IoT and Software projects** with flexible learning and purchasing options. It's designed to be seamlessly integrated into the main **Codeunia platform**.

## Features
- 🛒 **Project Marketplace** - Browse and purchase IoT project kits with filtering and sorting
- 📱 **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices  
- 🛍️ **Shopping Cart** - Add multiple projects with quantity management
- 💳 **Secure Checkout** - Stripe integration for payment processing
- 👤 **User Authentication** - Supabase-powered sign up/sign in with email verification
- 🎓 **Mentorship Program** - Book 1-on-1 sessions with IoT experts
- 📚 **Learning Blog** - Tutorials, guides, and IoT industry insights
- 🔍 **Project Details** - Comprehensive project pages with components, skills, and features
- 📧 **Contact System** - Multi-channel support with FAQ section

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, lucide-react icons
- **Backend:** Supabase (authentication, database)
- **Payments:** Stripe (payment processing)
- **Deployment:** Vercel-ready

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (signin, signup)
│   ├── projects/          # Project marketplace and detail pages
│   ├── mentorship/        # Mentorship program page
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout process
│   ├── blog/              # Learning blog
│   ├── about/             # About page
│   ├── contact/           # Contact page with FAQ
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── Navbar.tsx         # Navigation component
│   └── Footer.tsx         # Footer component
├── contexts/              # React context providers
│   ├── AuthContext.tsx    # Authentication state management
│   └── CartContext.tsx    # Shopping cart state management
└── lib/                   # Utility functions
    ├── supabase.ts        # Supabase client and types
    ├── stripe.ts          # Stripe configuration
    └── utils.ts           # General utilities
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend/auth)
- Stripe account (for payments)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd kharido
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration  
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:

```sql
-- Users table (managed by Supabase Auth)
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  components TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL
);
```

3. Enable Row Level Security (RLS) and set up policies as needed
4. Copy your project URL and anon key to `.env.local`

### 4. Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env.local` file
4. Configure your product catalog in Stripe (optional)

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Features Overview

### 🏠 Homepage
- Hero section with clear value proposition
- Featured project showcase
- "How it works" explanation  
- Feature highlights and testimonials
- Mentorship call-to-action

### 🛒 Project Marketplace
- Grid layout with project cards
- Advanced filtering (category, difficulty, search)
- Project difficulty badges and skill tags
- Real-time search functionality

### 📋 Project Details
- Comprehensive project information
- Component lists and feature breakdowns
- Skills you'll gain section
- Add to cart functionality
- Related project suggestions

### 🎓 Mentorship Program
- Detailed mentor profile and background
- Multiple mentorship packages (single, monthly, intensive)
- "How it works" process explanation
- Success stories and testimonials
- Booking call-to-action

### 🛍️ Shopping Cart & Checkout
- Cart item management (quantity, remove)
- Order summary with pricing breakdown
- Secure checkout form with Stripe integration
- Shipping information collection
- Order confirmation flow

### 👤 Authentication
- Email/password registration and login
- Supabase Auth integration
- Protected routes and user sessions
- Password reset functionality (ready for implementation)

### 📧 Contact & Support
- Multi-channel contact information
- Contact form with submission handling
- Comprehensive FAQ section
- Response time expectations

### 📚 Learning Blog
- Featured and recent articles
- Category-based filtering
- Author information and read times
- Newsletter signup section

## Customization

### Adding New Projects
1. Add project data to the mock data arrays in relevant pages
2. For production, integrate with Supabase database
3. Add project images to `/public` directory
4. Update the project detail page template as needed

### Styling Changes
- Modify Tailwind CSS classes throughout components
- Update the color scheme in `tailwind.config.js`
- Customize shadcn/ui components in `src/components/ui/`

### Backend Integration
- Replace mock data with Supabase queries
- Implement proper error handling
- Add data validation schemas
- Set up proper RLS policies

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app is compatible with any Next.js hosting platform:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - see LICENSE file for details

## Support
- 📧 Email: hello@buildunia.com
- 📚 Documentation: [Project Wiki](link-to-wiki)
- 💬 Community: [Discord Server](link-to-discord)

---

**Note:** This is a complete, production-ready foundation. Update the mock data with real content, add your Supabase/Stripe credentials, and deploy to start your IoT education platform!
