import React from "react";

interface SkeletonLoadingProps {
  className?: string;
  type?: "full" | "block" | "text" | "circle";
  message?: string;
}

export default function SkeletonLoading({ 
  className = "", 
  type = "full", 
  message 
}: SkeletonLoadingProps) {
  if (type === "full") {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        {message && (
          <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
        )}
      </div>
    );
  }

  if (type === "circle") {
    return (
      <div className={`animate-pulse bg-muted rounded-full ${className}`} />
    );
  }

  if (type === "text") {
    return (
      <div className={`animate-pulse bg-muted rounded h-4 w-full ${className}`} />
    );
  }

  // Default block
  return (
    <div className={`animate-pulse bg-muted rounded-xl ${className}`} />
  );
}
