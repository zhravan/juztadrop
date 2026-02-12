import { Elysia } from 'elysia';
import { HealthController } from '../controllers/health.controller';

const healthController = new HealthController();

export const healthRouter = new Elysia({ prefix: '/health', tags: ['health'] })
  .get('/', async () => {
    return await healthController.getHealth();
  })
  .get('/liveness', async () => {
    return await healthController.getLiveness();
  })
  .get('/readiness', async () => {
    return await healthController.getReadiness();
  });
