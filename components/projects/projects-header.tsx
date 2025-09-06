import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export function ProjectsHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Academic Projects</h1>
          </div>
          <Button asChild>
            <Link href="/projects/create">
              <Plus className="w-4 h-4 mr-2" />
              Start Project
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
