'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background rounded-3xl border border-border shadow-sm m-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Admin Panel Error</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        An error occurred while processing your request in the admin panel. 
        The details have been logged.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Operation
        </button>
        <Link
          href="/admin/dashboard"
          className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          Admin Home
        </Link>
      </div>
    </div>
  )
}
