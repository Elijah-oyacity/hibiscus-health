# Hibiscus Health - Ecommerce Platform

A Next.js 15 ecommerce web application for selling hibiscus supplements, featuring subscription-based payments via Stripe and authentication using Auth.js v5.

## Features

- **Authentication**: User registration, login, and profile management using Auth.js v5
- **Product Catalog**: Browse and search for hibiscus supplements
- **Shopping Cart**: Add products to cart and checkout
- **Subscription Management**: Subscribe to regular deliveries of products
- **Payment Processing**: Secure payments with Stripe
- **User Dashboard**: View orders, subscriptions, and account settings
- **Admin Dashboard**: Manage products, orders, customers, and view analytics

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Authentication**: Auth.js v5 (NextAuth)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Google OAuth credentials (for social login)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hibiscus_health"
DIRECT_URL="postgresql://username:password@localhost:5432/hibiscus_health"

# Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/hibiscus-health.git
   cd hibiscus-health
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up the database:
   \`\`\`bash
   npx prisma migrate dev
   npx prisma db seed
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js 15 App Router structure
- `/components` - Reusable UI components
- `/lib` - Utility functions, database schema, and API clients
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Admin Access

After running the seed script, you can log in as an admin with:
- Email: admin@hibiscushealth.com
- Password: password123

## Test User

You can also log in as a regular user with:
- Email: user@example.com
- Password: password123

## Deployment

This project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel and set the required environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's create a mock API route for products:
