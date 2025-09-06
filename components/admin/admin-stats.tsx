import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function AdminStats() {
  const supabase = await createClient()

  // Get platform statistics
  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalClubs },
    { count: totalProjects },
    { count: totalEvents },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("clubs").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      title: "Posts Created",
      value: totalPosts || 0,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
    },
    {
      title: "Active Clubs",
      value: totalClubs || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3%",
    },
    {
      title: "Projects",
      value: totalProjects || 0,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+15%",
    },
    {
      title: "Events",
      value: totalEvents || 0,
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "+5%",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
