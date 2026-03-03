import { db } from '../db/index.js';
import { organizationTypes } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface OrganizationType {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationTypeRepository {
  async findAll(): Promise<OrganizationType[]> {
    const rows = await db
      .select()
      .from(organizationTypes)
      .orderBy(asc(organizationTypes.sortOrder), asc(organizationTypes.name));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findById(id: string): Promise<OrganizationType | null> {
    const rows = await db.select().from(organizationTypes).where(eq(organizationTypes.id, id));
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async findByName(name: string): Promise<OrganizationType | null> {
    const rows = await db.select().from(organizationTypes).where(eq(organizationTypes.name, name));
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      label: r.label,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async count(): Promise<number> {
    const result = await db.select().from(organizationTypes);
    return result.length;
  }

  async create(data: {
    name: string;
    label: string;
    sortOrder?: number;
  }): Promise<OrganizationType> {
    const id = createId();
    const sortOrder = data.sortOrder ?? 0;
    await db.insert(organizationTypes).values({
      id,
      name: data.name,
      label: data.label,
      sortOrder,
    });
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create organization type');
    return created;
  }

  async update(
    id: string,
    data: { name?: string; label?: string; sortOrder?: number }
  ): Promise<OrganizationType | null> {
    await db
      .update(organizationTypes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizationTypes.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db
      .delete(organizationTypes)
      .where(eq(organizationTypes.id, id))
      .returning();
    return deleted.length > 0;
  }
}
