"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const brandIcons = {
  facebook: faFacebookF,
  twitter: faTwitter,
  linkedin: faLinkedinIn,
  instagram: faInstagram,
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
  const icon = brandIcons[brand];
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
