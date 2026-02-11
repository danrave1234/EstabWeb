'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

export default function Error({
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
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go back home
        </Link>
      </div>
    </div>
  )
}
