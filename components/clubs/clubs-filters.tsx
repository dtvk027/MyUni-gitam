import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ClubsFilters() {
  const categories = [
    "Academic",
    "Sports",
    "Cultural",
    "Technical",
    "Social Service",
    "Arts",
    "Music",
    "Dance",
    "Drama",
    "Photography",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Clubs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-gray-100">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
