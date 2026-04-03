"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElegantCarouselSlide {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  imageUrl: string;
}

const DEFAULT_SLIDES: ElegantCarouselSlide[] = [
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
  {
    title: "Saharan Gold",
    subtitle: "Capsule Collection",
    description:
      "The desert reveals its secrets at dawn — liquid gold spilling across endless dunes, textures carved by centuries of wind and time.",
    accent: "#D4A955",
    imageUrl:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&h=1200&fit=crop&q=80",
  },
];

interface ElegantCarouselProps {
  slides?: ElegantCarouselSlide[];
}

export default function ElegantCarousel({ slides = DEFAULT_SLIDES }: ElegantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SLIDE_DURATION = 6000;
  const TRANSITION_DURATION = 800;

  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_SLIDES;

  const goToSlide = useCallback(
    (index: number, dir?: "next" | "prev") => {
      if (isTransitioning || index === currentIndex || index < 0 || index >= safeSlides.length) return;
      setDirection(dir ?? (index > currentIndex ? "next" : "prev"));
      setIsTransitioning(true);
      setProgress(0);

      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, TRANSITION_DURATION / 2);
    },
    [isTransitioning, currentIndex, safeSlides.length]
  );

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % safeSlides.length;
    goToSlide(nextIndex, "next");
  }, [currentIndex, goToSlide, safeSlides.length]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + safeSlides.length) % safeSlides.length;
    goToSlide(prevIndex, "prev");
  }, [currentIndex, goToSlide, safeSlides.length]);

  useEffect(() => {
    if (isPaused) return;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    intervalRef.current = setInterval(() => {
      goNext();
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentSlide = safeSlides[currentIndex];

  const transitionClass = isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0";

  return (
    <div
      className="relative grid h-[760px] grid-rows-[1fr_auto] overflow-hidden bg-background sm:h-[800px] md:h-[680px] lg:h-[720px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background accent wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${currentSlide.accent}18 0%, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-6 px-4 py-8 md:flex-row md:items-center md:gap-12 md:px-6 md:py-10 lg:gap-16 lg:px-8">
        {/* Left: Text Content */}
        <div className="flex flex-1 flex-col justify-center md:min-w-[320px]">
          <div className="space-y-2 sm:space-y-3">
            {/* Collection number */}
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                transitionClass
              )}
            >
              <span className="h-px w-8 flex-shrink-0 bg-foreground/30" />
              <span className="text-xs font-medium tracking-widest text-muted-foreground">
                {String(currentIndex + 1).padStart(2, "0")} / {String(safeSlides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <div className={cn("flex items-start justify-between gap-3", transitionClass)}>
              <h2
                className={cn(
                  "break-words text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl",
                )}
              >
                {currentSlide.title}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={goPrev}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground/10 hover:border-foreground/40 md:h-10 md:w-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={goNext}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground/10 hover:border-foreground/40 md:h-10 md:w-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className={cn(
                "text-sm font-medium uppercase tracking-wider transition-all duration-300 md:text-base",
                transitionClass
              )}
              style={{ color: currentSlide.accent }}
            >
              {currentSlide.subtitle}
            </p>

            {/* Description */}
            <p
              className={cn(
                "max-w-md max-h-[6.5rem] overflow-hidden break-words text-sm leading-relaxed text-muted-foreground transition-all duration-300 md:max-h-[8rem] md:text-base",
                transitionClass
              )}
            >
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative mx-auto w-full max-w-[300px] flex-shrink-0 sm:max-w-[360px] md:mx-0 md:w-[42%] md:max-w-none lg:w-[46%]">
          <div
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden rounded-lg transition-all duration-500",
              transitionClass
            )}
          >
            {safeSlides.map((slide, index) => {
              const isActive = index === currentIndex;

              return (
                <img
                  key={`${slide.title}-${index}`}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  aria-hidden={!isActive}
                />
              );
            })}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${currentSlide.accent}22 0%, transparent 50%)`,
              }}
            />
          </div>

          {/* Decorative frame corners */}
          <div
            className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2"
            style={{ borderColor: currentSlide.accent }}
          />
          <div
            className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2"
            style={{ borderColor: currentSlide.accent }}
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3 border-t border-foreground/10 bg-background/80 px-3 py-4 backdrop-blur-sm sm:gap-4 sm:px-4">
        {safeSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "group flex max-w-[7rem] flex-col items-center gap-1.5 transition-opacity",
              index === currentIndex ? "opacity-100" : "opacity-60 hover:opacity-80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="h-0.5 w-16 overflow-hidden rounded-full bg-foreground/20">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%",
                  backgroundColor: index === currentIndex ? currentSlide.accent : undefined,
                }}
              />
            </div>
            <span className="w-full truncate text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
              {slide.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
