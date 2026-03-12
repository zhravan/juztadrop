import type { Organization } from '../repositories/organization.repository';
import type { OrgVerificationStatus } from '../repositories/organization.repository';
import type {
  OrgVerificationAction,
  VerificationHistoryEntry,
} from '../repositories/organization-verification-history.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationVerificationHistoryRepository } from '../repositories/organization-verification-history.repository';
import { ValidationError, NotFoundError } from '../utils/errors';

/** Allowed transitions: fromStatus -> [actions that are valid]. request_for_change leaves status unchanged (so request_for_change -> request_for_change is allowed; each adds a history entry). */
const ALLOWED_TRANSITIONS: Record<OrgVerificationStatus, OrgVerificationAction[]> = {
  pending: ['verified', 'request_for_change', 'rejected', 'suspended'],
  verified: ['suspended'],
  suspended: ['reinstate'],
  rejected: [], // Terminal: no further actions
};

const ACTION_TO_STATUS: Record<
  Exclude<OrgVerificationAction, 'request_for_change'>,
  OrgVerificationStatus
> = {
  verified: 'verified',
  rejected: 'rejected',
  suspended: 'suspended',
  reinstate: 'verified',
};

const ACTIONS_REQUIRING_DESCRIPTION: OrgVerificationAction[] = ['rejected', 'suspended'];

export interface ApplyVerificationActionInput {
  organizationId: string;
  moderatorId: string;
  moderatorName: string;
  action: OrgVerificationAction;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ApplyVerificationActionResult {
  organization: Organization;
  historyEntry: VerificationHistoryEntry;
}

export class OrganizationVerificationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly historyRepository: OrganizationVerificationHistoryRepository
  ) {}

  async applyAction(input: ApplyVerificationActionInput): Promise<ApplyVerificationActionResult> {
    const org = await this.organizationRepository.findById(input.organizationId);
    if (!org) throw new NotFoundError('Organization not found');

    const currentStatus = org.verificationStatus as OrgVerificationStatus;
    const allowed = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowed?.includes(input.action)) {
      if (currentStatus === 'rejected') {
        throw new ValidationError(
          'Organization is rejected; no further actions allowed. A fresh request is required.'
        );
      }
      throw new ValidationError(
        `Action '${input.action}' is not allowed for organization with status '${currentStatus}'.`
      );
    }

    const fromStatus = currentStatus;
    let toStatus: OrgVerificationStatus =
      input.action === 'request_for_change' ? currentStatus : ACTION_TO_STATUS[input.action];

    const description = input.description?.trim() || null;
    if (ACTIONS_REQUIRING_DESCRIPTION.includes(input.action) && !description) {
      throw new ValidationError(`Description is required for action '${input.action}'.`);
    }

    let updatedOrg: Organization;
    if (input.action === 'request_for_change') {
      updatedOrg = org;
    } else {
      const verifiedAt = toStatus === 'verified' ? new Date() : null;
      const result = await this.organizationRepository.updateVerificationStatus(
        input.organizationId,
        toStatus,
        verifiedAt
      );
      if (!result) throw new Error('Organization not found after update');
      updatedOrg = result;
    }

    const historyEntry = await this.historyRepository.create({
      organizationId: input.organizationId,
      action: input.action,
      fromStatus,
      toStatus,
      description,
      moderatorId: input.moderatorId,
      moderatorName: input.moderatorName,
      metadata: input.metadata ?? null,
    });

    return { organization: updatedOrg, historyEntry };
  }

  async getHistory(organizationId: string): Promise<VerificationHistoryEntry[]> {
    const org = await this.organizationRepository.findById(organizationId);
    if (!org) throw new NotFoundError('Organization not found');
    return this.historyRepository.findByOrganizationId(organizationId);
  }
}
