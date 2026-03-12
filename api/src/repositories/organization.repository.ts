import { db } from '../db/index.js';
import {
  organizations,
  organizationMembers,
  organizationDocuments,
  documentTypeEnum,
} from '../db/schema.js';
import { eq, inArray, and, isNull, desc, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const ORG_OWNER_ROLE = 'owner' as const;

export interface Organization {
  id: string;
  createdBy: string;
  orgName: string;
  type: string | null;
  description: string | null;
  causes: string[];
  website: string | null;
  registrationNumber: string | null;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  verificationStatus: string;
  isCsrEligible?: boolean;
  isFcraRegistered?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ORG_VERIFICATION_STATUSES = ['pending', 'verified', 'rejected', 'suspended'] as const;
export type OrgVerificationStatus = (typeof ORG_VERIFICATION_STATUSES)[number];

export interface OrganizationListFilters {
  verificationStatus?: OrgVerificationStatus;
  type?: string;
  causes?: string[];
  isCsrEligible?: boolean;
  isFcraRegistered?: boolean;
  limit: number;
  offset: number;
}

export class OrganizationRepository {
  async create(data: {
    createdBy: string;
    orgName: string;
    type?: string | null;
    description?: string;
    causes?: string[];
    website?: string;
    registrationNumber?: string;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    documents?: Array<{ documentType: string; documentAssetUrl: string; format: string }>;
  }): Promise<Organization> {
    const id = createId();
    await db.transaction(async (tx) => {
      await tx.insert(organizations).values({
        id,
        createdBy: data.createdBy,
        orgName: data.orgName,
        type: data.type ?? null,
        description: data.description ?? null,
        causes: data.causes ?? [],
        website: data.website ?? null,
        registrationNumber: data.registrationNumber ?? null,
        contactPersonName: data.contactPersonName,
        contactPersonEmail: data.contactPersonEmail,
        contactPersonNumber: data.contactPersonNumber ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        country: data.country ?? 'India',
      });

      // Add creator as owner
      await tx.insert(organizationMembers).values({
        id: createId(),
        organizationId: id,
        userId: data.createdBy,
        role: ORG_OWNER_ROLE,
      });

      // Add documents if provided
      if (data.documents?.length) {
        await tx.insert(organizationDocuments).values(
          data.documents.map((doc) => ({
            id: createId(),
            ngoId: id,
            documentType: doc.documentType as (typeof documentTypeEnum.enumValues)[number],
            documentAssetUrl: doc.documentAssetUrl,
            format: doc.format,
          }))
        );
      }
    });

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });

    if (!org) throw new Error('Failed to create organization');

    return this.mapRow(org);
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });
    if (!org) return null;
    return this.mapRow(org);
  }

  async findManyWithFilters(
    filters: OrganizationListFilters
  ): Promise<{ items: Organization[]; total: number }> {
    const conditions = [isNull(organizations.deletedAt)];
    if (filters.verificationStatus != null) {
      conditions.push(eq(organizations.verificationStatus, filters.verificationStatus));
    }
    if (filters.type != null) {
      conditions.push(eq(organizations.type, filters.type));
    }
    if (filters.causes != null && filters.causes.length > 0) {
      conditions.push(
        sql`${organizations.causes} && ARRAY[${sql.join(
          filters.causes.map((c) => sql`${c}`),
          sql`, `
        )}]::text[]`
      );
    }
    if (typeof filters.isCsrEligible === 'boolean') {
      conditions.push(eq(organizations.isCsrEligible, filters.isCsrEligible));
    }
    if (typeof filters.isFcraRegistered === 'boolean') {
      conditions.push(eq(organizations.isFcraRegistered, filters.isFcraRegistered));
    }
    const whereClause = and(...conditions);

    const [items, countResult] = await Promise.all([
      db.query.organizations.findMany({
        where: whereClause,
        orderBy: desc(organizations.createdAt),
        limit: filters.limit,
        offset: filters.offset,
      }),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(organizations)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;
    return { items: items.map((org) => this.mapRow(org)), total };
  }

  private mapRow(org: typeof organizations.$inferSelect): Organization {
    return {
      id: org.id,
      createdBy: org.createdBy,
      orgName: org.orgName,
      type: org.type ?? null,
      description: org.description,
      causes: org.causes,
      website: org.website,
      registrationNumber: org.registrationNumber,
      contactPersonName: org.contactPersonName,
      contactPersonEmail: org.contactPersonEmail,
      contactPersonNumber: org.contactPersonNumber,
      address: org.address,
      city: org.city,
      state: org.state,
      country: org.country,
      verificationStatus: org.verificationStatus,
      isCsrEligible: org.isCsrEligible,
      isFcraRegistered: org.isFcraRegistered,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    const createdByOrgs = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.createdBy, userId));
    const memberOrgs = await db
      .select({ organizationId: organizationMembers.organizationId })
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, userId));
    const orgIds = [
      ...new Set([...createdByOrgs.map((o) => o.id), ...memberOrgs.map((m) => m.organizationId)]),
    ];
    if (orgIds.length === 0) return [];
    const list = await db.query.organizations.findMany({
      where: inArray(organizations.id, orgIds),
    });
    return list.map((org) => this.mapRow(org));
  }

  async update(
    id: string,
    data: {
      orgName?: string;
      type?: string | null;
      description?: string | null;
      causes?: string[];
      website?: string | null;
      registrationNumber?: string | null;
      contactPersonName?: string;
      contactPersonEmail?: string;
      contactPersonNumber?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
    }
  ): Promise<Organization | null> {
    const [updated] = await db
      .update(organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id))
      .returning();
    if (!updated) return null;
    return this.mapRow(updated);
  }

  async hasManageAccess(ngoId: string, userId: string): Promise<boolean> {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, ngoId),
    });
    if (!org) return false;
    if (org.createdBy === userId) return true;
    const members = await db
      .select()
      .from(organizationMembers)
      .where(
        and(eq(organizationMembers.organizationId, ngoId), eq(organizationMembers.userId, userId))
      );
    const member = members[0];
    return member != null && (member.role === 'owner' || member.role === 'admin');
  }

  async findByCreatedBy(userId: string): Promise<Organization[]> {
    const list = await db.query.organizations.findMany({
      where: eq(organizations.createdBy, userId),
    });
    return list.map((org) => this.mapRow(org));
  }
}
