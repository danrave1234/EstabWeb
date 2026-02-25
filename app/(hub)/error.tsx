'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, WifiOff, Home, RotateCcw } from 'lucide-react'

function isNetworkError(error: Error): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  const msg = error.message?.toLowerCase() ?? ''
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('failed to fetch') ||
    msg.includes('load failed') ||
    msg.includes('networkerror') ||
    msg.includes('net::') ||
    msg.includes('timeout') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound')
  )
}

export default function HubError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isOffline, setIsOffline] = React.useState(false)
  const networkError = isNetworkError(error)

  React.useEffect(() => {
    console.error(error)
    setIsOffline(typeof navigator !== 'undefined' && !navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error])

  const offline = isOffline || networkError

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12 text-center">
        <div className="space-y-6 max-w-md mx-auto reveal">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-sm border ${offline ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
            {offline
              ? <WifiOff className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              : <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
            }
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {offline ? 'No Internet Connection' : 'Something went wrong!'}
            </h2>
            <p className="text-muted-foreground">
              {offline
                ? "It looks like you're offline. Please check your internet connection and try again."
                : "We've encountered an unexpected error. Our team has been notified and we're working to fix it."}
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
    </>
  )
}
