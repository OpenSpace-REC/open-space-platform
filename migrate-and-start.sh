#!/bin/sh

# Generate Prisma Client
npx prisma generate

# Check if database needs migration
if [ ! -f "/app/.migration-done" ]; then
    echo "Running database migration..."
    npx prisma db push
    touch /app/.migration-done
else
    echo "Database migration already done, skipping..."
fi

# Start the application
pnpm prisma studio &
pnpm start
