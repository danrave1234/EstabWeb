"use client";

import MinimalHero, { type MinimalHeroProps } from "@/components/ui/hero-minimalism";

export interface HeroMinimalismBlockProps extends Partial<MinimalHeroProps> {}

export default function HeroMinimalismBlock(props: HeroMinimalismBlockProps) {
  return <MinimalHero {...props} />;
}
