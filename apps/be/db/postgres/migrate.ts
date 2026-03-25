import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';
import { getPostgresMigrationConfig } from './config.js';

interface MigrationFile {
  fileName: string;
  fullPath: string;
}

interface AppliedMigration {
  name: string;
  checksum: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

async function listMigrationFiles(): Promise<MigrationFile[]> {
  const entries = await readdir(migrationsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => ({
      fileName: entry.name,
      fullPath: path.join(migrationsDir, entry.name),
    }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
}

function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

async function ensureMigrationTable(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function loadAppliedMigrations(client: Client): Promise<Map<string, AppliedMigration>> {
  const result = await client.query<AppliedMigration>(
    'SELECT name, checksum FROM public.schema_migrations ORDER BY name',
  );

  return new Map(result.rows.map((row) => [row.name, row]));
}

async function run(): Promise<void> {
  const config = getPostgresMigrationConfig();
  const client = new Client(config);

  console.log('Running PostgreSQL/PostGIS migrations...');
  await client.connect();

  try {
    await ensureMigrationTable(client);
    const applied = await loadAppliedMigrations(client);
    const files = await listMigrationFiles();

    for (const file of files) {
      const sql = await readFile(file.fullPath, 'utf8');
      const hash = checksum(sql);
      const existing = applied.get(file.fileName);

      if (existing) {
        if (existing.checksum !== hash) {
          throw new Error(
            `Migration ${file.fileName} was already applied with a different checksum. Create a new migration instead of editing it.`,
          );
        }

        console.log(`  - ${file.fileName} (already applied)`);
        continue;
      }

      console.log(`  + ${file.fileName}`);
      await client.query('BEGIN');

      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO public.schema_migrations (name, checksum) VALUES ($1, $2)',
          [file.fileName, hash],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('PostgreSQL/PostGIS migrations completed.');
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
