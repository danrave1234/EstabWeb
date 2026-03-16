import { Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModernHeroProps {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
  className?: string;
}

const ModernHero = ({
  heading = "Professional Solutions for Your Local Business",
  description = "Get a modern, high-performance website that captures leads and grows your presence online. Built for reliability and speed.",
  button = {
    text: "Get Started Now",
    url: "/contact",
  },
  reviews = {
    count: 200,
    avatars: [
      {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&q=80",
        alt: "Customer 1",
      },
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80",
        alt: "Customer 2",
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=80",
        alt: "Customer 3",
      },
      {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&q=80",
        alt: "Customer 4",
      },
      {
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&q=80",
        alt: "Customer 5",
      },
    ],
  },
  className,
}: ModernHeroProps) => {
  return (
    <section className={cn("py-32 bg-background", className)}>
      <div className="container px-4 mx-auto text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-4xl font-extrabold lg:text-7xl tracking-tight text-foreground">
            {heading}
          </h1>
          <p className="text-balance text-muted-foreground lg:text-xl max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        <Button asChild size="lg" className="mt-10 rounded-full px-10 h-14 text-lg">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border-2 border-background ring-offset-2 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <AvatarImage src={avatar.src} alt={avatar.alt} className="object-cover" />
              </Avatar>
            ))}
          </span>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground/80">
              Joined by {reviews.count}+ happy clients
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ModernHero };
