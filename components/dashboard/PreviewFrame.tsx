"use client"

import * as React from "react"

interface PreviewFrameProps {
  previewPath: string
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export default function PreviewFrame({ previewPath, iframeRef }: PreviewFrameProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return (
    <div className="flex-1 relative bg-muted/10 p-4 lg:p-8">
      <div className="w-full h-full rounded-xl border border-border shadow-2xl bg-background overflow-hidden flex flex-col">
        <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background border border-border rounded px-3 py-0.5 text-[10px] text-muted-foreground min-w-[200px] text-center truncate">
              {`${siteUrl}${previewPath}`}
            </div>
          </div>
        </div>
        <iframe 
          ref={iframeRef}
          src={previewPath} 
          className="flex-1 w-full h-full border-none"
          title="Project Preview"
        />
      </div>
    </div>
  )
}
