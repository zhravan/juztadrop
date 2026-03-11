import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';

const userService = container.getServices().user;

export const volunteersRouter = new Elysia({ prefix: '/volunteers', tags: ['volunteers'] })
  .use(cookie())
  .get(
    '/users/:userId',
    async ({ params }) => {
      const user = await userService.getVolunteerById(params.userId);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Volunteer not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return { user };
    },
    {
      params: t.Object({ userId: t.String() }),
    }
  )
  .get(
    '/',
    async ({ query }) => {
      const { causes, skills, limit, offset } = query;
      const filters = {
        causes: causes ? (Array.isArray(causes) ? causes : [causes]) : undefined,
        skills: skills ? (Array.isArray(skills) ? skills : [skills]) : undefined,
        limit: limit ? parseInt(String(limit), 10) : 20,
        offset: offset ? parseInt(String(offset), 10) : 0,
      };
      const result = await userService.getVolunteers(filters);
      return { volunteers: result.items, total: result.total };
    },
    {
      query: t.Object({
        causes: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        skills: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  );
