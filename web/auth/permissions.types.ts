export type PermissionNamespace = 'button' | 'api' | 'feature';

export type FeaturePermission =
  | 'dashboard'
  | 'team-overview'
  | 'user-management'
  | 'invite-admin'
  | 'configure-pipeline'
  | 'embassy-dropdown';

export type ButtonPermission = 'read' | 'approve' | 'delete' | 'update';

export type ApiPermission = 'me' | 'export' | 'admin:*';

export type PermissionKey =
  | '*'
  | `${PermissionNamespace}:*`
  | `feature:${FeaturePermission}`
  | `button:${ButtonPermission}`
  | `api:${ApiPermission}`;
