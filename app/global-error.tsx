'use client'

import * as React from 'react'
import { fontVariables } from '@/lib/fonts'
import { WifiOff, AlertTriangle, RotateCcw } from 'lucide-react'

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

export default function GlobalError({
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
    <html lang="en" className={fontVariables}>
      <body className="antialiased flex items-center justify-center min-h-screen bg-background p-4 text-center">
        <div className="space-y-6 max-w-md mx-auto">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${offline ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
            {offline
              ? <WifiOff className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              : <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
            }
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {offline ? 'No Internet Connection' : 'Critical Error'}
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {offline
              ? "It looks like you're offline. Please check your internet connection and try again."
              : "A critical system error has occurred. We've been notified and are looking into it."}
          </p>

          <div className="pt-4">
            <button
              onClick={() => reset()}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              {offline ? 'Try Again' : 'Restart Application'}
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
