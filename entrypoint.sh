#!/bin/sh

# Exit on any error
set -e

# Generate Prisma Client
pnpm prisma generate

# Push schema to database (creates tables etc.)
pnpm prisma migrate deploy

# Start the app
pnpm start
