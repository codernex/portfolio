'use client';

import { useEffect, useMemo } from 'react';

import { hasPermissions, roleSatisfies } from './config';
import { useAuth } from './store';
import type { AuthSnapshot, GuardProps } from './types';

interface ClientAuthGuardProps extends GuardProps {
  initialAuth?: AuthSnapshot;
}

export function ClientAuthGuard({
  children,
  fallback = null,
  requiredRole,
  requiredPermissions = [],
  requireAll = true,
  initialAuth,
}: ClientAuthGuardProps) {
  const auth = useAuth();

  const { bootstrap, status } = auth;
  const initialAuthKey = initialAuth ? JSON.stringify(initialAuth) : 'none';

  useEffect(() => {
    if (initialAuth) {
      bootstrap(initialAuth);
    } else if (status === 'idle') {
      bootstrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAuthKey]);

  const allowed = useMemo(() => {
    // If the store is idle but we received server validation, trust the server state immediately.
    const currentAuth =
      auth.status === 'idle' && initialAuth ? initialAuth : auth;

    if (!currentAuth.isAuthenticated) {
      return false;
    }

    if (requiredRole && !roleSatisfies(currentAuth.role, requiredRole)) {
      return false;
    }

    if (
      requiredPermissions.length > 0 &&
      !hasPermissions(
        currentAuth.role,
        requiredPermissions,
        requireAll,
        currentAuth.permissions
      )
    ) {
      return false;
    }

    return true;
  }, [auth, initialAuth, requireAll, requiredPermissions, requiredRole]);

  // If used entirely client-side without initialAuth, prevent flashing either UI until bootstrap resolves.
  if (auth.status === 'idle' && !initialAuth) {
    return null;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
