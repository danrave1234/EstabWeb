import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <span className="text-2xl">?</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved to a new location.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  )
}
