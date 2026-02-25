'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, WifiOff, RotateCcw } from 'lucide-react'

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

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isOffline, setIsOffline] = useState(false)
  const networkError = isNetworkError(error)

  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${offline ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
        {offline
          ? <WifiOff className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          : <AlertCircle className="w-8 h-8 text-red-600" />
        }
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
        {offline ? 'No Internet Connection' : 'Something went wrong'}
      </h1>

      <p className="text-muted-foreground max-w-md mb-8">
        {offline
          ? "It looks like you're offline. Please check your internet connection and try again."
          : "We're having trouble loading this site right now. Please try again later."}
      </p>

      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        {offline ? 'Try Again' : 'Reload Site'}
      </button>
    </div>
  )
}
