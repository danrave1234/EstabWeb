"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { ArrowsOutIcon } from "@phosphor-icons/react";
import { X } from "lucide-react";

export type BeforeAfterGalleryItem = {
  title: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
};

export type BeforeAfterGalleryGridProps = {
  title?: string;
  subtitle?: string;
  items: BeforeAfterGalleryItem[];
  beforeLabel?: string;
  afterLabel?: string;
};

export default function BeforeAfterGalleryGrid({
  title = "Our Recent Work",
  subtitle = "Real results for real clients. Slide to compare.",
  items = [],
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterGalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<BeforeAfterGalleryItem | null>(null);

  const FALLBACK_AFTER = "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80";
  const FALLBACK_BEFORE = "https://images.unsplash.com/photo-1507133353243-30912e777745?w=1200&q=80";

  return (
    <section className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
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
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative bg-muted/5 rounded-[2.5rem] overflow-hidden border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20 transition-all duration-500 flex flex-col hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.afterImage || FALLBACK_AFTER}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="p-4 bg-white text-black rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all transform"
                  >
                    <ArrowsOutIcon weight="duotone" className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-2xl z-20">
                  {afterLabel}
                </div>
              </div>
              <div className="p-8 sm:p-10 flex-grow">
                <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 sm:mb-4 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                {item.description && (
                  <p className="text-sm sm:text-base text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed italic">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/90 border-none">
          {selectedItem && (
            <div className="relative w-full aspect-video sm:aspect-[16/9]">
              <BeforeAfterCompare
                beforeImage={selectedItem.beforeImage}
                afterImage={selectedItem.afterImage}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-6 z-50 text-white drop-shadow-lg max-w-lg">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{selectedItem.title}</h3>
                <p className="text-sm font-medium opacity-80">{selectedItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BeforeAfterCompare({ beforeImage, afterImage, beforeLabel, afterLabel }: { beforeImage: string; afterImage: string; beforeLabel: string; afterLabel: string }) {
  const FALLBACK_AFTER = "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80";
  const FALLBACK_BEFORE = "https://images.unsplash.com/photo-1507133353243-30912e777745?w=1200&q=80";
  const [position, setPosition] = useState(50);

  const clampPosition = (pos: number) => Math.max(1, Math.min(pos, 99));

  return (
    <div className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPosition(clampPosition(x));
      }}
      onTouchMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setPosition(clampPosition(x));
      }}
    >
      <Image src={afterImage || FALLBACK_AFTER} alt="After" fill className="object-cover" sizes="100vw" />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="absolute inset-0 h-full"
          style={{ width: `${100 * (100 / position)}%` }}
        >
          <Image
            src={beforeImage || FALLBACK_BEFORE}
            alt="Before"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
            <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">{beforeLabel}</div>
      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">{afterLabel}</div>
    </div>
  );
}

