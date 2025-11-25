import { Elysia, t } from 'elysia';
import { db, organizations } from '@justadrop/db';
import { eq } from 'drizzle-orm';

export const organizationsRouter = new Elysia({ prefix: '/organizations', tags: ['organizations'] })
  .get('/', async () => {
    const allOrganizations = await db.select().from(organizations)
      .where(eq(organizations.approval_status, 'approved'));
    return allOrganizations.map(org => ({ ...org, password_hash: undefined }));
  })
  .get('/:id', async ({ params: { id } }) => {
    const organization = await db.select().from(organizations)
      .where(eq(organizations.id, id));
    if (organization.length === 0 || organization[0].approval_status !== 'approved') {
      throw new Error('Organization not found');
    }
    return { ...organization[0], password_hash: undefined };
  })
  .post('/', async ({ body }) => {
    const newOrganization = await db.insert(organizations).values(body).returning();
    return newOrganization[0];
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      description: t.String(),
      website: t.Optional(t.String()),
    })
  })
  .patch('/:id', async ({ params: { id }, body }) => {
    const updated = await db.update(organizations)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    if (updated.length === 0) {
      throw new Error('Organization not found');
    }
    return updated[0];
  }, {
    body: t.Partial(t.Object({
      name: t.String(),
      email: t.String(),
      description: t.String(),
      website: t.String(),
      verified: t.Boolean(),
    }))
  })
  .delete('/:id', async ({ params: { id } }) => {
    await db.delete(organizations).where(eq(organizations.id, id));
    return { success: true };
  });
