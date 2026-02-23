"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type FeatureHighlightItem = {
  imageUrl?: string;
  icon?: string;
  title: string;
  description: string;
};

export type FeatureHighlightZigzagProps = {
  title?: string;
  subtitle?: string;
  items: FeatureHighlightItem[];
};

export default function FeatureHighlightZigzag({
  title,
  subtitle,
  items,
}: FeatureHighlightZigzagProps) {
  return (
    <section id="highlights" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 reveal">
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-10 sm:mb-14">
            {title && (
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="space-y-6 sm:space-y-10 md:space-y-16 lg:space-y-24">
          {items.map((item, index) => {
            const imageLeft = index % 2 === 0;
            const isExternal = item.imageUrl?.startsWith("http");
            return (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-10 md:gap-14 items-center"
              >
                <div
                  className={`relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-muted flex items-center justify-center col-span-1 ${
                    !imageLeft ? "order-2" : ""
                  }`}
                >
                  {item.imageUrl ? (
                    isExternal ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 100vw, 50vw"
                      />
                    )
                  ) : item.icon ? (
                    <div className="w-8 h-8 sm:w-20 sm:h-20 lg:w-32 lg:h-32 text-primary opacity-20">
                      <DynamicIcon name={item.icon} className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] sm:text-sm">
                      Image
                    </div>
                  )}
                </div>
                <div className={`col-span-1 ${!imageLeft ? "order-1" : ""}`}>
                  <h3 className="text-[11px] sm:text-lg md:text-2xl font-bold text-foreground mb-1 sm:mb-2 sm:mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

