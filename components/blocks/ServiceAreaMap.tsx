"use client";

import { MapPinIcon } from "@phosphor-icons/react";

export type ServiceAreaMapProps = {
  title?: string;
  subtitle?: string;
  cities: string[];
  googleMapsEmbedUrl?: string;
  cantFindCityTitle?: string;
  cantFindCityDescription?: string;
};

export default function ServiceAreaMap({
  title = "Our Service Areas",
  subtitle = "We proudly serve the following locations",
  cities = ["Cebu City", "Mandaue", "Lapu-Lapu"],
  googleMapsEmbedUrl,
  cantFindCityTitle = "Can't find your city?",
  cantFindCityDescription = "We are constantly expanding our reach. Contact us to check if we can service your specific location.",
}: ServiceAreaMapProps) {
  return (
    <section className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground italic">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cities.map((city, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <MapPinIcon weight="duotone" className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{city}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="font-bold text-primary mb-2">{cantFindCityTitle}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cantFindCityDescription}
              </p>
            </div>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-lg">
            {googleMapsEmbedUrl ? (
              <iframe
                src={googleMapsEmbedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-8 text-center">
                <MapPinIcon weight="duotone" className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Interactive map will be displayed here.</p>
                <p className="text-xs opacity-60 mt-1">Configure Google Maps Embed URL in settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
