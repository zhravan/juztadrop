import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import {
  verifyXAuthHeaderMiddleware,
  moderatorMiddleware,
} from '@/middleware/moderator.middleware';
import type { AdminUserListFilters } from '@/repositories/user.repository';
import { NotFoundError } from '@/utils/errors';
import {
  parseBoolean,
  parseCauses,
  parseLimit,
  parseOffset,
  parseStringArray,
} from '@/utils/query-parsers';
import { parseOrgListFilters } from '@/utils/org-list-query';

const moderatorController = container.getControllers().moderator;
const userRepository = container.getRepositories().user;
const organizationRepository = container.getRepositories().organization;
const applicationRepository = container.getRepositories().application;
const organizationVerificationService = container.getServices().organizationVerification;

const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'] as const;

function parseGenders(value: string | string[] | undefined): AdminUserListFilters['genders'] {
  const arr = parseStringArray(value);
  if (!arr) return undefined;
  type Gender = (typeof GENDER_VALUES)[number];
  const valid = arr.filter((g): g is Gender => GENDER_VALUES.includes(g as Gender));
  return valid.length > 0 ? valid : undefined;
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
        limit: parseLimit(query.limit),
        offset: parseOffset(query.offset),
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
      const { action, reason, name } = body;
      const banned = action === 'ban';
      if (!name || (typeof name === 'string' && name.trim() === '')) {
        return new Response(
          JSON.stringify({ error: 'Name (who performed the action) is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (
        banned &&
        (reason === undefined || (typeof reason === 'string' && reason.trim() === ''))
      ) {
        return new Response(JSON.stringify({ error: 'Reason is required when banning a user' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const user = await userRepository.setBanStatus(
        userId,
        banned,
        reason?.trim() || undefined,
        name.trim()
      );
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
        name: t.String(),
      }),
    }
  )
  .get(
    '/organizations/:orgId/applications',
    async ({ params }) => {
      const org = await organizationRepository.findById(params.orgId);
      if (!org) throw new NotFoundError('Organization not found');
      const applications = await applicationRepository.findByOrganizationId(params.orgId);
      return { applications };
    },
    { params: t.Object({ orgId: t.String() }) }
  )
  .get(
    '/organizations/:orgId/verification-history',
    async ({ params }) => {
      const history = await organizationVerificationService.getHistory(params.orgId);
      return { history };
    },
    { params: t.Object({ orgId: t.String() }) }
  )
  .patch(
    '/organizations/:orgId/verification',
    async ({ params, body, moderatorId, userId }) => {
      const user = await userRepository.findById(userId);
      const moderatorName = user?.name?.trim() || user?.email || 'Moderator';
      const result = await organizationVerificationService.applyAction({
        organizationId: params.orgId,
        moderatorId,
        moderatorName,
        action: body.action,
        description: body.description ?? null,
        metadata: body.metadata ?? null,
      });
      return {
        organization: result.organization,
        historyEntry: result.historyEntry,
      };
    },
    {
      params: t.Object({ orgId: t.String() }),
      body: t.Object({
        action: t.Union([
          t.Literal('request_for_change'),
          t.Literal('verified'),
          t.Literal('rejected'),
          t.Literal('suspended'),
          t.Literal('reinstate'),
        ]),
        description: t.Optional(t.String()),
        metadata: t.Optional(t.Record(t.String(), t.Unknown())),
      }),
    }
  )
  .get(
    '/organizations/:orgId',
    async ({ params }) => {
      const org = await organizationRepository.findById(params.orgId);
      if (!org) throw new NotFoundError('Organization not found');
      return { organization: org };
    },
    { params: t.Object({ orgId: t.String() }) }
  )
  .get(
    '/organizations',
    async ({ query }) => {
      const filters = parseOrgListFilters(query);
      const result = await organizationRepository.findManyWithFilters(filters);
      return { organizations: result.items, total: result.total };
    },
    {
      query: t.Object({
        verificationStatus: t.Optional(t.String()),
        type: t.Optional(t.String()),
        causes: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        isCsrEligible: t.Optional(t.String()),
        isFcraRegistered: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  );
