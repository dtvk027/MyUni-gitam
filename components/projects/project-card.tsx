"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Github, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: any
  currentUserId: string
  isCollaborator: boolean
}

export function ProjectCard({ project, currentUserId, isCollaborator }: ProjectCardProps) {
  const [isJoined, setIsJoined] = useState(isCollaborator)
  const [teamSize, setTeamSize] = useState(project.team_size || 1)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleJoinLeave = async () => {
    if (isLoading || project.created_by === currentUserId) return
    setIsLoading(true)

    try {
      if (isJoined) {
        // Leave project
        await supabase.from("project_collaborators").delete().eq("project_id", project.id).eq("user_id", currentUserId)

        setTeamSize((prev) => prev - 1)
        setIsJoined(false)
      } else {
        // Join project
        await supabase.from("project_collaborators").insert({ project_id: project.id, user_id: currentUserId })

        setTeamSize((prev) => prev + 1)
        setIsJoined(true)
      }

      // Update project team size
      await supabase
        .from("projects")
        .update({ team_size: isJoined ? teamSize - 1 : teamSize + 1 })
        .eq("id", project.id)
    } catch (error) {
      console.error("Error toggling collaboration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{project.category}</Badge>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{project.description || "No description available."}</p>

        {project.required_skills && project.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.required_skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.required_skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.required_skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{teamSize} members</span>
          </div>
          <div className="flex items-center space-x-2">
            {project.github_url && <Github className="w-4 h-4" />}
            {project.demo_url && <ExternalLink className="w-4 h-4" />}
          </div>
        </div>

        {project.created_by !== currentUserId && (
          <Button
            onClick={handleJoinLeave}
            disabled={isLoading}
            variant={isJoined ? "outline" : "default"}
            className="w-full"
          >
            {isLoading ? "..." : isJoined ? "Leave Project" : "Join Project"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
