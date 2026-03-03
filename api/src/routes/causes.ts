import { Elysia, t } from 'elysia';
import { container } from '../container';
import { NotFoundError } from '../utils/errors.js';

const causeRepository = container.getRepositories().cause;

export const causesRouter = new Elysia({
  prefix: '/causes',
  tags: ['causes'],
})
  .get('/', async () => {
    const list = await causeRepository.findAll();
    return { causes: list };
  })
  .get('/:id', async ({ params }) => {
    const cause = await causeRepository.findById(params.id);
    if (!cause) throw new NotFoundError('Cause not found');
    return { cause };
  })
  .post(
    '/',
    async ({ body }) => {
      const created = await causeRepository.create({
        value: body.value,
        label: body.label,
        sortOrder: body.sortOrder,
      });
      return { cause: created };
    },
    {
      body: t.Object({
        value: t.String({ minLength: 1 }),
        label: t.String({ minLength: 1 }),
        sortOrder: t.Optional(t.Number()),
      }),
    }
  );
