import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClubsHeader } from "@/components/clubs/clubs-header"
import { ClubsGrid } from "@/components/clubs/clubs-grid"
import { ClubsFilters } from "@/components/clubs/clubs-filters"

export default async function ClubsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClubsHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64">
            <ClubsFilters />
          </aside>
          <div className="flex-1">
            <ClubsGrid userId={data.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
