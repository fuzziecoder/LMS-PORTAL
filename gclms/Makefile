# ================================================
# GCLMS — Makefile
# ================================================
# Development workflow commands

.PHONY: setup up down logs migrate migration seed test test-api test-web test-e2e lint format clean help

# Default env file
ENV_FILE ?= .env

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup — copy env, build, start, migrate, seed
	@echo "🚀 Setting up GCLMS..."
	@if not exist .env copy .env.example .env
	@$(MAKE) up
	@timeout /t 15 /nobreak > nul
	@$(MAKE) migrate
	@$(MAKE) seed
	@echo "✅ GCLMS is ready!"
	@echo ""
	@echo "  Web:      http://localhost:3000"
	@echo "  API:      http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo "  MinIO:    http://localhost:9001"
	@echo "  Mailpit:  http://localhost:8025"

up: ## Start all services
	docker compose --env-file $(ENV_FILE) up -d --build

down: ## Stop all services
	docker compose down

logs: ## Tail all service logs
	docker compose logs -f

logs-api: ## Tail API logs
	docker compose logs -f api

logs-web: ## Tail web logs
	docker compose logs -f web

logs-worker: ## Tail worker logs
	docker compose logs -f worker

migrate: ## Run Alembic migrations
	docker compose exec api alembic upgrade head

migration: ## Create a new Alembic migration (usage: make migration name="add_users_table")
	docker compose exec api alembic revision --autogenerate -m "$(name)"

seed: ## Seed the database with demo data
	docker compose exec api python -m app.seed

test: test-api test-web ## Run all tests

test-api: ## Run backend tests
	docker compose exec api pytest -v --tb=short

test-web: ## Run frontend tests
	docker compose exec web npm run test

test-e2e: ## Run Playwright E2E tests
	cd tests/e2e && npx playwright test

lint: ## Lint all code
	docker compose exec api ruff check .
	docker compose exec web npm run lint

format: ## Format all code
	docker compose exec api ruff format .
	docker compose exec web npm run format

clean: ## Remove all containers, volumes, and generated files
	docker compose down -v --remove-orphans
	@echo "🧹 Cleaned up all containers and volumes"

ps: ## Show running services
	docker compose ps

shell-api: ## Open a shell in the API container
	docker compose exec api bash

shell-web: ## Open a shell in the web container
	docker compose exec web sh

db-shell: ## Open PostgreSQL shell
	docker compose exec postgres psql -U gclms -d gclms

redis-cli: ## Open Redis CLI
	docker compose exec redis redis-cli
