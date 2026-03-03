/**
 * API proxy handlers. Used by app/api route.ts files.
 * Logic lives here; route files only delegate.
 */

export { authOtpSend, authOtpVerify, authMe, authLogout } from './handlers/auth';
export { usersMePatch } from './handlers/users';
export {
  organizationsPost,
  organizationsGet,
  organizationGet,
  organizationPatch,
} from './handlers/organizations';
export { organizationTypesGet } from './handlers/organization-types';
export { causesGet, causePost } from './handlers/causes';
export {
  opportunitiesGet,
  opportunitiesPost,
  opportunityGet,
  opportunityPatch,
  opportunityDelete,
  opportunityApply,
  opportunityFeedback,
  opportunityApplicationsGet,
  opportunityAttendeesGet,
  opportunityVolunteerFeedback,
} from './handlers/opportunities';
export { applicationsMeGet, applicationPatch } from './handlers/applications';
export { volunteersGet } from './handlers/volunteers';
export { storagePost } from './handlers/storage';
export { proxyStatusGet, sessionCheckGet } from './handlers/diagnostics';
