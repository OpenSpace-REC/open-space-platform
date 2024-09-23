This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

This project uses [Auth.js](https://authjs.dev) (formerly NextAuth.js) for authentication. To get started with authentication, follow the [Auth.js documentation](https://authjs.dev/getting-started/introduction).

## Database

This project uses [Prisma](https://www.prisma.io) as the ORM and [PostgreSQL](https://www.postgresql.org) as the database. To set up the database, follow these steps:

1. Install the Prisma CLI:
    ```bash
    pnpm add -D prisma
    ```

2. Initialize Prisma in your project:
    ```bash
    pnpm prisma init
    ```

3. Update your `.env` file with your PostgreSQL connection string:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    ```

4. Run the Prisma migrations to set up your database schema:
    ```bash
    pnpm prisma migrate dev
    ```

## UI Components

This project uses [shadcn](https://shadcn.dev) for UI components. To learn more about using shadcn, refer to the [shadcn documentation](https://shadcn.dev/docs).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
