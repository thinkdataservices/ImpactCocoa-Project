# Plugilo Wishlist Dock
![Plugilo Preview](./Preview.png)
![Plugilo Embeded](./EmbedRemoteUrl.png)

A full-stack application with React frontend and Hono backend.
WebComponent that can be embeded in the website has enough CORS permissions

## Prerequisites

Install the following tools globally:

```bash
# pnpm - package manager
npm install -g pnpm

# bun - JavaScript runtime (used for running scripts)
curl -fsSL https://bun.sh/install | bash
```

## create env file, adjust API endpoint base on environment
```bash
cp .env.example .env
```

## Quick Start

```bash
# Install dependencies
make install

# Start development (FE + BE)
make dev

# Build production (FE + BE)
make build 

# Start production (FE + BE)
make start 

# Build swagger for BE and generate typescript on FE 
make api-gen

# Reset database on BE 
make db-reset
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Swagger**: http://localhost:8000/swagger

## Commands

| Command | Description |
|---------|-------------|
| `make install` | Install all dependencies |
| `make dev` | Start both FE and BE |
| `make dev-fe` | Start frontend only |
| `make dev-be` | Start backend only (runs migrations first) |
| `make api-gen` | Generate OpenAPI types for frontend |
| `make lint` | Run Biome linter |
| `make format` | Format code |
| `make build` | Build all apps |
| `make clean` | Remove node_modules and build artifacts |
| `make build` | Build all apps for production |
| `make start` | Start production server (frontend + backend) |


## Tech Stack

### Backend (`apps/be`)

| Technology | Purpose |
|------------|---------|
| [Hono](https://hono.dev) | Fast, lightweight web framework |
| [sql.js](https://sql.js.org) | SQLite in JavaScript (no native bindings) |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript execution |
| [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) | OpenAPI spec generation |

### Frontend (`apps/fe`)

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Rsbuild](https://rsbuild.dev) | Fast bundler (Rspack-based) |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [openapi-fetch](https://openapi-ts.dev/openapi-fetch) | Type-safe API client |
| [Framer Motion](https://www.framer.com/motion/) | Animation & gesture library |

### Tooling

| Tool | Purpose |
|------|---------|
| [pnpm](https://pnpm.io) | Package manager |
| [Biome](https://biomejs.dev) | Linter & formatter |
| [openapi-typescript](https://openapi-ts.dev) | Generate TS types from OpenAPI |

## Project Structure

```
├── apps/
│   ├── be/                         # Backend app
│   │   ├── db/                     # Database handling & migrations
│   │   │   ├── index.ts            # DB connection
│   │   │   ├── migrate.ts          # Migration runner
│   │   │   └── migrations/         # SQL migration files
│   │   ├── src/
│   │   │   ├── main.ts             # Server entrypoint
│   │   │   ├── data/               # Data access & business logic
│   │   │   └── routes/             # API routes
│   │   └── public/                 # Swagger & static assets
│   │
│   └── fe/                         # Frontend app
│       ├── public/                 # Static files & web component loader
│       │   ├── inject-web-component.js # Script to inject web component
│       │   └── test-web-component.html # Demo/test HTML page
│       ├── src/
│       │   ├── App.tsx             # Main React component
│       │   ├── index.tsx           # Web/component entrypoint
│       │   ├── index.css           # Global styles
│       │   └── open-api/           # Auto-generated API types (from OpenAPI)
│       ├── rsbuild.config.ts       # Rsbuild config (bundler)
│       ├── tailwind.config.js      # TailwindCSS config
│       ├── postcss.config.js       # PostCSS config
│       └── tsconfig.json           # TypeScript config
│
├── Makefile                        # Top-level dev/task commands
├── biome.json                      # Biome linter/formatter config
├── package.json                    # Monorepo scripts & metadata
└── pnpm-workspace.yaml             # pnpm monorepo config
```

## API

The backend provides REST endpoints for:

- **Stacks** - Collections/folders for organizing cards
- **Cards** - Items within stacks


See [`BE structure`](apps/be/README.md) for a detailed BE implement

See [`FE structure`](apps/fe/README.md) for a detailed FE implement

See [`RequirementChecklist`](./RequirementChecklist.md) for a detailed feature-by-feature status and must-have/nice-to-have breakdown.

