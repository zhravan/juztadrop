import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import { authMiddleware } from '../middleware/auth.middleware';
import { CAUSE_VALUES } from '../constants/causes.js';

const userRepository = container.getRepositories().user;

const causeSchema = t.Array(t.String({ pattern: `^(${CAUSE_VALUES.join('|')})$` }));

export const usersRouter = new Elysia({ prefix: '/users', tags: ['users'] })
  .use(cookie())
  .use(authMiddleware)
  .patch(
    '/me',
    async (ctx: any) => {
      const { userId, body } = ctx;
      const updateData: {
        name?: string;
        phone?: string;
        gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
        volunteering?: {
          isInterest: boolean;
          skills: Array<{ name: string; expertise: string }>;
          causes: string[];
        };
      } = {};

      if (body.name !== undefined) updateData.name = body.name;
      if (body.phone !== undefined) updateData.phone = body.phone;
      if (body.gender !== undefined) updateData.gender = body.gender;
      if (body.volunteering !== undefined) updateData.volunteering = body.volunteering;

      const user = await userRepository.updateUser(userId, updateData);
      if (!user) {
        throw new Error('User not found after update');
      }
      return { user };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        gender: t.Optional(
          t.Union([
            t.Literal('male'),
            t.Literal('female'),
            t.Literal('other'),
            t.Literal('prefer_not_to_say'),
          ])
        ),
        volunteering: t.Optional(
          t.Object({
            isInterest: t.Boolean(),
            skills: t.Array(
              t.Object({
                name: t.String(),
                expertise: t.String(),
              })
            ),
            causes: causeSchema,
          })
        ),
      }),
    }
  );
