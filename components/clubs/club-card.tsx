"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClubCardProps {
  club: any
  currentUserId: string
  isMember: boolean
}

export function ClubCard({ club, currentUserId, isMember }: ClubCardProps) {
  const [isJoined, setIsJoined] = useState(isMember)
  const [memberCount, setMemberCount] = useState(club.member_count || 0)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleJoinLeave = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (isJoined) {
        // Leave club
        await supabase.from("club_memberships").delete().eq("club_id", club.id).eq("user_id", currentUserId)

        setMemberCount((prev) => prev - 1)
        setIsJoined(false)
      } else {
        // Join club
        await supabase.from("club_memberships").insert({ club_id: club.id, user_id: currentUserId })

        setMemberCount((prev) => prev + 1)
        setIsJoined(true)
      }

      // Update club member count
      await supabase
        .from("clubs")
        .update({ member_count: isJoined ? memberCount - 1 : memberCount + 1 })
        .eq("id", club.id)
    } catch (error) {
      console.error("Error toggling membership:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg line-clamp-1">{club.name}</CardTitle>
            <Badge variant="secondary">{club.category}</Badge>
          </div>
          {club.image_url && <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{club.description || "No description available."}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Active</span>
          </div>
        </div>

        <Button
          onClick={handleJoinLeave}
          disabled={isLoading}
          variant={isJoined ? "outline" : "default"}
          className="w-full"
        >
          {isLoading ? "..." : isJoined ? "Leave Club" : "Join Club"}
        </Button>
      </CardContent>
    </Card>
  )
}
