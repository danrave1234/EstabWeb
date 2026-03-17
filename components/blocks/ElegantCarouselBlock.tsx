import ElegantCarousel, {
  type ElegantCarouselSlide,
} from "@/components/ui/elegant-carousel";

export type ElegantCarouselBlockProps = {
  slides?: ElegantCarouselSlide[];
};

const FALLBACK_SLIDES: ElegantCarouselSlide[] = [
  {
    title: "Venetian Dusk",
    subtitle: "Autumn / Winter Collection",
    description:
      "Where ancient architecture meets the dying light — a palette drawn from terracotta, aged stone, and the shimmering canals of Venice at twilight.",
    accent: "#C4956A",
    imageUrl:
      "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=900&h=1200&fit=crop&q=80",
  },
  {
    title: "Nordic Silence",
    subtitle: "Spring / Summer Collection",
    description:
      "Inspired by the vast stillness of Scandinavian fjords — clean lines, muted tones, and the quiet power of unadorned beauty.",
    accent: "#8BA7B8",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop&q=80",
  },
  {
    title: "Kyoto Garden",
    subtitle: "Resort Collection",
    description:
      "Moss-covered pathways and paper lanterns — an ode to the meditative elegance of Japanese garden design and its timeless restraint.",
    accent: "#7A9E7E",
    imageUrl:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop&q=80",
  },
];

export default function ElegantCarouselBlock({ slides }: ElegantCarouselBlockProps) {
  const safeSlides =
    Array.isArray(slides) && slides.length > 0
      ? slides.map((s) => ({
          title: s.title ?? "",
          subtitle: s.subtitle ?? "",
          description: s.description ?? "",
          accent: s.accent ?? "#8BA7B8",
          imageUrl: s.imageUrl ?? "",
        }))
      : FALLBACK_SLIDES;

  return (
    <section id="hero" className="bg-background">
      <ElegantCarousel slides={safeSlides} />
    </section>
  );
}
