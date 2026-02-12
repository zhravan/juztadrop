.PHONY: help install dev dev-api dev-view dev-dashboard build build-packages build-apps build-api build-view build-dashboard clean typecheck db-generate db-migrate db-studio

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	bun install

dev: ## Start all apps in development mode
	bun run dev

dev-api: ## Start API server
	bun run dev:api

dev-view: ## Start view app
	bun run dev:view

dev-dashboard: ## Start dashboard app
	bun run dev:dashboard

build: ## Build all packages and apps
	bun run build

build-packages: ## Build all packages
	bun run build:packages

build-apps: ## Build all apps
	bun run build:apps

build-api: ## Build API app
	bun run build:api

build-view: ## Build view app
	bun run build:view

build-dashboard: ## Build dashboard app
	bun run build:dashboard

clean: ## Clean all build artifacts
	bun run clean

typecheck: ## Type check all packages
	bun run typecheck

db-generate: ## Generate database migrations
	bun run db:generate

db-migrate: ## Run database migrations
	bun run db:migrate

db-studio: ## Open Drizzle Studio
	bun run db:studio
