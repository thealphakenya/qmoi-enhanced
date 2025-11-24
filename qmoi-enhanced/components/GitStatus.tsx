import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function GitStatus() {
  const [branch, setBranch] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [remote, setRemote] = useState<string>("")

  useEffect(() => {
    async function fetchGitInfo() {
      try {
        const branchRes = await fetch("/api/git/branch")
        const branchText = await branchRes.text()
        setBranch(branchText.trim())
        const statusRes = await fetch("/api/git/status")
        const statusText = await statusRes.text()
        setStatus(statusText.trim())
        const remoteRes = await fetch("/api/git/remote")
        const remoteText = await remoteRes.text()
        setRemote(remoteText.trim())
      } catch (e) {
        setStatus("Git info unavailable")
      }
    }
    fetchGitInfo()
  }, [])

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Git & SSH Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-green-200">
          <div><b>Branch:</b> {branch || "-"}</div>
          <div><b>Status:</b> <pre className="inline whitespace-pre-wrap">{status || "-"}</pre></div>
          <div><b>Remote:</b> {remote || "-"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
