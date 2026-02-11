"use client";

import Link from "next/link";

export default function ConfigLink() {
  return (
    <Link
      href="/config"
      className="fixed bottom-4 right-4 flex items-center justify-center min-h-[44px] px-3 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors z-50 touch-manipulation"
    >
      Config
    </Link>
  );
}
