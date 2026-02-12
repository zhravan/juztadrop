import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { healthRouter } from './routes';
import { errorHandler, responseEnvelope } from './middleware';
import { runMigrations } from '@justadrop/db';

const isProduction = process.env.NODE_ENV === 'production';
const shouldRunMigrations = process.env.RUN_MIGRATIONS !== 'false';

// Run migrations before starting the server
async function startServer() {
  // Run migrations only if enabled (default: true, set RUN_MIGRATIONS=false to disable)
  if (shouldRunMigrations) {
    try {
      console.log('Running database migrations...');
      await runMigrations();
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Failed to run migrations:', error);
      // In production, exit if migrations fail
      if (isProduction) {
        console.error('Exiting due to migration failure in production');
        process.exit(1);
      } else {
        console.warn('Continuing in development mode despite migration failure');
      }
    }
  } else {
    console.log('Migrations skipped (RUN_MIGRATIONS=false)');
  }

  const app = new Elysia()
    .use(cors())
    .use(errorHandler)
    .use(responseEnvelope);

  // Only enable Swagger in non-production environments
  if (!isProduction) {
    app.use(
      swagger({
        documentation: {
          info: {
            title: 'Just a Drop API',
            version: '1.0.0',
            description: 'API for connecting volunteers with organizations',
          },
          tags: [
            { name: 'health', description: 'Health check endpoints' },
          ],
        },
      })
    );
  }

  app.get('/', () => ({ message: 'Just a Drop API' }))
    .use(healthRouter)
    .listen(3001);

  console.log(`API running at http://${app.server?.hostname}:${app.server?.port}`);
  if (!isProduction) {
    console.log(`OpenAPI docs at http://${app.server?.hostname}:${app.server?.port}/swagger`);
  }
}

startServer();
