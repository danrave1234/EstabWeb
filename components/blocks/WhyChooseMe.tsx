"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackLead, trackEvent } from "@/components/shared/Analytics";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Agent Image */}
          <div className="relative group">
            <div className="absolute inset-4 bg-primary/10 rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700 blur-2xl opacity-50" />
            <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-[4/5] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border-8 border-background shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group-hover:scale-[1.02] transition-all duration-700 z-10">
              <Image
                src={agentImageUrl}
                alt={agentName}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            {/* License Badge */}
            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 bg-background p-6 sm:p-10 rounded-[2.5rem] shadow-2xl z-20 border-border border transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">{licensedBrokerLabel}</p>
              <p className="font-serif text-lg sm:text-2xl font-black text-foreground tracking-tight">{licenseNumber}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-4">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-primary/60">{title}</p>
                <h2 className="font-serif text-3xl sm:text-7xl font-black text-foreground leading-[1.1] tracking-tighter">
                  {agentName}
                </h2>
                <div className="flex items-center gap-4 py-2">
                  <span className="h-1 w-12 bg-primary/20 rounded-full" />
                  <p className="text-xs sm:text-lg font-black text-primary uppercase tracking-[0.3em]">
                    {agentRole}
                  </p>
                </div>
              </div>
              <blockquote className="relative">
                <div className="absolute -top-4 -left-6 text-7xl text-primary/10 font-serif leading-none">&ldquo;</div>
                <p className="text-base sm:text-2xl text-muted-foreground leading-relaxed font-medium opacity-80 pl-6 py-2 italic font-serif">
                  {agentBio}
                </p>
              </blockquote>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10">
              {trustSignals.map((signal, index) => (
                <div key={index} className="group/signal flex items-center gap-4 p-4 bg-muted/20 rounded-[1.5rem] border border-border/40 hover:border-primary/20 hover:bg-background hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-background rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-border/40 group-hover/signal:bg-primary group-hover/signal:text-primary-foreground transition-all duration-300 shadow-sm">
                    {signal.imageUrl ? (
                      <img src={signal.imageUrl} alt={signal.label} className="w-full h-full object-contain p-2 filter grayscale group-hover/signal:grayscale-0 transition-all" />
                    ) : (
                      <DynamicIcon name={signal.icon} className="w-6 h-6 text-primary group-hover/signal:text-primary-foreground transition-colors" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-black text-foreground uppercase tracking-[0.1em]">{signal.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-10 flex justify-center lg:justify-start">
              <button
                onClick={() => { trackEvent({ type: 'cta_click', section_key: 'why_choose_me', cta_id: 'agent_inquire' }); trackLead('form'); }}
                className="w-full sm:w-auto px-16 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
              >
                {inquireNowLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
