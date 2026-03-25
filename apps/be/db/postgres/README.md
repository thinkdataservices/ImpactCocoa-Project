# PostgreSQL/PostGIS Migration Skeleton

This directory contains the initial PostgreSQL/PostGIS migration skeleton for the ImpactCocoa architecture.

## Scope

The files here introduce:

- a SQL-file migration runner using `pg`
- schema-per-service database ownership
- PostGIS/CITEXT/PGCrypto extensions
- draft core tables for the agreed ImpactCocoa domains

The current runnable backend still uses the legacy `sql.js` sample app. This PostgreSQL folder is the migration path toward the new ImpactCocoa backend.

## Environment

Set the backend database connection before running migrations:

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/impactcocoa"
export DATABASE_SSL="false"
```

## Run migrations

From the repository root:

```bash
pnpm --filter be db:pg:migrate
```

## Migration ordering

Migration files are applied in lexical order.

- never edit an already-applied SQL file
- create a new SQL file for each change
- schema ownership must stay aligned with the architecture documents in `docs/`
