"use client";

import Image from "next/image";

export type AttorneyProfileProps = {
  label: string;
  name: string;
  bioParagraph1: string;
  bioParagraph2: string;
  signatureName: string;
  headshotUrl: string;
};

export default function AttorneyProfile({
  label,
  name,
  bioParagraph1,
  bioParagraph2,
  signatureName,
  headshotUrl,
}: AttorneyProfileProps) {
  const isExternalImage = headshotUrl.startsWith("http");

  return (
    <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] max-h-[400px] lg:max-h-[560px] rounded-lg overflow-hidden bg-muted mx-auto">
              {headshotUrl ? (
                isExternalImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={headshotUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={headshotUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Professional headshot
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-[10px] sm:text-sm font-bold tracking-widest text-primary/80 uppercase">
              {label}
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {name}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              <p className="text-sm sm:text-[17px]">{bioParagraph1}</p>
              <p className="text-sm sm:text-[17px]">{bioParagraph2}</p>
            </div>
            <p
              className="font-serif text-2xl text-primary italic pt-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {signatureName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
