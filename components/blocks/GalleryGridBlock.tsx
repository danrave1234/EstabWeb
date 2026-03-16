import {
  GalleryGridBlock as GalleryGridBlockUI,
  type GalleryGridImage,
} from "@/components/ui/gallery-grid-block-shadcnui";

export type GalleryGridBlockProps = {
  badgeLabel?: string;
  title?: string;
  subtitle?: string;
  images?: { id: string | number; url: string; title: string; category: string }[];
};

const FALLBACK_IMAGES: GalleryGridImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
    title: "Abstract Architecture",
    category: "Architecture",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1618556450994-a83a8bd57fbe?w=500",
    title: "Modern Design",
    category: "Design",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500",
    title: "Urban Landscape",
    category: "Nature",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500",
    title: "Digital Art",
    category: "Art",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=500",
    title: "Creative Space",
    category: "Architecture",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500",
    title: "Minimalist View",
    category: "Design",
  },
];

export default function GalleryGridBlock({
  badgeLabel = "Gallery",
  title = "Our Portfolio",
  subtitle = "Explore our collection of stunning visuals and creative work",
  images,
}: GalleryGridBlockProps) {
  const safeImages: GalleryGridImage[] =
    Array.isArray(images) && images.length > 0
      ? images.map((img, i) => ({
          id: img.id ?? i + 1,
          url: img.url ?? "",
          title: img.title ?? `Image ${i + 1}`,
          category: img.category ?? "Uncategorized",
        }))
      : FALLBACK_IMAGES;

  return (
    <GalleryGridBlockUI
      badgeLabel={badgeLabel}
      title={title}
      subtitle={subtitle}
      images={safeImages}
    />
  );
}
