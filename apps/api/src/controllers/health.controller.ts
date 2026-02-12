import { HealthService } from '../services/health.service';

const healthService = new HealthService();

export class HealthController {
  async getHealth() {
    return await healthService.getHealth();
  }

  async getLiveness() {
    return await healthService.getLiveness();
  }

  async getReadiness() {
    const result = await healthService.getReadiness();
    
    // Return appropriate HTTP status code
    if (result.status === 'ready') {
      return result;
    } else {
      // Return 503 Service Unavailable for not_ready status
      // Elysia will handle the Response object correctly
      return new Response(JSON.stringify(result), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
