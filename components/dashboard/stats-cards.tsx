import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface StatsCardsProps {
  userId: string
}

export async function StatsCards({ userId }: StatsCardsProps) {
  const supabase = await createClient()

  try {
    const [{ count: clubsCount }, { count: projectsCount }, { count: eventsCount }, { count: postsCount }] =
      await Promise.all([
        supabase.from("club_memberships").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("project_collaborators").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("event_attendees").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", userId),
      ])

    const stats = [
      {
        title: "Clubs Joined",
        value: clubsCount || 0,
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Active Projects",
        value: projectsCount || 0,
        icon: BookOpen,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Events Attended",
        value: eventsCount || 0,
        icon: Calendar,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: "Posts Created",
        value: postsCount || 0,
        icon: Trophy,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    ]

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error loading stats:", error)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Clubs Joined", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Active Projects", icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100" },
          { title: "Events Attended", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100" },
          { title: "Posts Created", icon: Trophy, color: "text-orange-600", bgColor: "bg-orange-100" },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
