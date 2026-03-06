"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackLead, trackEvent } from "@/components/shared/Analytics";

export type EmergencyCTAStripProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  phone?: string;
  imageUrl?: string;
  icon?: string;
};

export default function EmergencyCTAStrip({
  title = "Emergency AC Repair Service?",
  subtitle = "Our technicians are ready to assist you 24/7. Fast response guaranteed.",
  buttonText = "Call Now",
  phone = "09XXXXXXXXX",
  imageUrl,
  icon = "Phone",
}: EmergencyCTAStripProps) {
  return (
    <section className="py-10 bg-primary text-primary-foreground reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-6">
            {imageUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : null}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{title}</h2>
              <p className="text-sm sm:text-lg opacity-90 font-medium">{subtitle}</p>
            </div>
          </div>
          
          <a 
            href={`tel:${phone.replace(/\s/g, '')}`} 
            onClick={() => { trackEvent({ type: 'cta_click', section_key: 'emergency_cta', cta_id: 'emergency_call' }); trackLead('call'); }}
            className="group flex items-center gap-3 px-10 py-5 bg-primary-foreground text-primary font-black rounded-full hover:scale-105 transition-all shadow-2xl uppercase tracking-widest text-sm"
          >
            <DynamicIcon name={icon} className="w-5 h-5 animate-pulse" />
            <span>{buttonText}: {phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
