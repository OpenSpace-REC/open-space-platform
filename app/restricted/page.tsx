import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function RestrictedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <span className="font-bold text-4xl animate-pulse text-foreground">
          Open Space
        </span>
        <span className="text-xl text-muted-foreground">
          Access temporarily on hold
        </span>
        <span className="text-sm text-muted-foreground mt-2">
          Please check back later
        </span>
      </div>
    </div>
  )
}
