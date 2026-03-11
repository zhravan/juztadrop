import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import type { VolunteeringData } from '../db/schema.js';
import { and, eq, isNotNull, sql, desc } from 'drizzle-orm';

export interface Volunteer {
  id: string;
  name: string | null;
  email: string;
  causes: string[];
  skills: Array<{ name: string; expertise: string }>;
}

/** User with volunteering data, for GET /volunteers/users/:userId */
export interface VolunteerWithUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  isBanned: boolean;
  volunteering: VolunteeringData | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VolunteerFilters {
  causes?: string[];
  skills?: string[];
  limit?: number;
  offset?: number;
}

export class VolunteerRepository {
  async findMany(filters: VolunteerFilters): Promise<{ items: Volunteer[]; total: number }> {
    const { causes = [], skills = [], limit = 20, offset = 0 } = filters;

    const baseConditions = and(
      eq(users.isBanned, false),
      isNotNull(users.volunteering),
      sql`(${users.volunteering}->>'isInterest')::boolean = true`
    );

    let causesCondition = sql`true`;
    if (causes.length > 0) {
      const causesChecks = causes.map(
        (c) => sql`(${users.volunteering}->'causes') @> ${JSON.stringify([c])}::jsonb`
      );
      causesCondition = sql`(${sql.join(causesChecks, sql` OR `)})`;
    }

    let skillsCondition = sql`true`;
    if (skills.length > 0) {
      const skillsChecks = skills.map(
        (s) => sql`(${users.volunteering}->'skills') @> ${JSON.stringify([{ name: s }])}::jsonb`
      );
      skillsCondition = sql`(${sql.join(skillsChecks, sql` OR `)})`;
    }

    const conditions = and(baseConditions, causesCondition, skillsCondition);

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        volunteering: users.volunteering,
      })
      .from(users)
      .where(conditions)
      .orderBy(desc(users.createdAt))
      .limit(Math.min(limit, 100))
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(conditions);

    const total = countResult[0]?.count ?? 0;

    const items: Volunteer[] = rows
      .filter((r) => r.volunteering && typeof r.volunteering === 'object')
      .map((r) => {
        const v = r.volunteering as {
          causes?: string[];
          skills?: Array<{ name: string; expertise: string }>;
        };
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          causes: v?.causes ?? [],
          skills: v?.skills ?? [],
        };
      });

    return { items, total };
  }

  async findById(userId: string): Promise<VolunteerWithUser | null> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
        name: users.name,
        phone: users.phone,
        gender: users.gender,
        isBanned: users.isBanned,
        volunteering: users.volunteering,
        deletedAt: users.deletedAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(
        and(
          eq(users.id, userId),
          eq(users.isBanned, false),
          isNotNull(users.volunteering),
          sql`(${users.volunteering}->>'isInterest')::boolean = true`
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row?.volunteering || typeof row.volunteering !== 'object') {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      emailVerified: row.emailVerified,
      name: row.name,
      phone: row.phone,
      gender: row.gender,
      isBanned: row.isBanned,
      volunteering: row.volunteering as VolunteeringData,
      deletedAt: row.deletedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
