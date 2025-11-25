import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { volunteersRouter } from './routes/volunteers';
import { organizationsRouter } from './routes/organizations';
import { opportunitiesRouter } from './routes/opportunities';
import { applicationsRouter } from './routes/applications';

const app = new Elysia()
  .use(cors())
  .get('/', () => ({ message: 'Just a Drop API' }))
  .get('/health', () => ({ status: 'ok' }))
  .use(volunteersRouter)
  .use(organizationsRouter)
  .use(opportunitiesRouter)
  .use(applicationsRouter)
  .listen(3001);

console.log(`API running at http://${app.server?.hostname}:${app.server?.port}`);
