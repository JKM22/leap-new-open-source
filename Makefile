.PHONY: dev test build deploy-aws deploy-gcp clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment"
	@echo "  test         - Run all tests"
	@echo "  build        - Build the application"
	@echo "  deploy-aws   - Deploy to AWS"
	@echo "  deploy-gcp   - Deploy to GCP"
	@echo "  clean        - Clean build artifacts"
	@echo "  setup        - Set up development environment"

# Development
dev: setup-env
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Waiting for services to be ready..."
	sleep 10
	encore run

setup-env:
	@echo "Setting up development environment..."
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing Encore CLI if not present..."
	@which encore || curl -L https://encore.dev/install.sh | bash

# Testing
test:
	@echo "Running backend tests..."
	encore test
	@echo "Running frontend tests..."
	cd frontend && npm test -- --coverage --watchAll=false
	@echo "Running integration tests..."
	encore test --integration

test-watch:
	@echo "Running tests in watch mode..."
	encore test --watch

# Building
build:
	@echo "Building backend..."
	encore build
	@echo "Building frontend..."
	cd frontend && npm run build

# Deployment
deploy-aws: build
	@echo "Deploying to AWS..."
	@if [ -z "$(ENV)" ]; then \
		echo "Error: ENV variable required. Use: make deploy-aws ENV=staging|production"; \
		exit 1; \
	fi
	encore deploy $(ENV) --profile aws-default

deploy-gcp: build
	@echo "Deploying to GCP..."
	@if [ -z "$(ENV)" ]; then \
		echo "Error: ENV variable required. Use: make deploy-gcp ENV=staging|production"; \
		exit 1; \
	fi
	encore deploy $(ENV) --profile gcp-default

deploy-local: build
	@echo "Deploying locally..."
	encore run --profile local

# Environment management
setup-secrets:
	@echo "Setting up secrets..."
	@echo "Please set the following secrets:"
	@echo "  encore secret set OpenAIKey"
	@echo "  encore secret set EventBusType"
	@echo "  encore secret set KafkaBrokers"
	@echo "  encore secret set GCPProjectId"
	@echo "  encore secret set NATSServers"

create-env-staging:
	@echo "Creating staging environment..."
	encore env create staging --cloud=aws

create-env-production:
	@echo "Creating production environment..."
	encore env create production --cloud=aws

# Database
db-migrate:
	@echo "Running database migrations..."
	encore db migrate

db-reset:
	@echo "Resetting database..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.dev.yml up -d postgres
	sleep 5
	encore db migrate

# Linting and formatting
lint:
	@echo "Running backend linting..."
	encore lint
	@echo "Running frontend linting..."
	cd frontend && npm run lint

format:
	@echo "Formatting code..."
	cd frontend && npm run format

# Docker management
docker-up:
	docker-compose -f docker-compose.dev.yml up -d

docker-down:
	docker-compose -f docker-compose.dev.yml down

docker-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf .encore/build
	docker-compose -f docker-compose.dev.yml down -v

clean-all: clean
	@echo "Cleaning all dependencies..."
	rm -rf frontend/node_modules
	docker system prune -f

# Development utilities
logs:
	@echo "Showing application logs..."
	encore logs --follow

monitor:
	@echo "Opening Encore development dashboard..."
	open http://localhost:4000

frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

# CI/CD helpers
ci-setup:
	npm install -g @encore/cli
	cd frontend && npm ci

ci-test: ci-setup test

ci-build: ci-setup build

# Generate documentation
docs:
	@echo "Generating API documentation..."
	encore gen docs

# Security
security-scan:
	@echo "Running security scans..."
	npm audit
	cd frontend && npm audit
