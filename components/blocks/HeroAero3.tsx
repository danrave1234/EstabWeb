"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button-aero";
import { cn } from "@/lib/utils";

interface HeroAero3Props {
  title?: string;
  subtitle?: string;
  primaryCTA?: string;
  primaryCTAHref?: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroAero3({
  title = "Sustainable Solutions for a Better Future",
  subtitle = "Empowering businesses and communities to thrive in a low-carbon world through tailored clean energy solutions.",
  primaryCTA = "Start a Project",
  primaryCTAHref = "#contact",
  backgroundImage = "https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=2070&auto=format&fit=crop",
  className,
}: HeroAero3Props) {
  return (
    <section className={cn("relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden", className)}>
      {/* Background Grid Lines */}
      <div className="absolute inset-0 z-10 size-full pointer-events-none">
        <div className="grid w-full grid-cols-12 divide-x divide-white/10 h-full">
          <div className="col-span-1 h-full" />
          <div className="col-span-3 h-full" />
          <div className="col-span-4 h-full" />
          <div className="col-span-3 h-full" />
          <div className="col-span-1 h-full" />
        </div>
      </div>
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-20 max-w-5xl px-6 text-center text-white">
        <h1 className="text-center font-sans font-bold text-5xl text-white tracking-tight md:text-6xl lg:text-8xl mb-6">
          {title}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-center font-light text-lg text-white/90 md:text-xl leading-relaxed">
          {subtitle}
        </p>

        <Button 
          render={<a href={primaryCTAHref} />}
          className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent [:hover,[data-pressed]]:bg-transparent"
        >
          <span className="rounded-full bg-[#e1fcad] px-8 py-4 text-black font-semibold text-lg duration-500 ease-in-out group-hover:bg-white group-hover:text-black group-hover:transition-colors shadow-xl">
            {primaryCTA}
          </span>
          <div className="relative flex h-[60px] w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e1fcad] text-black duration-500 ease-in-out group-hover:bg-white group-hover:transition-colors shadow-xl">
            <ArrowUpRight className="absolute h-6 w-6 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-12" />
            <ArrowUpRight className="absolute h-6 w-6 -translate-x-12 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
          </div>
        </Button>
      </div>
    </section>
  );
}
