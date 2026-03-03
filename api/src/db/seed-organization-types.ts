/**
 * Seed organization_types with default values (NGO, NPO, Trust, Foundation, Society).
 * Run on server boot after migrations; only inserts if no rows exist.
 */

import { db } from './index.js';
import { organizationTypes } from './schema.js';
import { createId } from '@paralleldrive/cuid2';
import { logger } from '../utils/logger.js';

const DEFAULT_ORGANIZATION_TYPES = [
  { name: 'NGO', label: 'NGO', sortOrder: 0 },
  { name: 'NPO', label: 'NPO', sortOrder: 1 },
  { name: 'Trust', label: 'Trust', sortOrder: 2 },
  { name: 'Foundation', label: 'Foundation', sortOrder: 3 },
  { name: 'Society', label: 'Society', sortOrder: 4 },
];

export async function runSeedOrganizationTypes(): Promise<void> {
  try {
    const existing = await db.select().from(organizationTypes);
    if (existing.length > 0) {
      logger.debug({ count: existing.length }, 'Organization types already seeded, skipping');
      return;
    }
    for (const row of DEFAULT_ORGANIZATION_TYPES) {
      await db.insert(organizationTypes).values({
        id: createId(),
        name: row.name,
        label: row.label,
        sortOrder: row.sortOrder,
      });
    }
    logger.info(
      { count: DEFAULT_ORGANIZATION_TYPES.length },
      'Seeded organization_types with default values'
    );
  } catch (error) {
    logger.warn(
      { error },
      'Seed organization_types failed (table may not exist yet — run migrations first)'
    );
    // Do not throw: allow server to start; run migration and restart to seed
  }
}
