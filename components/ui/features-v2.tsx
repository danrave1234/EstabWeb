"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  accentColor?: string;
}

export interface FeaturesV2Props {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
  ctaText?: string;
  onCtaClick?: () => void;
}

const ICON_MAP: Record<string, any> = {
  zap: Zap,
  star: Star,
  check: CheckCircle2,
  shield: ShieldCheck,
  trending: TrendingUp,
};

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: "1",
    title: "Fast Delivery",
    description: "We ship your project in record time without compromising quality.",
    icon: "zap",
    accentColor: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "2",
    title: "Premium Quality",
    description: "Every pixel is handcrafted by our expert designers.",
    icon: "star",
    accentColor: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "3",
    title: "Secure & Reliable",
    description: "Built on enterprise-grade infrastructure for 99.9% uptime.",
    icon: "shield",
    accentColor: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "4",
    title: "Growth Focused",
    description: "Strategies designed to scale your business worldwide.",
    icon: "trending",
    accentColor: "bg-purple-500/10 text-purple-500",
  },
];

export function FeaturesV2({
  title = "Why business owners trust us",
  subtitle = "WHY CHOOSE US",
  description = "We don't just build websites; we build growth engines. Our unique approach combines data-driven strategy with world-class design.",
  features = DEFAULT_FEATURES,
  ctaText = "Start Your Project",
  onCtaClick,
}: FeaturesV2Props) {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-30" />

      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary"
              >
                {subtitle}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]"
              >
                {title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                onClick={onCtaClick}
                size="lg"
                className="group h-14 px-8 rounded-full text-base font-medium transition-all duration-300"
              >
                {ctaText}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = ICON_MAP[feature.icon || "check"] || CheckCircle2;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 rounded-[2rem] bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle Background Icon */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                    <Icon size={120} />
                  </div>

                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    feature.accentColor || "bg-primary/10 text-primary"
                  )}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-xl font-medium mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesV2;
