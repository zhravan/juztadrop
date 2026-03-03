/**
 * Seed causes with default values (animal_welfare, education, etc.).
 * Run on server boot after migrations; only inserts if no rows exist.
 */

import { db } from './index.js';
import { causes } from './schema.js';
import { createId } from '@paralleldrive/cuid2';
import { logger } from '../utils/logger.js';

const DEFAULT_CAUSES = [
  { value: 'animal_welfare', label: 'Animal welfare', sortOrder: 0 },
  { value: 'environmental', label: 'Environment', sortOrder: 1 },
  { value: 'humanitarian', label: 'Humanitarian', sortOrder: 2 },
  { value: 'education', label: 'Education', sortOrder: 3 },
  { value: 'healthcare', label: 'Healthcare', sortOrder: 4 },
  { value: 'poverty_alleviation', label: 'Poverty alleviation', sortOrder: 5 },
  { value: 'women_empowerment', label: 'Women empowerment', sortOrder: 6 },
  { value: 'child_welfare', label: 'Child welfare', sortOrder: 7 },
  { value: 'elderly_care', label: 'Elderly care', sortOrder: 8 },
  { value: 'disability_support', label: 'Disability support', sortOrder: 9 },
  { value: 'rural_development', label: 'Rural development', sortOrder: 10 },
  { value: 'urban_development', label: 'Urban development', sortOrder: 11 },
  { value: 'arts_culture', label: 'Arts & culture', sortOrder: 12 },
  { value: 'sports', label: 'Sports', sortOrder: 13 },
  { value: 'technology', label: 'Technology', sortOrder: 14 },
  { value: 'mental_health', label: 'Mental health', sortOrder: 15 },
  { value: 'hunger_relief', label: 'Hunger & food security', sortOrder: 16 },
  { value: 'disaster_relief', label: 'Disaster relief', sortOrder: 17 },
  { value: 'youth_development', label: 'Youth development', sortOrder: 18 },
  { value: 'literacy', label: 'Literacy', sortOrder: 19 },
  { value: 'sanitation_hygiene', label: 'Sanitation & hygiene', sortOrder: 20 },
  { value: 'wildlife_conservation', label: 'Wildlife conservation', sortOrder: 21 },
  { value: 'climate_action', label: 'Climate action', sortOrder: 22 },
  { value: 'community_development', label: 'Community development', sortOrder: 23 },
  { value: 'vocational_training', label: 'Vocational training', sortOrder: 24 },
  { value: 'human_rights', label: 'Human rights', sortOrder: 25 },
  { value: 'heritage_conservation', label: 'Heritage conservation', sortOrder: 26 },
  { value: 'waste_management', label: 'Waste management', sortOrder: 27 },
  { value: 'other', label: 'Other', sortOrder: 28 },
];

export async function runSeedCauses(): Promise<void> {
  try {
    const existing = await db.select().from(causes);
    if (existing.length > 0) {
      logger.debug({ count: existing.length }, 'Causes already seeded, skipping');
      return;
    }
    for (const row of DEFAULT_CAUSES) {
      await db.insert(causes).values({
        id: createId(),
        value: row.value,
        label: row.label,
        sortOrder: row.sortOrder,
      });
    }
    logger.info({ count: DEFAULT_CAUSES.length }, 'Seeded causes with default values');
  } catch (error) {
    logger.warn({ error }, 'Seed causes failed (table may not exist yet - run migrations first)');
  }
}
