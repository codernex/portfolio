import { redirect } from 'next/navigation';
import { getServerAuth } from './actions';
import { hasPermissions, roleSatisfies } from './config';
import { ClientAuthGuard } from './guard.client';
import type { GuardProps } from './types';

/**
 * Server-first guard:
 * - Reads the session snapshot in RSC.
 * - Prevents flash of unauthenticated/unauthorized content.
 * - Hydrates the client store via ClientAuthGuard for continued client-side checks.
 */
export async function AuthGuard({
  children,
  fallback,
  requiredRole,
  requiredPermissions = [],
  requireAll = true,
}: GuardProps) {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    if (fallback !== undefined) return <>{fallback}</>;
    redirect('/login');
  }

  if (requiredRole && !roleSatisfies(auth.role, requiredRole)) {
    if (fallback !== undefined) return <>{fallback}</>;
    redirect('/login');
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
    if (fallback !== undefined) return <>{fallback}</>;
    redirect('/login');
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
