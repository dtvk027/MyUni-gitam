import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield, BarChart3, Settings, AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600",
    },
    {
      title: "Content Moderation",
      description: "Review flagged content",
      icon: Shield,
      href: "/admin/content",
      color: "text-red-600",
    },
    {
      title: "Analytics",
      description: "View platform analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-green-600",
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-purple-600",
    },
    {
      title: "Create Announcement",
      description: "Post campus-wide announcement",
      icon: Plus,
      href: "/admin/announcements/create",
      color: "text-orange-600",
    },
    {
      title: "Reports",
      description: "View user reports and issues",
      icon: AlertTriangle,
      href: "/admin/reports",
      color: "text-yellow-600",
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
