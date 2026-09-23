# FYtech

FYtech is a business software and subscription platform built with Next.js, Prisma, and Stripe.

## Features

- Business workspace onboarding and setup flow
- Admin dashboard for users, businesses, software, and subscriptions
- Product catalog with Stripe checkout subscriptions
- Session-based authentication
- Prisma SQLite database for local development

## Tech stack

- Next.js 16
- React 18
- Prisma ORM
- SQLite for local development
- Stripe for billing

## Local setup

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Update the values in .env for your local environment.
4. Generate Prisma client:
   npx prisma generate
5. Push the schema to your database:
   npx prisma db push
6. Seed sample data (optional):
   npx prisma db seed
7. Start the app:
   npm run dev

The app will be available at http://localhost:3000.

## Production checklist

- Add valid Stripe keys in production
- Configure Stripe webhook endpoint for checkout completion
- Set APP_URL and NEXT_PUBLIC_APP_URL to your deployed domain
- Ensure DATABASE_URL points to your production database
- Run Prisma migrations before deployment
- Keep webhook secret and API keys in environment variables only

## Useful scripts

- npm run dev
- npm run build
- npm run start
- npm run db:generate
- npm run db:push
- npm run db:seed

## Stripe setup

1. Create products and prices in Stripe.
2. Copy each Price ID into the corresponding env variable:
   - STRIPE_PRICE_SALON
   - STRIPE_PRICE_INVENTORY
   - STRIPE_PRICE_PG
3. Add the webhook endpoint using the Stripe dashboard.
4. Set the webhook secret as STRIPE_WEBHOOK_SECRET.

## Notes

- The app uses SQLite by default for local development.
- For production, switch to PostgreSQL or MySQL in DATABASE_URL.
- Keep sensitive credentials out of source control.