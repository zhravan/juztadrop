import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import { authMiddleware } from '../middleware/auth.middleware';
import { CAUSE_VALUES } from '../constants/causes.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const organizationRepository = container.getRepositories().organization;

const causeSchema = t.Array(t.String({ pattern: `^(${CAUSE_VALUES.join('|')})$` }));

export const organizationsRouter = new Elysia({ prefix: '/organizations', tags: ['organizations'] })
  .use(cookie())
  .use(authMiddleware)
  .post(
    '/',
    async (ctx: any) => {
      const { userId, body } = ctx;
      const org = await organizationRepository.create({
        createdBy: userId,
        orgName: body.orgName,
        type: body.type ?? null,
        description: body.description,
        causes: body.causes ?? [],
        website: body.website,
        registrationNumber: body.registrationNumber,
        contactPersonName: body.contactPersonName,
        contactPersonEmail: body.contactPersonEmail,
        contactPersonNumber: body.contactPersonNumber,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country ?? 'India',
        documents: body.documents,
      });
      return { organization: org };
    },
    {
      body: t.Object({
        orgName: t.String({ minLength: 1 }),
        type: t.String({ minLength: 1 }),
        description: t.String({ minLength: 1 }),
        causes: t.Array(t.String({ pattern: `^(${CAUSE_VALUES.join('|')})$` }), { minLength: 1 }),
        website: t.String({ minLength: 1 }),
        registrationNumber: t.String({ minLength: 1 }),
        contactPersonName: t.String({ minLength: 1 }),
        contactPersonEmail: t.String({ format: 'email' }),
        contactPersonNumber: t.Optional(t.String()),
        address: t.String({ minLength: 1 }),
        city: t.String({ minLength: 1 }),
        state: t.String({ minLength: 1 }),
        country: t.Optional(t.String()),
        documents: t.Optional(
          t.Array(
            t.Object({
              documentType: t.Union([
                t.Literal('registration_certificate'),
                t.Literal('80G_certificate'),
                t.Literal('12A_certificate'),
                t.Literal('PAN'),
                t.Literal('proof_of_address'),
              ]),
              documentAssetUrl: t.String(),
              format: t.String(),
            })
          )
        ),
      }),
    }
  )
  .get('/me', async (ctx: any) => {
    const { userId } = ctx;
    const orgs = await organizationRepository.findByUserId(userId);
    return { organizations: orgs };
  })
  .get(
    '/:id',
    async (ctx: any) => {
      const { userId } = ctx;
      const { id } = ctx.params;
      const hasAccess = await organizationRepository.hasManageAccess(id, userId);
      if (!hasAccess) throw new ForbiddenError('You do not have access to this organization');
      const org = await organizationRepository.findById(id);
      if (!org) throw new NotFoundError('Organization not found');
      return { organization: org };
    },
    { params: t.Object({ id: t.String() }) }
  )
  .patch(
    '/:id',
    async (ctx: any) => {
      const { userId } = ctx;
      const { id } = ctx.params;
      const body = ctx.body;
      const hasAccess = await organizationRepository.hasManageAccess(id, userId);
      if (!hasAccess)
        throw new ForbiddenError('You do not have permission to update this organization');
      const org = await organizationRepository.update(id, {
        orgName: body.orgName,
        type: body.type,
        description: body.description,
        causes: body.causes,
        website: body.website,
        registrationNumber: body.registrationNumber,
        contactPersonName: body.contactPersonName,
        contactPersonEmail: body.contactPersonEmail,
        contactPersonNumber: body.contactPersonNumber,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
      });
      if (!org) throw new NotFoundError('Organization not found');
      return { organization: org };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        orgName: t.String({ minLength: 1 }),
        type: t.String({ minLength: 1 }),
        description: t.String({ minLength: 1 }),
        causes: t.Array(t.String({ pattern: `^(${CAUSE_VALUES.join('|')})$` }), { minLength: 1 }),
        website: t.String({ minLength: 1 }),
        registrationNumber: t.String({ minLength: 1 }),
        contactPersonName: t.String({ minLength: 1 }),
        contactPersonEmail: t.String({ format: 'email' }),
        contactPersonNumber: t.Optional(t.Union([t.String(), t.Null()])),
        address: t.String({ minLength: 1 }),
        city: t.String({ minLength: 1 }),
        state: t.String({ minLength: 1 }),
        country: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    }
  );
