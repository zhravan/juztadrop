import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { db, organizations, admins } from '@justadrop/db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin auth middleware
const adminAuth = (app: Elysia) =>
  app
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .derive(async ({ headers, jwt }) => {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
      }

      const token = authHeader.substring(7);
      const payload = await jwt.verify(token);

      if (!payload || payload.type !== 'admin') {
        throw new Error('Admin access required');
      }

      const admin = await db.select().from(admins).where(eq(admins.id, payload.id));
      if (admin.length === 0) {
        throw new Error('Admin not found');
      }

      return { adminId: payload.id };
    });

export const adminRouter = new Elysia({ prefix: '/admin', tags: ['admin'] })
  .use(adminAuth)

  // Get all pending organizations
  .get('/organizations/pending', async () => {
    const pending = await db.select().from(organizations)
      .where(eq(organizations.approval_status, 'pending'));
    return pending.map(org => ({ ...org, password_hash: undefined }));
  }, {
    detail: {
      summary: 'Get pending organizations',
      description: 'List all organizations awaiting approval',
    }
  })

  // Get all organizations (with filters)
  .get('/organizations', async ({ query }) => {
    let orgs;
    if (query.status) {
      orgs = await db.select().from(organizations)
        .where(eq(organizations.approval_status, query.status as any));
    } else {
      orgs = await db.select().from(organizations);
    }
    return orgs.map(org => ({ ...org, password_hash: undefined }));
  }, {
    query: t.Object({
      status: t.Optional(t.Union([
        t.Literal('pending'),
        t.Literal('approved'),
        t.Literal('rejected'),
        t.Literal('blacklisted')
      ]))
    }),
    detail: {
      summary: 'Get all organizations',
      description: 'List all organizations with optional status filter',
    }
  })

  // Approve organization
  .patch('/organizations/:id/approve', async ({ params: { id }, body, adminId }) => {
    const updated = await db.update(organizations)
      .set({
        approval_status: 'approved',
        approved_at: new Date(),
        approved_by: adminId,
        approval_notes: body.notes,
        verified: true,
      })
      .where(eq(organizations.id, id))
      .returning();

    if (updated.length === 0) {
      throw new Error('Organization not found');
    }

    return { ...updated[0], password_hash: undefined };
  }, {
    body: t.Object({
      notes: t.Optional(t.String()),
    }),
    detail: {
      summary: 'Approve organization',
      description: 'Approve an organization to allow them to post opportunities',
    }
  })

  // Reject organization
  .patch('/organizations/:id/reject', async ({ params: { id }, body, adminId }) => {
    const updated = await db.update(organizations)
      .set({
        approval_status: 'rejected',
        approved_by: adminId,
        approval_notes: body.notes,
      })
      .where(eq(organizations.id, id))
      .returning();

    if (updated.length === 0) {
      throw new Error('Organization not found');
    }

    return { ...updated[0], password_hash: undefined };
  }, {
    body: t.Object({
      notes: t.String(),
    }),
    detail: {
      summary: 'Reject organization',
      description: 'Reject an organization application',
    }
  })

  // Blacklist organization
  .patch('/organizations/:id/blacklist', async ({ params: { id }, body, adminId }) => {
    const updated = await db.update(organizations)
      .set({
        approval_status: 'blacklisted',
        approved_by: adminId,
        approval_notes: body.reason,
        verified: false,
      })
      .where(eq(organizations.id, id))
      .returning();

    if (updated.length === 0) {
      throw new Error('Organization not found');
    }

    return { ...updated[0], password_hash: undefined };
  }, {
    body: t.Object({
      reason: t.String(),
    }),
    detail: {
      summary: 'Blacklist organization',
      description: 'Blacklist an organization (prevents login)',
    }
  });
