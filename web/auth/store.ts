'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';

import { clearAuthSession, persistAuthSession } from './actions';
import { hasPermissions, roleSatisfies } from './config';
import type { AuthSnapshot, BackendAuthResponse, RawAuthResponse, Role } from './types';
import { PermissionKey } from './permissions.types';
import { apiInstance } from '@/lib/axios';

const AUTH_META_COOKIE = 'auth_meta';

type AuthStatus = 'idle' | 'authenticated' | 'anonymous';

interface AuthStore extends AuthSnapshot {
  status: AuthStatus;
  bootstrap: (snapshot?: AuthSnapshot | null) => void;
  login: (payload: BackendAuthResponse | RawAuthResponse, redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  can: (
    permission: PermissionKey | PermissionKey[],
    options?: { requireAll?: boolean }
  ) => boolean;
  hasRole: (role: Role) => boolean;
}

function writeMetaCookie(snapshot: AuthSnapshot): void {
  if (!snapshot.isAuthenticated || !snapshot.user) {
    Cookies.remove(AUTH_META_COOKIE);
    return;
  }

  Cookies.set(
    AUTH_META_COOKIE,
    JSON.stringify({
      user: {
        id: snapshot.user.id,
        email: snapshot.user.email,
        name: snapshot.user.name,
        role: snapshot.user.role,
        avatarUrl: snapshot.user.avatarUrl,
      },
      permissions: snapshot.permissions,
      expiresAt: snapshot.expiresAt,
    }),
    {
      sameSite: 'lax',
      expires: 7,
    }
  );
}

function readMetaCookie(): AuthSnapshot | null {
  const raw = Cookies.get(AUTH_META_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Omit<
      AuthSnapshot,
      'isAuthenticated' | 'role'
    > & {
      user: NonNullable<AuthSnapshot['user']>;
    };

    return {
      isAuthenticated: true,
      user: parsed.user,
      role: parsed.user.role,
      permissions: parsed.permissions ?? [],
      expiresAt: parsed.expiresAt,
    };
  } catch {
    Cookies.remove(AUTH_META_COOKIE);
    return null;
  }
}

const anonymousState: Pick<
  AuthStore,
  'isAuthenticated' | 'user' | 'role' | 'permissions' | 'expiresAt' | 'status'
> = {
  isAuthenticated: false,
  user: null,
  role: 'guest',
  permissions: [],
  expiresAt: undefined,
  status: 'anonymous',
};

export const useAuth = create<AuthStore>((set, get) => ({
  ...anonymousState,
  status: 'idle',

  bootstrap(snapshot) {
    const resolved = snapshot ?? readMetaCookie();

    if (!resolved) {
      apiInstance.setToken(null);
      set({ ...anonymousState });
      return;
    }

    writeMetaCookie(resolved);

    set({
      ...resolved,
      status: resolved.isAuthenticated ? 'authenticated' : 'anonymous',
    });
  },

  async login(payload, redirectTo = '/') {
    // Map RawAuthResponse (real API response) to BackendAuthResponse if necessary
    const mappedPayload: BackendAuthResponse = ('accessToken' in payload) 
      ? {
          token: payload.accessToken,
          expiresAt: new Date(Date.now() + payload.expiresIn).toISOString(),
          user: {
            id: payload.user.id,
            email: payload.user.email,
            name: payload.user.name,
            role: payload.user.role,
            avatarUrl: payload.user.avatarUrl || payload.user.profileImage?.url,
          },
          permissions: payload.permissions,
        }
      : payload;

    const optimisticSnapshot: AuthSnapshot = {
      isAuthenticated: true,
      user: mappedPayload.user,
      role: mappedPayload.user.role,
      permissions: mappedPayload.permissions ?? [],
      expiresAt: mappedPayload.expiresAt,
    };

    // immediate browser-side header sync
    apiInstance.setToken(mappedPayload.token);

    writeMetaCookie(optimisticSnapshot);

    set({
      ...optimisticSnapshot,
      status: 'authenticated',
    });

    await persistAuthSession(mappedPayload, redirectTo);
  },

  async logout(redirectTo = '/login') {
    apiInstance.setToken(null);
    Cookies.remove(AUTH_META_COOKIE);

    set({
      ...anonymousState,
    });

    await clearAuthSession(redirectTo);
  },

  can(permission, options) {
    const { role, permissions } = get();
    const required = Array.isArray(permission) ? permission : [permission];

    return hasPermissions(
      role,
      required,
      options?.requireAll ?? true,
      permissions
    );
  },

  hasRole(role) {
    return roleSatisfies(get().role, role);
  },
}));
