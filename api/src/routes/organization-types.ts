import { Elysia, t } from 'elysia';
import { container } from '../container';
import { NotFoundError } from '../utils/errors.js';

const organizationTypeRepository = container.getRepositories().organizationType;

export const organizationTypesRouter = new Elysia({
  prefix: '/organization-types',
  tags: ['organization-types'],
})
  .get('/', async () => {
    const types = await organizationTypeRepository.findAll();
    return { organizationTypes: types };
  })
  .get('/:id', async ({ params }) => {
    const type = await organizationTypeRepository.findById(params.id);
    if (!type) throw new NotFoundError('Organization type not found');
    return { organizationType: type };
  })
  .post(
    '/',
    async ({ body }) => {
      const created = await organizationTypeRepository.create({
        name: body.name,
        label: body.label,
        sortOrder: body.sortOrder,
      });
      return { organizationType: created };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        label: t.String({ minLength: 1 }),
        sortOrder: t.Optional(t.Number()),
      }),
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const updated = await organizationTypeRepository.update(params.id, {
        name: body.name,
        label: body.label,
        sortOrder: body.sortOrder,
      });
      if (!updated) throw new NotFoundError('Organization type not found');
      return { organizationType: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1 })),
        label: t.Optional(t.String({ minLength: 1 })),
        sortOrder: t.Optional(t.Number()),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await organizationTypeRepository.delete(params.id);
      if (!deleted) throw new NotFoundError('Organization type not found');
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
