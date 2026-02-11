export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted-foreground font-medium animate-pulse">Loading Admin Portal...</p>
    </div>
  );
}
