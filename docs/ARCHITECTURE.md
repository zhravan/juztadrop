# Architecture

Just a Drop connects volunteers with organizations through a modern web platform built as a Bun monorepo.

## Stack

```
Frontend (Next.js 14)  →  API (Elysia)  →  Database (PostgreSQL)
     ↓                        ↓                    ↓
  shadcn/ui              JWT Auth            Drizzle ORM
  Tailwind CSS           Swagger
```

## Technology

- **Runtime**: Bun (faster than Node.js, built-in TypeScript)
- **Frontend**: Next.js 14 App Router + React 18 + shadcn/ui
- **Backend**: Elysia (fast Bun-native framework)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (shared between frontend/backend)
- **Auth**: JWT tokens
- **Email**: Nodemailer

## Project Structure

```
apps/
  web/              # Next.js frontend
  api/              # Elysia backend
packages/
  db/               # Drizzle schemas & migrations
  types/            # Shared TypeScript types
```

## Key Workflows

### Organization Approval

1. Register → status: `pending`
2. Admin reviews → approve/reject
3. Approved → can create opportunities

### Authentication

1. Register → send verification email
2. Verify email → emailVerified: true
3. Login → JWT token
4. Authenticated requests → verify JWT

## Deployment

- **Development**: Local Bun dev servers + Docker PostgreSQL
- **Production**: Docker Compose + Caddy (auto HTTPS)

See [DEPLOYMENT.md](../DEPLOYMENT.md) for details.
