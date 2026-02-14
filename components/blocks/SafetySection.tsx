"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type SafetyItem = {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
};

export type SafetySectionProps = {
  title?: string;
  subtitle?: string;
  items: SafetyItem[];
  kidPetFriendlyLabel?: string;
};

export default function SafetySection({ 
  title, 
  subtitle, 
  items,
  kidPetFriendlyLabel = "Kid & Pet Friendly"
}: SafetySectionProps) {
  return (
    <section id="safety" className="py-12 sm:py-20 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/5 rounded-[2rem] p-8 sm:p-12 border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-green-500/20">
                {kidPetFriendlyLabel}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {title || "Prioritizing the Safety of Your Loved Ones"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle || "We use eco-friendly and low-toxicity treatments that are tough on pests but safe for your family and pets."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <div key={index} className="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl overflow-hidden flex items-center justify-center mb-4 text-primary">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={item.icon} className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
