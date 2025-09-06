"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: any
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.post_likes?.some((like: any) => like.user_id === currentUserId) || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (isLiked) {
        // Unlike
        await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)

        setLikesCount((prev) => prev - 1)
        setIsLiked(false)
      } else {
        // Like
        await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUserId })

        setLikesCount((prev) => prev + 1)
        setIsLiked(true)
      }

      // Update the post's likes count
      await supabase
        .from("posts")
        .update({ likes_count: isLiked ? likesCount - 1 : likesCount + 1 })
        .eq("id", post.id)
    } catch (error) {
      console.error("Error toggling like:", error)
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
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{getInitials(post.profiles?.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900">{post.profiles?.full_name || "Anonymous"}</p>
              {post.profiles?.role === "faculty" && (
                <Badge variant="secondary" className="text-xs">
                  Faculty
                </Badge>
              )}
              {post.is_announcement && <Badge className="text-xs bg-blue-100 text-blue-800">Announcement</Badge>}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {post.profiles?.department && <span>{post.profiles.department}</span>}
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-900 whitespace-pre-wrap mb-4">{post.content}</p>

        <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-2 ${isLiked ? "text-red-600" : "text-gray-500"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments_count || 0}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
