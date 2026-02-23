import Link from 'next/link'
import { Globe } from 'lucide-react'

export default function SiteNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <Globe className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Site Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the website you're looking for. It might be private or the address might be incorrect.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
      >
        Go to Homepage
      </Link>
    </div>
  )
}
