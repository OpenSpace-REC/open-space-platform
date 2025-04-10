# Open Space Platform

An open-source platform for managing and collaborating on projects within educational institutions.

## Features

- Project portfolio creation and management
- GitHub integration for project tracking
- Team collaboration tools
- Automatic contribution tracking
- Achievement system

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- shadcn/ui
- NextAuth.js
- TailwindCSS

## Prerequisites

- Node.js 18+
- PNPM
- PostgreSQL
- GitHub OAuth App credentials

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/open-space-platform.git
cd open-space-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Set up the database:
```bash
pnpm prisma migrate dev
```

5. Start the development server:
```bash
pnpm dev
```

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

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Prisma ORM](https://www.prisma.io/orm) - Learn about the Prisma ORM
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


