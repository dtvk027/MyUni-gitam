import { requireRole } from "@/lib/auth/role-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { UsersTable } from "@/components/admin/users-table"
import { UsersStats } from "@/components/admin/users-stats"

export default async function AdminUsersPage() {
  const { user, profile } = await requireRole("admin")

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader profile={profile} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>

        <UsersStats />
        <UsersTable />
      </main>
    </div>
  )
}
