import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectsHeader />

      <main className="container mx-auto px-4 py-6">
        <ProjectsGrid userId={data.user.id} />
      </main>
    </div>
  )
}
