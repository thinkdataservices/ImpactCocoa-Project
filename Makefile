.PHONY: dev dev-fe dev-be install lint format build clean db-reset api-gen

# Run both FE and BE in parallel
dev:
	@echo "🚀 Starting FE and BE in parallel..."
	@make -j2 dev-fe dev-be

# Run frontend only
dev-fe:
	@echo "⚛️  Starting Frontend on http://localhost:3000"
	@cd apps/fe && bun run dev

# Run backend only
dev-be:
	@echo "🔄 Running migrations..."
	@cd apps/be && bun run db:migrate
	@echo "🚀 Starting Backend on http://localhost:8000"
	@cd apps/be && bun run dev

# Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	@pnpm install

# Run linter
lint:
	@echo "🔍 Running Biome linter..."
	@pnpm lint

# Format code
format:
	@echo "✨ Formatting code..."
	@pnpm format

# Build all apps
build:
	@echo "🏗️  Building all apps..."
	@pnpm build

# Run all apps 
start:
	@echo "🚀 Running Backend (start)..."
	@cd apps/be && bun run start &
	@echo "⚛️  Running Frontend (preview)..."
	@cd apps/fe && bun run preview
	
# Clean node_modules and build artifacts
clean:
	@echo "🧹 Cleaning..."
	@rm -rf node_modules apps/*/node_modules apps/*/dist

db-reset:
	@echo "🗑️  Resetting database..."
	@cd apps/be && bun run db:reset
	@echo "✨ Database reset complete!"

api-gen:
	@echo "📝 Generating BE OpenAPI spec and copying to FE..."
	@cd apps/be && bun run generate:swagger
	@cp apps/be/public/swagger.json apps/fe/swagger.json
	@cd apps/fe && bun run api-gen
	@rm -f apps/fe/swagger.json
