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

function normalizeText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

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
        <div className="text-center mb-16 sm:mb-24">
          {title && (
            <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`grid gap-6 sm:gap-10 ${gridClass}`}>
          {galleryItems.map((item, index) => {
            const imageUrl = normalizeText(item.imageUrl);
            const caption = normalizeText(item.caption);
            const alt = normalizeText(item.alt);
            const imageAlt = alt || caption || `Gallery image ${index + 1}`;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] aspect-square bg-muted shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.3)] hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 sm:p-10 backdrop-blur-[2px]">
                  {caption && (
                    <p className="text-white text-base sm:text-xl font-black tracking-tight leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 uppercase">
                      {caption}
                    </p>
                  )}
                  {alt && (
                    <p className="text-white/60 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {alt}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
