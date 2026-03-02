<samp>
  
<p align="center">
  <img src="https://raw.githubusercontent.com/juztadrop/juztadrop/refs/heads/main/view/public/images/home.png" alt="JuztADrop Community" width="400" />
</p>



<h2 align="center"> Juzt a Drop</h2>
<h4 align="center"> A platform connecting volunteers with organizations that need help. </h4>

<br/><br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.md)


## Stack

- **Runtime**: Bun
- **Backend**: Elysia
- **Frontend**: Next.js (React)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS

## Structure

```
api/              Elysia backend API (includes database schema & migrations)
view/             Frontend application (includes UI components & utilities)
dashboard/        Admin dashboard (includes UI components & utilities)
```

## Prerequisites

- **Bun**: Latest version ([install](https://bun.sh))
- **Docker**: For PostgreSQL database (optional, for Docker Compose setup)

## Quick Start

### Option 1: Docker Compose for Database Only

```bash
# 1. Start PostgreSQL database
docker-compose -f docker-compose.dev.yml up -d

# Or run in foreground:
docker-compose -f docker-compose.dev.yml up

# View logs:
docker-compose -f docker-compose.dev.yml logs -f postgres

# Stop database:
docker-compose -f docker-compose.dev.yml down
```

### Option 2: Local Development

```bash
# 1. Install dependencies for each app
cd api && bun install && cd ..
cd view && bun install && cd ..
cd dashboard && bun install && cd ..

# 2. Copy environment files
cp api/.env.example api/.env
cp view/.env.example view/.env
cp dashboard/.env.example dashboard/.env

# 3. Start PostgreSQL database (if not already running)
docker-compose -f docker-compose.dev.yml up -d postgres

# 4. Run database migrations
cd api && bun run db:migrate && cd ..

# 5. Start development servers (in separate terminals)
bun run dev:api       # API on :3001
bun run dev:view      # View on :3000
bun run dev:dashboard # Dashboard on :3002
```

**Services will be available at:**
- API: http://localhost:3001
- API Docs: http://localhost:3001/swagger
- View App: http://localhost:3000
- Dashboard: http://localhost:3002

## Development

### Running Services

```bash
# Start individual services
bun run dev:api       # API on :3001
bun run dev:view      # View on :3000
bun run dev:dashboard # Dashboard on :3002
```

### Database Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio

# Reset database
bun run db:reset
```

### Docker Commands

```bash
# Start PostgreSQL database
docker-compose -f docker-compose.dev.yml up -d

# Stop database
docker-compose -f docker-compose.dev.yml down

# View database logs
docker-compose -f docker-compose.dev.yml logs -f postgres
```

## Build

```bash
# Build all apps
bun run build:api
bun run build:view
bun run build:dashboard
```

## API Documentation

OpenAPI docs available at <http://localhost:3001/swagger>

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

</samp>


