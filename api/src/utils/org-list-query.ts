import type {
  OrganizationListFilters,
  OrgVerificationStatus,
} from '../repositories/organization.repository.js';
import { ORG_VERIFICATION_STATUSES } from '../repositories/organization.repository.js';
import { parseBoolean, parseCauses, parseLimit, parseOffset } from './query-parsers.js';

export type OrgListQuery = {
  verificationStatus?: string;
  type?: string;
  causes?: string | string[];
  isCsrEligible?: string;
  isFcraRegistered?: string;
  limit?: string;
  offset?: string;
};

/**
 * Parses raw query params into OrganizationListFilters.
 * Pass overrides to force values (e.g. { verificationStatus: 'verified' } for public list).
 */
export function parseOrgListFilters(
  query: OrgListQuery,
  overrides?: Partial<OrganizationListFilters>
): OrganizationListFilters {
  const verificationStatus =
    overrides?.verificationStatus ??
    (query.verificationStatus &&
    ORG_VERIFICATION_STATUSES.includes(query.verificationStatus as OrgVerificationStatus)
      ? (query.verificationStatus as OrgVerificationStatus)
      : undefined);

  const base: OrganizationListFilters = {
    verificationStatus,
    type: query.type?.trim() || undefined,
    causes: parseCauses(query.causes),
    isCsrEligible: parseBoolean(query.isCsrEligible),
    isFcraRegistered: parseBoolean(query.isFcraRegistered),
    limit: parseLimit(query.limit),
    offset: parseOffset(query.offset),
  };

  return { ...base, ...overrides };
}
