'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertCircle, WifiOff, RefreshCw, LayoutDashboard } from 'lucide-react'

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

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background rounded-3xl border border-border shadow-sm m-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${offline ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
        {offline
          ? <WifiOff className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          : <AlertCircle className="w-8 h-8 text-red-600" />
        }
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        {offline ? 'No Internet Connection' : 'Admin Panel Error'}
      </h2>

      <p className="text-muted-foreground max-w-md mb-8">
        {offline
          ? "It looks like you're offline. Please check your internet connection and try again."
          : error.message || 'An error occurred while processing your request in the admin panel. The details have been logged.'}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4 opacity-50">
          Error ID: {error.digest}
        </p>
      )}

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
