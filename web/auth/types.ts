import { PermissionKey } from "./permissions.types";

export const ROLES = ["guest", "admin", "editor"] as const;

export type Role = (typeof ROLES)[number];
export type RoutePattern = "*" | `/${string}`;

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthProfileImage {
  fileName: string;
  url: string;
  size: number;
}

export interface RawAuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    nickname?: string | null;
    username?: string | null;
    name: string;
    role: Role;
    createdAt?: string;
    updatedAt?: string;
    avatarUrl?: string | null;
    profileImage?: AuthProfileImage | null;
  };
  permissions?: PermissionKey[];
}

export interface BackendAuthResponse {
  token: string;
  expiresAt?: string;
  user: AuthUser;
  permissions?: PermissionKey[];
}

export interface SessionPayload {
  user: AuthUser;
  permissions: PermissionKey[];
  expiresAt?: string;
}

export interface AuthSnapshot {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: Role;
  permissions: PermissionKey[];
  expiresAt?: string;
}

export interface GuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requiredPermissions?: PermissionKey[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export interface RoleDefinition {
  inherits?: Role[];
  routes?: RoutePattern[];
  permissions?: PermissionKey[];
}

export interface PermissionsConfig {
  defaultRole: Role;
  roles: Record<Role, RoleDefinition>;
}
