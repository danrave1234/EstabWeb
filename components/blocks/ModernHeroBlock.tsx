import { ModernHero, type ModernHeroProps } from "@/components/ui/modern-hero";

export type ModernHeroBlockProps = Partial<ModernHeroProps>;

const FALLBACK_AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&q=80",
    alt: "Avatar 1",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80",
    alt: "Avatar 2",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=80",
    alt: "Avatar 3",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&q=80",
    alt: "Avatar 4",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&q=80",
    alt: "Avatar 5",
  },
];

export default function ModernHeroBlock({
  heading,
  description,
  button,
  reviews,
  className,
}: ModernHeroBlockProps) {
  const safeReviews = {
    count: reviews?.count ?? 200,
    avatars: Array.isArray(reviews?.avatars) && reviews.avatars.length > 0 
      ? reviews.avatars 
      : FALLBACK_AVATARS,
  };

  return (
    <ModernHero
      heading={heading}
      description={description}
      button={button}
      reviews={safeReviews}
      className={className}
    />
  );
}
