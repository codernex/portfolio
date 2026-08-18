'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { hasPermissions, roleSatisfies } from './config';
import { useAuth } from './store';
import type { AuthSnapshot, GuardProps } from './types';

interface ClientAuthGuardProps extends GuardProps {
  initialAuth?: AuthSnapshot;
}

export function ClientAuthGuard({
  children,
  fallback,
  requiredRole,
  requiredPermissions = [],
  requireAll = true,
  initialAuth,
}: ClientAuthGuardProps) {
  const auth = useAuth();
  const router = useRouter();

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

  useEffect(() => {
    if (auth.status !== 'idle' && !allowed && fallback === undefined) {
      router.push('/login');
    }
  }, [allowed, auth.status, fallback, router]);

  // If used entirely client-side without initialAuth, prevent flashing either UI until bootstrap resolves.
  if (auth.status === 'idle' && !initialAuth) {
    return null;
  }

  if (!allowed) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-mono text-xs text-zinc-500">
        Authenticating session...
      </div>
    );
  }

  return <>{children}</>;
}
