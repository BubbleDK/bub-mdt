import permissions from "../../permissions.json";

export type PermissionKey = keyof typeof permissions;

export default permissions as Record<PermissionKey, number>;
