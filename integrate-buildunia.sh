#!/bin/bash

# BuildUnia Integration Script for Codeunia
# This script automatically integrates BuildUnia module into Codeunia platform

set -e  # Exit on any error

echo "🚀 Starting BuildUnia Integration..."

# Configuration
BUILDUNIA_SOURCE_DIR="$(pwd)"
CODEUNIA_TARGET_DIR=""
MODULE_NAME="buildunia"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get Codeunia project directory
get_codeunia_directory() {
    echo -e "${BLUE}📁 Please enter the path to your Codeunia project:${NC}"
    read -p "Codeunia path: " CODEUNIA_TARGET_DIR
    
    if [ ! -d "$CODEUNIA_TARGET_DIR" ]; then
        print_error "Directory does not exist: $CODEUNIA_TARGET_DIR"
        exit 1
    fi
    
    if [ ! -f "$CODEUNIA_TARGET_DIR/package.json" ]; then
        print_error "No package.json found. Are you sure this is a Next.js project?"
        exit 1
    fi
    
    print_success "Found Codeunia project at: $CODEUNIA_TARGET_DIR"
}

# Copy BuildUnia module
copy_module() {
    print_info "Copying BuildUnia module..."
    
    # Create modules directory if it doesn't exist
    mkdir -p "$CODEUNIA_TARGET_DIR/modules"
    
    # Copy the entire BuildUnia project
    cp -r "$BUILDUNIA_SOURCE_DIR" "$CODEUNIA_TARGET_DIR/modules/$MODULE_NAME"
    
    # Remove unnecessary files
    rm -rf "$CODEUNIA_TARGET_DIR/modules/$MODULE_NAME/.git"
    rm -rf "$CODEUNIA_TARGET_DIR/modules/$MODULE_NAME/node_modules"
    rm -f "$CODEUNIA_TARGET_DIR/modules/$MODULE_NAME/.env.local"
    
    print_success "Module copied to: $CODEUNIA_TARGET_DIR/modules/$MODULE_NAME"
}

# Update package.json dependencies
update_dependencies() {
    print_info "Updating package.json dependencies..."
    
    # Read BuildUnia dependencies
    BUILDUNIA_DEPS=$(node -p "JSON.stringify(require('$BUILDUNIA_SOURCE_DIR/package.json').dependencies, null, 2)")
    
    # Update Codeunia package.json
    node -e "
        const fs = require('fs');
        const codeuniaPackage = require('$CODEUNIA_TARGET_DIR/package.json');
        const builduniaPackage = require('$BUILDUNIA_SOURCE_DIR/package.json');
        
        // Merge dependencies
        codeuniaPackage.dependencies = {
            ...codeuniaPackage.dependencies,
            ...builduniaPackage.dependencies
        };
        
        // Add BuildUnia scripts
        codeuniaPackage.scripts = {
            ...codeuniaPackage.scripts,
            'buildunia:dev': 'cd modules/buildunia && npm run dev',
            'buildunia:build': 'cd modules/buildunia && npm run build',
            'buildunia:setup': 'cd modules/buildunia && npm run setup'
        };
        
        fs.writeFileSync('$CODEUNIA_TARGET_DIR/package.json', JSON.stringify(codeuniaPackage, null, 2));
    "
    
    print_success "Dependencies updated"
}

# Update environment variables
update_environment() {
    print_info "Setting up environment variables..."
    
    ENV_FILE="$CODEUNIA_TARGET_DIR/.env.local"
    
    # Create .env.local if it doesn't exist
    touch "$ENV_FILE"
    
    # Add BuildUnia environment variables
    cat >> "$ENV_FILE" << EOL

# BuildUnia Module Configuration
NEXT_PUBLIC_BUILDUNIA_ENABLED=true
NEXT_PUBLIC_BUILDUNIA_VERSION=1.0.0

# BuildUnia Database (use same as main Codeunia)
# NEXT_PUBLIC_BUILDUNIA_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_BUILDUNIA_SUPABASE_ANON_KEY=your_supabase_key

# BuildUnia Payments
# BUILDUNIA_STRIPE_SECRET_KEY=your_stripe_secret_key
# NEXT_PUBLIC_BUILDUNIA_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# BuildUnia Features
NEXT_PUBLIC_BUILDUNIA_MENTORSHIP_ENABLED=true
NEXT_PUBLIC_BUILDUNIA_COMPONENTS_STORE_ENABLED=true
NEXT_PUBLIC_BUILDUNIA_ADMIN_PANEL_ENABLED=true

EOL
    
    print_success "Environment variables added to .env.local"
    print_warning "Please update the Supabase and Stripe credentials in .env.local"
}

# Create integration files
create_integration_files() {
    print_info "Creating integration files..."
    
    # Create API route integration
    mkdir -p "$CODEUNIA_TARGET_DIR/app/api/buildunia"
    
    cat > "$CODEUNIA_TARGET_DIR/app/api/buildunia/[...slug]/route.ts" << 'EOL'
// BuildUnia API Route Integration
// This file forwards all /api/buildunia/* requests to the BuildUnia module

import { NextRequest } from 'next/server';

// Import BuildUnia API handlers
const builduniaHandlers = {
  // Dynamically import handlers based on route
  async getHandler(slug: string[]) {
    try {
      const handlerPath = `../../../../modules/buildunia/app/api/${slug.join('/')}/route`;
      const handler = await import(handlerPath);
      return handler;
    } catch (error) {
      console.error(`Failed to load BuildUnia handler for: ${slug.join('/')}`, error);
      return null;
    }
  }
};

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const handler = await builduniaHandlers.getHandler(params.slug);
  if (handler?.GET) {
    return handler.GET(request, { params });
  }
  return new Response('Not Found', { status: 404 });
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const handler = await builduniaHandlers.getHandler(params.slug);
  if (handler?.POST) {
    return handler.POST(request, { params });
  }
  return new Response('Not Found', { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const handler = await builduniaHandlers.getHandler(params.slug);
  if (handler?.PUT) {
    return handler.PUT(request, { params });
  }
  return new Response('Not Found', { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const handler = await builduniaHandlers.getHandler(params.slug);
  if (handler?.DELETE) {
    return handler.DELETE(request, { params });
  }
  return new Response('Not Found', { status: 404 });
}
EOL

    # Create page route integration
    mkdir -p "$CODEUNIA_TARGET_DIR/app/buildunia"
    
    cat > "$CODEUNIA_TARGET_DIR/app/buildunia/[[...slug]]/page.tsx" << 'EOL'
// BuildUnia Page Route Integration
// This file forwards all /buildunia/* page requests to the BuildUnia module

import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BuilduniaPageProps {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Dynamic import of BuildUnia pages based on route
async function getBuilduniaPage(slug: string[] = []) {
  try {
    const pagePath = slug.length === 0 
      ? '../../../modules/buildunia/app/page'
      : `../../../modules/buildunia/app/${slug.join('/')}/page`;
    
    const page = await import(pagePath);
    return page.default;
  } catch (error) {
    console.error(`Failed to load BuildUnia page for: ${slug?.join('/') || 'home'}`, error);
    return null;
  }
}

export default async function BuilduniaPage({ params, searchParams }: BuilduniaPageProps) {
  const PageComponent = await getBuilduniaPage(params.slug);
  
  if (!PageComponent) {
    notFound();
  }
  
  return <PageComponent params={params} searchParams={searchParams} />;
}

export async function generateMetadata({ params }: BuilduniaPageProps): Promise<Metadata> {
  const slug = params.slug?.join('/') || '';
  
  return {
    title: `BuildUnia ${slug ? `- ${slug}` : ''}`,
    description: 'IoT & Software Projects, Components, and Mentorship by Codeunia',
  };
}
EOL

    print_success "Integration files created"
}

# Update main navigation
update_navigation() {
    print_info "Updating navigation (manual step required)..."
    
    cat > "$CODEUNIA_TARGET_DIR/BUILDUNIA_NAVIGATION_INSTRUCTIONS.md" << 'EOL'
# BuildUnia Navigation Integration

Add this to your main navigation component:

```tsx
// In your main navigation file (e.g., components/Navigation.tsx)
import { builduniaConfig } from './modules/buildunia/buildunia.config';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { 
    name: 'Projects & Kits', 
    href: '/buildunia',
    description: 'IoT & Software projects with mentorship'
  },
  { name: 'Community', href: '/community' },
  // ... other navigation items
];
```

## Mobile Navigation
For mobile navigation, add:
```tsx
{
  name: 'Projects & Kits',
  href: '/buildunia',
  icon: PackageIcon, // or any suitable icon
}
```

## Header Integration
In your header component:
```tsx
import Link from 'next/link';

<Link 
  href="/buildunia"
  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
>
  Projects & Kits
</Link>
```
EOL

    print_success "Navigation instructions created"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    cd "$CODEUNIA_TARGET_DIR"
    npm install
    
    print_success "Dependencies installed"
}

# Create setup instructions
create_setup_instructions() {
    print_info "Creating setup instructions..."
    
    cat > "$CODEUNIA_TARGET_DIR/BUILDUNIA_SETUP.md" << 'EOL'
# BuildUnia Module Setup Complete! 🎉

## ✅ What was done automatically:
1. Module copied to `modules/buildunia/`
2. Dependencies added to package.json
3. Environment variables added to .env.local
4. API routes integrated
5. Page routes integrated

## 🔧 Manual steps required:

### 1. Update Environment Variables
Edit `.env.local` and add your actual credentials:
```env
NEXT_PUBLIC_BUILDUNIA_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_BUILDUNIA_SUPABASE_ANON_KEY=your_actual_supabase_key
BUILDUNIA_STRIPE_SECRET_KEY=your_actual_stripe_secret_key
```

### 2. Run Database Setup
```bash
# In your Supabase SQL Editor, run:
# modules/buildunia/enhanced-buildunia-setup.sql
```

### 3. Setup Storage
Follow instructions in: `modules/buildunia/STORAGE_SETUP_MANUAL.md`

### 4. Update Navigation
Follow instructions in: `BUILDUNIA_NAVIGATION_INSTRUCTIONS.md`

### 5. Test Integration
```bash
npm run dev
# Visit: http://localhost:3000/buildunia
```

## 🎯 Access Points:
- **Main Store**: `/buildunia`
- **Admin Panel**: `/buildunia/admin`
- **API Docs**: `/buildunia/api`

## 📊 Revenue Tracking:
All BuildUnia revenue will appear in your main Codeunia analytics dashboard.

## 🆘 Support:
If you need help, check the documentation in `modules/buildunia/`
EOL

    print_success "Setup instructions created"
}

# Main execution
main() {
    echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        BuildUnia Integration         ║${NC}"
    echo -e "${BLUE}║         for Codeunia Platform        ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
    echo ""
    
    # Step 1: Get Codeunia directory
    get_codeunia_directory
    
    # Step 2: Copy module
    copy_module
    
    # Step 3: Update dependencies
    update_dependencies
    
    # Step 4: Update environment
    update_environment
    
    # Step 5: Create integration files
    create_integration_files
    
    # Step 6: Update navigation
    update_navigation
    
    # Step 7: Install dependencies
    install_dependencies
    
    # Step 8: Create setup instructions
    create_setup_instructions
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     🎉 Integration Complete! 🎉     ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
    echo ""
    print_success "BuildUnia module has been successfully integrated!"
    print_info "Next steps: Check BUILDUNIA_SETUP.md for manual configuration"
    echo ""
    echo -e "${BLUE}🚀 Once setup is complete, visit: http://localhost:3000/buildunia${NC}"
}

# Run the integration
main
