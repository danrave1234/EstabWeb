"use client";

import { MapPinIcon, CompassIcon, InfoIcon } from "@phosphor-icons/react";

export type CoverageRadiusBlockProps = {
  title?: string;
  subtitle?: string;
  radiusKm?: number;
  locationName?: string;
  note?: string;
  serviceCoverageLabel?: string;
  radiusLabel?: string;
};

export default function CoverageRadiusBlock({
  title = "Free Service Area",
  subtitle = "We offer free delivery and site visits within our primary zone.",
  radiusKm = 5,
  locationName = "Our Main Office",
  note = "A minimal fee applies to locations outside the 5km radius.",
  serviceCoverageLabel = "Service Coverage",
  radiusLabel = "Radius",
}: CoverageRadiusBlockProps) {
  return (
    <section className="py-16 bg-background reveal overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-primary/5 rounded-[3rem] border border-primary/10 p-8 sm:p-16 relative overflow-hidden">
          {/* Abstract Circle Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border-[1px] border-primary/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border-[1px] border-primary/10 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square border-[1px] border-primary/20 rounded-full pointer-events-none animate-pulse" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                <CompassIcon weight="duotone" className="w-3.5 h-3.5" />
                {serviceCoverageLabel}
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                {title} <span className="text-primary">{radiusKm}km</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium pt-4">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPinIcon weight="duotone" className="w-5 h-5 text-primary" />
                  {locationName}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                <div className="absolute inset-4 bg-primary/20 rounded-full" />
                <div className="relative bg-primary text-primary-foreground w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-2xl sm:text-4xl font-bold">{radiusKm}km</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80">{radiusLabel}</span>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border text-left max-w-sm">
                <InfoIcon weight="duotone" className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
