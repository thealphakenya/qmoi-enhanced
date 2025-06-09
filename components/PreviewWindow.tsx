import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function PreviewWindow() {
  // Placeholder for live preview
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Preview Window</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-green-200">Live output or UI preview will be shown here.</div>
      </CardContent>
    </Card>
  )
}
