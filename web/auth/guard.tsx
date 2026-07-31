import { getServerAuth } from './actions';
import { hasPermissions, roleSatisfies } from './config';
import { ClientAuthGuard } from './guard.client';
import type { GuardProps } from './types';

/**
 * Server-first guard:
 * - Reads the signed HTTP-only session cookie in RSC.
 * - Prevents flash of unauthenticated/unauthorized content.
 * - Hydrates the client store via ClientAuthGuard for continued client-side checks.
 */
export async function AuthGuard({
  children,
  fallback = null,
  requiredRole,
  requiredPermissions = [],
  requireAll = true,
}: GuardProps) {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requiredRole && !roleSatisfies(auth.role, requiredRole)) {
    return <>{fallback}</>;
  }

  if (
    requiredPermissions.length > 0 &&
    !hasPermissions(
      auth.role,
      requiredPermissions,
      requireAll,
      auth.permissions
    )
  ) {
    return <>{fallback}</>;
  }

  return (
    <ClientAuthGuard
      initialAuth={auth}
      fallback={fallback}
      requiredRole={requiredRole}
      requiredPermissions={requiredPermissions}
      requireAll={requireAll}
    >
      {children}
    </ClientAuthGuard>
  );
}
