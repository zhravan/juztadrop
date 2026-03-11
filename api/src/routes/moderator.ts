import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import {
  verifyXAuthHeaderMiddleware,
  moderatorMiddleware,
} from '@/middleware/moderator.middleware';
import type { AdminUserListFilters } from '@/repositories/user.repository';
import { CAUSE_VALUES } from '@/constants/causes';

const moderatorController = container.getControllers().moderator;
const userRepository = container.getRepositories().user;

const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'] as const;

function parseStringArray(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  const arr = Array.isArray(value)
    ? value
    : value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  return arr.length > 0 ? arr : undefined;
}

function parseGenders(value: string | string[] | undefined): AdminUserListFilters['genders'] {
  const arr = parseStringArray(value);
  if (!arr) return undefined;
  const valid = arr.filter((g) => GENDER_VALUES.includes(g as (typeof GENDER_VALUES)[number]));
  return valid.length > 0 ? (valid as (typeof GENDER_VALUES)[]) : undefined;
}

function parseCauses(value: string | string[] | undefined): string[] | undefined {
  const arr = parseStringArray(value);
  if (!arr) return undefined;
  const valid = arr.filter((c) => CAUSE_VALUES.includes(c as (typeof CAUSE_VALUES)[number]));
  return valid.length > 0 ? valid : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export const moderatorRouter = new Elysia({ prefix: '/moderator', tags: ['moderator'] })
  .use(verifyXAuthHeaderMiddleware)
  .post(
    '/seed',
    async ({ xAuthId, body }) => {
      const result = await moderatorController.moderatorSeed(xAuthId, body);
      return result;
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    }
  )
  .use(cookie())
  .use(moderatorMiddleware)
  .get(
    '/users',
    async ({ query }) => {
      const filters: AdminUserListFilters = {
        genders: parseGenders(query.genders),
        isBanned: parseBoolean(query.banned),
        volunteeringInterests: parseCauses(query.volunteeringInterests),
        isActive: parseBoolean(query.active),
        limit: query.limit
          ? Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20))
          : 20,
        offset: query.offset ? Math.max(0, parseInt(String(query.offset), 10) || 0) : 0,
      };
      const result = await userRepository.findAllWithFilters(filters);
      return { users: result.items, total: result.total };
    },
    {
      query: t.Object({
        genders: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        banned: t.Optional(t.String()),
        volunteeringInterests: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        active: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  )
  .patch(
    '/users/:userId/ban',
    async ({ params, body }) => {
      const { userId } = params;
      const { action, reason } = body;
      const banned = action === 'ban';
      if (
        banned &&
        (reason === undefined || (typeof reason === 'string' && reason.trim() === ''))
      ) {
        return new Response(JSON.stringify({ error: 'Reason is required when banning a user' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const user = await userRepository.setBanStatus(userId, banned, reason?.trim() || undefined);
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return { user };
    },
    {
      params: t.Object({ userId: t.String() }),
      body: t.Object({
        action: t.Union([t.Literal('ban'), t.Literal('unban')]),
        reason: t.Optional(t.String()),
      }),
    }
  );
