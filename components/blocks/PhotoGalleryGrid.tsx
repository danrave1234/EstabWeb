"use client";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type GalleryItem = {
  imageUrl?: string;
  caption?: string;
  alt?: string;
};

export type PhotoGalleryGridProps = {
  title?: string;
  subtitle?: string;
  items?: GalleryItem[];
};

const DEFAULT_ITEMS: GalleryItem[] = [
  { imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", caption: "Project One", alt: "Gallery image 1" },
  { imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", caption: "Project Two", alt: "Gallery image 2" },
  { imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80", caption: "Project Three", alt: "Gallery image 3" },
  { imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80", caption: "Project Four", alt: "Gallery image 4" },
  { imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80", caption: "Project Five", alt: "Gallery image 5" },
  { imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", caption: "Project Six", alt: "Gallery image 6" },
];

export default function PhotoGalleryGrid({
  title = "Our Gallery",
  subtitle = "A showcase of our work.",
  items,
}: PhotoGalleryGridProps) {
  const galleryItems = items?.length ? items : DEFAULT_ITEMS;
  const gridClass = dynamicGridCols(galleryItems.length, 3);

  return (
    <section id="gallery" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          {title && (
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`grid gap-4 sm:gap-6 ${gridClass}`}>
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl aspect-square bg-muted shadow-sm hover:shadow-md transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */} 
              <img
                src={item.imageUrl ?? ""}
                alt={item.alt ?? item.caption ?? `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
