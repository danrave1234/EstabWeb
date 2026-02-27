"use client";

import HeroFullScreen from "./hero-layouts/HeroFullScreen";
import HeroIndustrial from "./hero-layouts/HeroIndustrial";
import HeroBrightClean from "./hero-layouts/HeroBrightClean";
import HeroSoftLuxury from "./hero-layouts/HeroSoftLuxury";
import HeroStructuredSplit from "./hero-layouts/HeroStructuredSplit";
import HeroHvacUrgent from "./hero-layouts/HeroHvacUrgent";
import HeroBeforeAfter from "./hero-layouts/HeroBeforeAfter";
import HeroCleaningFresh from "./hero-layouts/HeroCleaningFresh";
import HeroSplit from "./hero-layouts/HeroSplit";

export interface HeroAuthorityProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundImage: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  benefitText?: string;
  benefitIcon?: string;
  benefitImageUrl?: string;
  localCoverage?: string;
  localCoverageIcon?: string;
  localCoverageImageUrl?: string;
  layout?: "full-screen" | "split" | "industrial" | "bright-clean" | "soft-luxury" | "structured-split" | "hvac-urgent" | "hvac-blue" | "before-after" | "cleaning-fresh";
  trustBadges?: { label: string; icon: string; imageUrl?: string }[];
  promoText?: string;
}

export default function HeroAuthority(props: HeroAuthorityProps) {
  const { layout = "split" } = props;

  switch (layout) {
    case "full-screen":
      return <HeroFullScreen {...props} />;
    case "industrial":
      return <HeroIndustrial {...props} />;
    case "bright-clean":
      return <HeroBrightClean {...props} />;
    case "soft-luxury":
      return <HeroSoftLuxury {...props} />;
    case "structured-split":
      return <HeroStructuredSplit {...props} />;
    case "hvac-urgent":
    case "hvac-blue":
      return <HeroHvacUrgent {...props} />;
    case "before-after":
      return <HeroBeforeAfter {...props} />;
    case "cleaning-fresh":
      return <HeroCleaningFresh {...props} />;
    case "split":
    default:
      return <HeroSplit {...props} />;
  }
}
