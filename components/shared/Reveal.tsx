"use client";

import React, { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.15;

type RevealProps = {
  as?: "section" | "div" | "article";
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"section">;

/**
 * Reveal: applies scroll-reveal animation via React state so server and client
 * match (no hydration mismatch). ScrollReveal skips elements with data-reveal-managed.
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: RevealProps) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(true);
        });
      },
      { root: null, rootMargin: "0px", threshold: THRESHOLD }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const resolvedClass = [
    className,
    "reveal",
    active ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref as any}
      className={resolvedClass}
      data-reveal-managed
      {...rest}
    >
      {children}
    </Tag>
  );
}
