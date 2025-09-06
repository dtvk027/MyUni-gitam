import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Create Post",
      description: "Share something with your community",
      icon: Plus,
      href: "/feed/create",
      color: "text-blue-600",
    },
    {
      title: "Join Club",
      description: "Find and join student clubs",
      icon: Users,
      href: "/clubs",
      color: "text-green-600",
    },
    {
      title: "Start Project",
      description: "Begin a new academic project",
      icon: BookOpen,
      href: "/projects/create",
      color: "text-purple-600",
    },
    {
      title: "Browse Events",
      description: "Discover upcoming campus events",
      icon: Calendar,
      href: "/events",
      color: "text-orange-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button key={action.title} variant="ghost" className="w-full justify-start h-auto p-3" asChild>
            <Link href={action.href}>
              <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
