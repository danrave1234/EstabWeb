"use client";

import { CreditCard, Wallet, Banknote, ShieldCheck, Landmark } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type PaymentOptionsStripProps = {
  title?: string;
  methods?: Array<{ name: string; icon?: string; imageUrl?: string }>;
};

const DEFAULT_METHODS: Record<string, any> = {
  gcash: { label: "GCash", icon: Wallet, color: "text-[#007DFE]" },
  maya: { label: "Maya", icon: Landmark, color: "text-[#10b981]" },
  bank: { label: "Bank Transfer", icon: CreditCard, color: "text-primary" },
  cod: { label: "Cash on Delivery", icon: Banknote, color: "text-accent" },
};

export default function PaymentOptionsStrip({
  title = "We Accept Payments via",
  methods = [{ name: "gcash" }, { name: "maya" }, { name: "bank" }, { name: "cod" }],
}: PaymentOptionsStripProps) {
  return (
    <section className="py-12 bg-background border-y border-border reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-muted-foreground opacity-50" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {methods.map((method, i) => {
              const info = DEFAULT_METHODS[method.name.toLowerCase()];
              const label = method.name;
              const imageUrl = method.imageUrl;
              const icon = method.icon;

              return (
                <div key={i} className="flex items-center gap-3 group transition-all">
                  <div className={`p-2 rounded-lg bg-muted/50 border border-border group-hover:border-primary/20 transition-colors ${info?.color || 'text-primary'}`}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={label} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                    ) : icon ? (
                      <DynamicIcon name={icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : info ? (
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : null}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground opacity-80 group-hover:opacity-100">
                    {info?.label || label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
