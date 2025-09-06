"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { type UserRole, hasPermission } from "@/lib/auth/permissions"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: { resource: string; action: string }
  fallback?: React.ReactNode
  redirectTo?: string
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkPermissions() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (!profile) {
          router.push("/auth/login")
          return
        }

        const userRole = profile.role as UserRole

        // Check role requirement
        if (requiredRole) {
          const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
          if (!allowedRoles.includes(userRole)) {
            setIsAuthorized(false)
            setIsLoading(false)
            return
          }
        }

        // Check permission requirement
        if (requiredPermission) {
          const hasRequiredPermission = hasPermission(userRole, requiredPermission.resource, requiredPermission.action)
          if (!hasRequiredPermission) {
            setIsAuthorized(false)
            setIsLoading(false)
            return
          }
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Error checking permissions:", error)
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissions()
  }, [requiredRole, requiredPermission, router, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }

    router.push(redirectTo)
    return null
  }

  return <>{children}</>
}
