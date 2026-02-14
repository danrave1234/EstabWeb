"use client"

import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useLivePreview } from "./LivePreviewProvider";

interface LegalPageTemplateProps {
  title: string;
  lastUpdated?: string;
  content?: string;
  serverData: any;
}

export default function LegalPageTemplate({ title, lastUpdated, content, serverData }: LegalPageTemplateProps) {
  const previewData = useLivePreview();
  const data = previewData || serverData;
  
  // Use data from config if available, fallback to provided content
  const legalData = data?.legal?.[title.toLowerCase().replace(/\s+/g, '')] || {};
  const displayTitle = legalData.title || title;
  const displayContent = legalData.content || content || "Content coming soon...";
  const displayDate = legalData.lastUpdated || lastUpdated || new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-sm font-bold text-primary">
            {data?.brand?.name || "Site"}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black mb-4 tracking-tight">{displayTitle}</h1>
        <p className="text-sm text-muted-foreground mb-12 flex items-center gap-2">
          <span className="w-1 h-1 bg-primary rounded-full" />
          Last updated: {displayDate}
        </p>
        
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: displayContent.replace(/\n/g, '<br/>') }}
        />
      </main>

      <footer className="border-t border-border py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {data?.brand?.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
