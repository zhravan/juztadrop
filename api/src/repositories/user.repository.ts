import { db, users } from '../db/index.js';
import type { VolunteeringData } from '../db/schema.js';
import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface User {
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

/** Volunteer list item (user with volunteering summary). */
export interface Volunteer {
  id: string;
  name: string | null;
  email: string;
  causes: string[];
  skills: Array<{ name: string; expertise: string }>;
}

/** Full user with volunteering data, for GET /volunteers/users/:userId */
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

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      isBanned: user.isBanned,
      volunteering: user.volunteering,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      isBanned: user.isBanned,
      volunteering: user.volunteering,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(email: string, emailVerified: boolean = false): Promise<User> {
    const id = createId();
    await db.insert(users).values({
      id,
      email,
      emailVerified,
    });

    const user = await this.findById(id);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async updateEmailVerified(id: string, emailVerified: boolean): Promise<void> {
    await db.update(users).set({ emailVerified }).where(eq(users.id, id));
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      phone?: string;
      gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
      volunteering?: {
        isInterest: boolean;
        skills: Array<{ name: string; expertise: string }>;
        causes: string[];
      };
    }
  ): Promise<User | null> {
    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateFields.name = data.name || null;
    }
    if (data.phone !== undefined) {
      updateFields.phone = data.phone || null;
    }
    if (data.gender !== undefined) {
      updateFields.gender = data.gender || null;
    }
    if (data.volunteering !== undefined) {
      updateFields.volunteering = data.volunteering;
    }

    const [updated] = await db.update(users).set(updateFields).where(eq(users.id, id)).returning();

    if (!updated) {
      return null;
    }

    return {
      id: updated.id,
      email: updated.email,
      emailVerified: updated.emailVerified,
      name: updated.name,
      phone: updated.phone,
      gender: updated.gender,
      isBanned: updated.isBanned,
      volunteering: updated.volunteering,
      deletedAt: updated.deletedAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async findVolunteers(filters: VolunteerFilters): Promise<{ items: Volunteer[]; total: number }> {
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

  async findVolunteerById(userId: string): Promise<VolunteerWithUser | null> {
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
