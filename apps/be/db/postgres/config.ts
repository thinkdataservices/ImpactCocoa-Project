import type { ConnectionOptions } from 'node:tls';

export interface PostgresMigrationConfig {
  connectionString: string;
  ssl?: ConnectionOptions;
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function getPostgresMigrationConfig(): PostgresMigrationConfig {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is required. Example: postgresql://postgres:postgres@localhost:5432/impactcocoa',
    );
  }

  const ssl = parseBoolean(process.env.DATABASE_SSL) ? { rejectUnauthorized: false } : undefined;

  return {
    connectionString,
    ssl,
  };
}
