import { permissionsConfig } from './permissions';
import { PermissionKey } from './permissions.types';
import type { Role, RoutePattern } from './types';

export const AUTH_TOKEN_COOKIE = 'auth_token';
export const AUTH_SESSION_COOKIE = 'auth_session';

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function escapeRegex(input: string): string {
  return input.replace(/[|\\{}()[\]^$+*?.\/]/g, '\\$&');
}

export function routePatternToRegex(pattern: RoutePattern): RegExp {
  if (pattern === '*') {
    return /^.*$/;
  }

  let source = escapeRegex(pattern);

  // Support ** = any trailing path
  source = source.replace(/\\\/\\\*\\\*/g, '(?:\\/.*)?');

  // Support * = single path segment
  source = source.replace(/\\\*/g, '[^/]+');

  return new RegExp(`^${source}$`);
}

export function matchesRoute(pathname: string, pattern: RoutePattern): boolean {
  return routePatternToRegex(pattern).test(pathname);
}

export function resolveRoleHierarchy(role: Role): Role[] {
  const visited = new Set<Role>();
  const ordered: Role[] = [];

  const visit = (current: Role): void => {
    if (visited.has(current)) return;
    visited.add(current);

    const def = permissionsConfig.roles[current];
    for (const inherited of def?.inherits ?? []) {
      visit(inherited);
    }

    ordered.push(current);
  };

  visit(role);
  return ordered;
}

export function roleSatisfies(actualRole: Role, requiredRole: Role): boolean {
  return resolveRoleHierarchy(actualRole).includes(requiredRole);
}

export function resolveRolePermissions(role: Role): PermissionKey[] {
  const roles = resolveRoleHierarchy(role);
  const permissions = roles.flatMap(
    (r) => permissionsConfig.roles[r].permissions ?? []
  );
  return unique(permissions);
}

export function resolveRoleRoutes(role: Role): RoutePattern[] {
  const roles = resolveRoleHierarchy(role);
  const routes = roles.flatMap((r) => permissionsConfig.roles[r]?.routes ?? []);
  return unique(routes);
}

export function matchPermission(
  granted: PermissionKey,
  required: PermissionKey
): boolean {
  if (granted === '*' || granted === required) return true;

  const [grantedNs, grantedAction] = granted.split(':');
  const [requiredNs, requiredAction] = required.split(':');

  if (!grantedNs || !grantedAction || !requiredNs || !requiredAction) {
    return false;
  }

  if (grantedNs !== requiredNs) return false;
  if (grantedAction === '*') return true;

  return grantedAction === requiredAction;
}

export function hasPermissions(
  role: Role,
  requiredPermissions: PermissionKey[] = [],
  requireAll = true,
  extraPermissions: PermissionKey[] = []
): boolean {
  if (requiredPermissions.length === 0) return true;

  const granted = unique([
    ...resolveRolePermissions(role),
    ...extraPermissions,
  ]);

  if (requireAll) {
    return requiredPermissions.every((required) =>
      granted.some((g) => matchPermission(g, required))
    );
  }

  return requiredPermissions.some((required) =>
    granted.some((g) => matchPermission(g, required))
  );
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  const patterns = resolveRoleRoutes(role);
  return patterns.some((pattern) => matchesRoute(pathname, pattern));
}

export function isAuthorized(options: {
  role: Role;
  pathname?: string;
  requiredRole?: Role;
  requiredPermissions?: PermissionKey[];
  requireAll?: boolean;
  extraPermissions?: PermissionKey[];
}): boolean {
  const {
    role,
    pathname,
    requiredRole,
    requiredPermissions = [],
    requireAll = true,
    extraPermissions = [],
  } = options;

  if (requiredRole && !roleSatisfies(role, requiredRole)) {
    return false;
  }

  if (pathname && !canAccessRoute(role, pathname)) {
    return false;
  }

  if (
    requiredPermissions.length > 0 &&
    !hasPermissions(role, requiredPermissions, requireAll, extraPermissions)
  ) {
    return false;
  }

  return true;
}
