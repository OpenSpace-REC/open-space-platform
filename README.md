This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First things first, Install PNPM by following documentation given below (ignore if installed already)
https://pnpm.io/installation

First, run the development server:

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Authentication

This project uses [Auth.js](https://authjs.dev) (formerly NextAuth.js) for authentication. To get started with authentication, follow the [Auth.js documentation](https://authjs.dev/getting-started/introduction).

## Database

This project uses [Prisma](https://www.prisma.io) as the ORM and [PostgreSQL](https://www.postgresql.org) as the database. To set up the database, follow these steps:


1. Update your `.env` file with your PostgreSQL connection string:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    ```

2. Run the Prisma migrations to set up your database schema:
    ```bash
    pnpm prisma migrate dev
    ```

## UI Components

This project uses [shadcn](https://shadcn.dev) for UI components. To learn more about using shadcn, refer to the [shadcn documentation](https://shadcn.dev/docs).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Prisma ORM](https://www.prisma.io/orm) - Learn about the Prisma ORM
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


