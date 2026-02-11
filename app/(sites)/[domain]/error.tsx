'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We're having trouble loading this site right now. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
      >
        Reload Site
      </button>
    </div>
  )
}
