"use client";

import Image from "next/image";

export type FeatureHighlightItem = {
  imageUrl: string;
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
        <div className="space-y-10 md:space-y-16 lg:space-y-24">
          {items.map((item, index) => {
            const imageLeft = index % 2 === 0;
            const isExternal = item.imageUrl.startsWith("http");
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center"
              >
                <div
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted ${
                    !imageLeft ? "md:order-2" : ""
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      Image
                    </div>
                  )}
                </div>
                <div className={!imageLeft ? "md:order-1" : ""}>
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
