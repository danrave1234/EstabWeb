"use client";

import Image from "next/image";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type TeamMember = {
  imageUrl: string;
  name: string;
  specialty: string;
  bioUrl?: string;
};

export type TeamCarouselProps = {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  linkText?: string;
};

export default function TeamCarousel({
  title = "Our Team",
  subtitle,
  members,
  linkText = "View Bio",
}: TeamCarouselProps) {
  if (!members?.length) return null;

  return (
    <section id="team" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
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
        <div className={`grid gap-4 sm:gap-6 ${dynamicGridCols(members.length, 4)}`}>
          {members.map((member, index) => {
            const isExternal = member.imageUrl.startsWith("http");
            return (
              <article
                key={index}
                className="bg-background rounded-xl p-4 sm:p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="relative w-12 h-12 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-4 bg-muted shadow-inner">
                  {member.imageUrl ? (
                    isExternal ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 48px, 96px"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] sm:text-[10px]">
                      Photo
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-[11px] sm:text-lg text-foreground mb-0.5 sm:mb-1 leading-tight line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 flex-grow line-clamp-1">
                  {member.specialty}
                </p>
                <a
                  href={member.bioUrl ?? "#"}
                  className="w-full py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  {linkText}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

