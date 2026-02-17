"use client";

import { useState, useRef, useEffect } from "react";

export type BeforeAfterSliderProps = {
  title?: string;
  subtitle?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export default function BeforeAfterSlider({
  title = "Seeing is Believing",
  subtitle = "Check out our amazing transformations",
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Avoid divide-by-zero in the reveal math and keep the handle usable.
  const clampPosition = (pos: number) => Math.max(1, Math.min(pos, 99));

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition(clampPosition((x / rect.width) * 100));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isResizing) handleMove(e.touches[0].clientX);
  };

  const stopResizing = () => setIsResizing(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("touchend", stopResizing);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchend", stopResizing);
    };
  }, [isResizing]);

  return (
    <section className="py-16 sm:py-24 bg-muted/20 reveal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground italic">
            {subtitle}
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none border-4 border-white shadow-2xl"
          onMouseDown={() => setIsResizing(true)}
          onTouchStart={() => setIsResizing(true)}
        >
          {/* After Image (Base) */}
          <img 
            src={afterImage || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80"} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Before Image (Overlay) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div 
              className="absolute inset-0 h-full"
              style={{ width: `${100 * (100 / sliderPosition)}%` }}
            >
              <img 
                src={beforeImage || "https://images.unsplash.com/photo-1507133353243-30912e777745?w=1200&q=80"} 
                alt="Before" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold uppercase tracking-widest shadow-lg">
            {afterLabel}
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary/20">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-primary/40 rounded-full" />
                <div className="w-1 h-3 bg-primary/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
