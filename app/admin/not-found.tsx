import Link from 'next/link'
import { FileQuestion, LayoutDashboard } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background rounded-3xl border border-border shadow-sm m-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Resource Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The admin page or resource you are looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link
        href="/admin/dashboard"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        <LayoutDashboard className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  )
}
