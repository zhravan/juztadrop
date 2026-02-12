import { db } from '@justadrop/db';
import { sql } from 'drizzle-orm';

export class HealthService {
  /**
   * Basic health check - always returns ok if service is running
   */
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Liveness probe - checks if the service is alive
   * Returns 200 if service is running, regardless of database state
   */
  async getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe - checks if the service is ready to accept traffic
   * Returns 200 only if database connection is healthy
   */
  async getReadiness() {
    try {
      // Check database connection
      await db.execute(sql`SELECT 1`);
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'healthy',
        },
      };
    } catch (error) {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'unhealthy',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
