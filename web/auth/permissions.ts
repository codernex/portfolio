import { PermissionsConfig } from "./types";

export const permissionsConfig: PermissionsConfig = {
  defaultRole: "guest",
  roles: {
    guest: {
      routes: [
        "/login",
        "/forgot-password",
        "/about",
        "/projects",
        "/blog",
        "/contact",
      ],
    },
    editor: {
      routes: ["*"],
      permissions: ["*"],
    },
    admin: {
      routes: ["*"],
      permissions: ["*"],
    },
  },
};
