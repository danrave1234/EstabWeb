import dynamic from "next/dynamic";
import React, { ComponentType } from "react";
import SkeletonLoading from "@/components/shared/SkeletonLoading";

export function dynamicWithSkeleton<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: { 
    ssr?: boolean; 
    type?: "full" | "block" | "text" | "circle";
    className?: string;
  } = {}
) {
  const { ssr = true, type = "block", className = "h-40 w-full" } = options;
  
  return dynamic(importFn, {
    ssr,
    loading: () => React.createElement(SkeletonLoading, { type, className }),
  });
}
