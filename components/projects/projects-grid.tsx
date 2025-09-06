import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "./project-card"

interface ProjectsGridProps {
  userId: string
}

export async function ProjectsGrid({ userId }: ProjectsGridProps) {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      profiles:created_by (
        full_name
      ),
      project_collaborators!left (
        user_id
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Projects ({projects?.length || 0})</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={userId}
              isCollaborator={project.project_collaborators?.some((c: any) => c.user_id === userId)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No projects found. Start your first project!</p>
          </div>
        )}
      </div>
    </div>
  )
}
