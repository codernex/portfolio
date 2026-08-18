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
      inherits: ["guest"],
      routes: ["*"],
      permissions: ["*"],
    },
    admin: {
      inherits: ["editor"],
      routes: ["*"],
      permissions: ["*"],
    },
  },
};
