# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

FROM node:20.15.0-alpine AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.6.0
RUN pnpm install --frozen-lockfile

FROM node:20.15.0-alpine AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm@9.6.0
RUN npx prisma generate
RUN pnpm build
COPY migrate-and-start.sh .
RUN chmod +x migrate-and-start.sh

FROM node:20.15.0-alpine AS deploy

WORKDIR /app

ENV NODE_ENV production

RUN npm install -g pnpm@9.6.0

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/migrate-and-start.sh ./migrate-and-start.sh

RUN chmod +x ./migrate-and-start.sh

EXPOSE 3000
ENV PORT 3000
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/open-space?schema=public"

CMD ["sh", "./migrate-and-start.sh"]
