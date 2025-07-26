# BuildUnia - IoT Learning Platform

BuildUnia is a comprehensive IoT learning platform that provides hands-on project kits, expert mentorship, and a supportive community for students and enthusiasts worldwide.

## Features

- **IoT Project Kits**: Curated hardware and software packages for hands-on learning
- **Expert Mentorship**: One-on-one guidance from industry professionals
- **Community Support**: Active community of learners and mentors
- **Payment Integration**: Secure payment processing with Stripe
- **Admin Dashboard**: Comprehensive management tools for administrators

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **File Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd kharido
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin dashboard
│   ├── auth/           # Authentication pages
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout process
│   ├── mentorship/     # Mentorship booking
│   └── projects/       # Project listings
├── components/         # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
└── lib/                # Utility functions and configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@buildunia.com or visit our [contact page](https://buildunia.com/contact).

## About

BuildUnia is a product of Codeunia, dedicated to making IoT education accessible and engaging for everyone.
