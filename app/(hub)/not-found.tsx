'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function HubNotFound() {
  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-12 pb-12 text-center">
        <div className="space-y-6 max-w-md mx-auto reveal">
          <div className="relative mb-8">
            <h1 className="text-[120px] font-black text-primary/5 leading-none select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-background rounded-3xl shadow-2xl border border-border flex items-center justify-center rotate-3 transform hover:rotate-0 transition-transform duration-500">
                <Search className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for seems to have vanished into the digital void.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-3 bg-muted/50 text-foreground border border-border rounded-full font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
