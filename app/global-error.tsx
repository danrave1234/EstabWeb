'use client'

import { fontVariables } from "@/lib/fonts";
import * as React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={fontVariables}>
      <body className="antialiased flex items-center justify-center min-h-screen bg-background p-4 text-center">
        <div className="space-y-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">Critical Error</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            A critical system error has occurred. We've been notified and are looking into it.
          </p>
          <div className="pt-4">
            <button
              onClick={() => reset()}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              Restart Application
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
