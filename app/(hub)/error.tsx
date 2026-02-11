'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import MainHeader from '@/components/shared/MainHeader'

export default function HubError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="space-y-6 max-w-md mx-auto reveal">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
            <p className="text-muted-foreground">
              We've encountered an unexpected error. Our team has been notified and we're working to fix it.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-background border border-border rounded-full font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
