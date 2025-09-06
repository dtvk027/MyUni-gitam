export type UserRole = "student" | "faculty" | "admin"

export interface Permission {
  resource: string
  action: string
}

// Define role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    { resource: "posts", action: "create" },
    { resource: "posts", action: "read" },
    { resource: "posts", action: "update_own" },
    { resource: "posts", action: "delete_own" },
    { resource: "clubs", action: "join" },
    { resource: "clubs", action: "leave" },
    { resource: "clubs", action: "read" },
    { resource: "projects", action: "create" },
    { resource: "projects", action: "join" },
    { resource: "projects", action: "read" },
    { resource: "events", action: "register" },
    { resource: "events", action: "read" },
    { resource: "profile", action: "update_own" },
  ],
  faculty: [
    // Faculty inherits all student permissions
    { resource: "posts", action: "create" },
    { resource: "posts", action: "read" },
    { resource: "posts", action: "update_own" },
    { resource: "posts", action: "delete_own" },
    { resource: "clubs", action: "join" },
    { resource: "clubs", action: "leave" },
    { resource: "clubs", action: "read" },
    { resource: "projects", action: "create" },
    { resource: "projects", action: "join" },
    { resource: "projects", action: "read" },
    { resource: "events", action: "register" },
    { resource: "events", action: "read" },
    { resource: "profile", action: "update_own" },
    { resource: "posts", action: "create_announcement" },
    { resource: "clubs", action: "create" },
    { resource: "clubs", action: "moderate" },
    { resource: "events", action: "create" },
    { resource: "events", action: "moderate" },
    { resource: "users", action: "view_students" },
  ],
  admin: [
    // Admin has all permissions
    { resource: "*", action: "*" },
    { resource: "users", action: "create" },
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "posts", action: "moderate" },
    { resource: "clubs", action: "manage" },
    { resource: "projects", action: "manage" },
    { resource: "events", action: "manage" },
    { resource: "system", action: "configure" },
  ],
}

export function hasPermission(userRole: UserRole, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []

  // Admin has all permissions
  if (userRole === "admin") {
    return true
  }

  // Check for specific permission
  return permissions.some(
    (permission) =>
      (permission.resource === resource || permission.resource === "*") &&
      (permission.action === action || permission.action === "*"),
  )
}

export function canAccessAdminPanel(userRole: UserRole): boolean {
  return userRole === "admin"
}

export function canModerateContent(userRole: UserRole): boolean {
  return userRole === "admin" || userRole === "faculty"
}

export function canCreateAnnouncements(userRole: UserRole): boolean {
  return userRole === "admin" || userRole === "faculty"
}
