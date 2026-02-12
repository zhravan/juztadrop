import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { join } from 'path';

function getConnectionString(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'justadrop';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

/**
 * Wait for database to be ready with retry logic
 */
async function waitForDatabase(maxRetries = 10, delayMs = 1000): Promise<void> {
  const connectionString = getConnectionString();
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const testClient = postgres(connectionString, { max: 1 });
      await testClient`SELECT 1`;
      await testClient.end();
      return;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error(`Database not available after ${maxRetries} attempts: ${error}`);
      }
      console.log(`Database not ready, retrying in ${delayMs}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Run database migrations with advisory lock to prevent concurrent migrations
 * Can be called from server startup or run standalone
 */
export async function runMigrations(): Promise<void> {
  // Wait for database to be ready (useful in Docker/K8s environments)
  await waitForDatabase();
  
  const connectionString = getConnectionString();
  // Use a separate connection with max: 1 for migrations
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    console.log('Running migrations...');
    
    // Use PostgreSQL advisory lock to prevent concurrent migrations
    // Lock ID: 123456789 (arbitrary but consistent)
    const lockId = 123456789;
    
    try {
      // Try to acquire lock (non-blocking)
      const lockResult = await client.unsafe(`SELECT pg_try_advisory_lock(${lockId}) as acquired`);
      const lockAcquired = lockResult[0]?.acquired;
      
      if (!lockAcquired) {
        console.log('Another migration is already running, skipping...');
        return;
      }
      
      // Resolve migrations folder path relative to monorepo root
      // When server runs, it should be executed from monorepo root
      // Migrations are at: packages/db/drizzle
      const cwd = process.cwd();
      const migrationsFolder = join(cwd, 'packages', 'db', 'drizzle');
      
      await migrate(db, { migrationsFolder });
      console.log('Migrations complete');
    } finally {
      // Always release the lock
      await client.unsafe(`SELECT pg_advisory_unlock(${lockId})`);
    }
  } finally {
    await client.end();
  }
}

// Run migrations if executed directly
async function main() {
  try {
    await runMigrations();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

// Check if this file is being run directly (CommonJS compatible)
if (require.main === module) {
  main();
}
