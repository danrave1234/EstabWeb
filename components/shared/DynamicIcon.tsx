"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

/**
 * DynamicIcon
 * Resolves a Lucide icon component by its string name at runtime.
 * Falls back to a neutral icon when the name is missing or unknown.
 */
export function getLucideIcon(name?: string): LucideIcon {
  const lib = Icons as Record<string, any>;
  const fallback = (lib["Circle"] || lib["Dot"] || lib["Square"]) as LucideIcon;
  if (!name) return fallback;
  const Icon = lib[name] as LucideIcon | undefined;
  return Icon ?? fallback;
}

export default function DynamicIcon({ name, className, strokeWidth = 2 }: { name?: string; className?: string; strokeWidth?: number }) {
  return React.createElement(getLucideIcon(name), { className, strokeWidth });
}
