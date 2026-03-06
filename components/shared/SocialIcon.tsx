"use client";

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const brandIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
} as const;

export type SocialBrand = keyof typeof brandIcons;

type SocialIconProps = {
  brand: SocialBrand;
  className?: string;
  "aria-hidden"?: boolean;
};

export function SocialIcon({
  brand,
  className,
  "aria-hidden": ariaHidden,
}: SocialIconProps) {
  const Icon = brandIcons[brand];
  return (
    <Icon
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
