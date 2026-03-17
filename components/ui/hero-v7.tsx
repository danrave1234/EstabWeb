"use client";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export interface HeroV7Props {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  stats?: Array<{ emoji: string; label: string; value: string }>;
  teamAvatars?: Array<{ initials: string; src: string }>;
  onButtonClick?: () => void;
}

const DEFAULT_TEAM_AVATARS = [
  {
    initials: "JD",
    src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a1.jpg",
  },
  {
    initials: "HJ",
    src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a2.jpg",
  },
  {
    initials: "PI",
    src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a3.jpg",
  },
  {
    initials: "KD",
    src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a4.jpg",
  },
  {
    initials: "LD",
    src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a5.jpg",
  },
];

const DEFAULT_STATS = [
  { emoji: "🚀", label: "IN CLIENT REVENUE GENERATED", value: "$5M+" },
  { emoji: "📈", label: "BUSINESSES LAUNCHED", value: "200+" },
  { emoji: "💰", label: "SAVED IN OPERATIONAL COSTS", value: "$500K+" },
];

function AvatarStack({ avatars }: { avatars: HeroV7Props["teamAvatars"] }) {
  if (!avatars) return null;
  return (
    <div className="flex -space-x-3 mb-4">
      {avatars.map((member, i) => (
        <Avatar
          className="size-13 border-2 border-primary bg-neutral-800"
          key={`${member.initials}-${i}`}
          style={{ zIndex: avatars.length - i }}
        >
          <AvatarImage alt={`Team member ${i + 1}`} src={member.src} />
          <AvatarFallback className="bg-neutral-700 text-white text-xs">
            {member.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

function StatsMarquee({ stats }: { stats: HeroV7Props["stats"] }) {
  if (!stats) return null;
  return (
    <Marquee
      className="border-white/10 border-y bg-black/30 py-2 backdrop-blur-sm [--duration:30s] [--gap:2rem]"
      pauseOnHover
      repeat={4}
    >
      {stats.map((stat, i) => (
        <div
          className="flex items-center gap-3 whitespace-nowrap"
          key={`${stat.label}-${i}`}
        >
          <span className="font-bold font-mono text-primary text-sm tracking-wide">
            {stat.value}
          </span>
          <span className="font-medium font-mono text-sm text-white/70 uppercase tracking-[0.15em]">
            {stat.label}
          </span>
          <span className="text-base">{stat.emoji}</span>
        </div>
      ))}
    </Marquee>
  );
}

export default function HeroV7({
  title = "We think, you grow — that's the deal",
  description = "We take your big ideas and turn them into clear, winning strategies. From setting up your company to scaling it worldwide, we're here every step of the way.",
  buttonText = "Get Template",
  backgroundImage = "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a",
  stats = DEFAULT_STATS,
  teamAvatars = DEFAULT_TEAM_AVATARS,
  onButtonClick,
}: HeroV7Props) {
  return (
    <section className="relative flex min-h-[90vh] md:h-screen w-full flex-col items-start justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover transition-transform duration-700"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-white sm:px-8 lg:px-16 mt-20 md:mt-32">
        <div className="space-y-4">
          <AvatarStack avatars={teamAvatars} />
          <StatsMarquee stats={stats} />
        </div>
      </div>
      
      <div className="relative z-10 w-full px-4 pb-16 sm:px-8 sm:pb-24 lg:px-16 lg:pb-32 mt-8 md:mt-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
          <div className="w-full space-y-6 sm:w-3/5">
            <h1 
              className="font-medium text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
              dangerouslySetInnerHTML={{ 
                __html: title.replace(/—/, '<br /><span className="text-white">—</span>') 
              }}
            />
            <Button 
              onClick={onButtonClick}
              className="group rounded-none py-0 pr-0 font-normal text-black text-base md:text-lg bg-primary hover:bg-primary/90 h-auto"
            >
              <span className="px-4 py-3 md:px-6 md:py-4">{buttonText}</span>
              <span className="border-black/20 border-l p-3 md:p-4 bg-white/10 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="size-4 md:size-5" />
              </span>
            </Button>
          </div>
          <div className="w-full sm:w-2/5">
            <p className="text-sm md:text-xl lg:text-2xl text-primary italic text-left sm:text-right leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
