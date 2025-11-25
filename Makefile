.PHONY: install dev build clean db-setup db-generate db-migrate db-studio db-seed-admin

install:
	bun install

dev:
	bun run dev

build:
	bun run build

clean:
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	rm -rf apps/*/.next apps/*/dist packages/*/dist
	rm -rf .next dist

db-setup:
	docker run --name justadrop-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=justadrop -p 5432:5432 -d postgres:16-alpine

db-generate:
	bun run db:generate

db-migrate:
	bun run db:migrate

db-studio:
	bun run db:studio

db-seed-admin:
	cd packages/db && bun run seed:admin

db-stop:
	docker stop justadrop-db

db-remove:
	docker rm justadrop-db
