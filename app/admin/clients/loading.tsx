export default function AdminClientsLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
        <div className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="h-[70vh] animate-pulse rounded-2xl border border-border bg-card" />
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
            <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </div>
    </div>
  )
}
