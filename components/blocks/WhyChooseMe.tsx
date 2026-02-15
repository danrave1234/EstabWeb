"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type WhyChooseMeProps = {
  title?: string;
  subtitle?: string;
  agentName: string;
  agentRole: string;
  licenseNumber: string;
  agentBio: string;
  agentImageUrl: string;
  trustSignals: { label: string; icon: string; imageUrl?: string }[];
  licensedBrokerLabel?: string;
  inquireNowLabel?: string;
};

export default function WhyChooseMe({
  title = "Why Choose Me",
  subtitle = "Professional Real Estate Services You Can Trust",
  agentName = "Juan Dela Cruz",
  agentRole = "Licensed Real Estate Broker",
  licenseNumber = "PRC #12345",
  agentBio = "With over 10 years of experience in the Philippine real estate market, I have helped hundreds of families find their perfect homes and smart investments.",
  agentImageUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  trustSignals = [],
  licensedBrokerLabel = "Licensed Broker",
  inquireNowLabel = "Inquire Now",
}: WhyChooseMeProps) {
  return (
    <section className="py-16 sm:py-24 bg-background reveal overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Agent Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border-8 border-background shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Image
                src={agentImageUrl}
                alt={agentName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* License Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-2xl shadow-2xl z-10 border-4 border-background animate-bounce-slow">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70 mb-1">{licensedBrokerLabel}</p>
              <p className="text-sm font-black text-primary-foreground">{licenseNumber}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary">{title}</p>
                <h2 className="text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  {agentName}
                </h2>
                <p className="text-lg font-bold text-muted-foreground uppercase tracking-wider border-l-4 border-primary pl-4">
                  {agentRole}
                </p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {agentBio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {signal.imageUrl ? (
                      <img src={signal.imageUrl} alt={signal.label} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={signal.icon} className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-tight">{signal.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest text-xs">
                {inquireNowLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
