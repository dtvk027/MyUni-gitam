"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { canCreateAnnouncements } from "@/lib/auth/permissions"

interface CreatePostProps {
  user: any
  profile: any
}

export function CreatePost({ user, profile }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const canMakeAnnouncements = canCreateAnnouncements(profile?.role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("posts").insert({
        content: content.trim(),
        author_id: user.id,
        is_announcement: isAnnouncement && canMakeAnnouncements,
        department: profile?.department,
      })

      if (error) throw error

      setContent("")
      setIsAnnouncement(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
          <span>Share something with your community</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          {canMakeAnnouncements && (
            <div className="flex items-center space-x-2">
              <Switch id="announcement" checked={isAnnouncement} onCheckedChange={setIsAnnouncement} />
              <Label htmlFor="announcement" className="text-sm">
                Post as announcement
              </Label>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim() || isLoading}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
