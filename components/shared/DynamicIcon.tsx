"use client";

import React, { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Circle } from "lucide-react";

/**
 * Converts PascalCase to kebab-case
 * Example: "MapPin" -> "map-pin", "Circle" -> "circle"
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

type IconName = keyof typeof dynamicIconImports;

export default function DynamicIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const IconComponent = useMemo(() => {
    if (!name) return null;

    // Parse the given name to kebab-case to match dynamicIconImports keys
    const kebabName = toKebabCase(name) as IconName;

    // Check if it's a valid icon in the registry
    if (kebabName in dynamicIconImports) {
      return dynamic(dynamicIconImports[kebabName]);
    }

    return null;
  }, [name]);

  if (!IconComponent) {
    // Fallback neutral icon
    return <Circle className={className} strokeWidth={strokeWidth} />;
  }

  return (
    <Suspense fallback={<div className={className} style={{ width: '1em', height: '1em', display: 'inline-block', opacity: 0.5 }} />}>
      <IconComponent className={className} strokeWidth={strokeWidth} />
    </Suspense>
  );
}
