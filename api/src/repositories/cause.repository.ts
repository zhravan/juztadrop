import { db } from '../db/index.js';
import { causes } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface Cause {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CauseRepository {
  async findAll(): Promise<Cause[]> {
    const rows = await db.select().from(causes).orderBy(asc(causes.sortOrder), asc(causes.value));
    return rows.map((r) => ({
      id: r.id,
      value: r.value,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findAllValues(): Promise<string[]> {
    const rows = await db.select({ value: causes.value }).from(causes);
    return rows.map((r) => r.value);
  }

  async findById(id: string): Promise<Cause | null> {
    const rows = await db.select().from(causes).where(eq(causes.id, id));
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      value: r.value,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async findByValue(value: string): Promise<Cause | null> {
    const rows = await db.select().from(causes).where(eq(causes.value, value));
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      value: r.value,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async create(data: { value: string; label: string; sortOrder?: number }): Promise<Cause> {
    const id = createId();
    const sortOrder = data.sortOrder ?? 0;
    await db.insert(causes).values({
      id,
      value: data.value,
      label: data.label,
      sortOrder,
    });
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create cause');
    return created;
  }
}
