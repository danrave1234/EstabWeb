"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackLead, trackEvent } from "@/components/shared/Analytics";
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ChatCircleDotsIcon, GlobeIcon, ClockIcon } from "@phosphor-icons/react";

export type ContactColumnsProps = {
  title?: string;
  subtitle?: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  messenger?: string;
  formHeading?: string;
  formSubmitText?: string;
  formThankYouText?: string;
};

export default function ContactColumns({
  title = "Contact Us",
  subtitle = "Choose your preferred way to reach out. Our team is ready to assist you.",
  email,
  phone,
  address,
  whatsapp,
  messenger,
  formHeading = "Send us a message",
  formSubmitText = "Send Message",
  formThankYouText = "Message Sent!",
}: ContactColumnsProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackLead('form', undefined, { name: formData.name, email: formData.email }, 'contact');
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/success");
    }, 1000);
  };

  return (
    <section id="contact-columns" className="py-16 sm:py-24 bg-muted/30 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24 reveal">
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-20 sm:mb-32">
          {/* Phone Card */}
          <div className="group relative bg-background p-8 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 text-center flex flex-col items-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-primary/5">
              <PhoneIcon weight="bold" className="w-6 h-6 sm:w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 relative z-10">Call Us</h3>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-medium mb-6 opacity-70 relative z-10">Mon-Fri from 8am to 5pm.</p>
            <a href={`tel:${phone}`} onClick={() => trackLead('call')} className="text-primary font-black hover:underline text-sm sm:text-xl tracking-tight relative z-10 break-all">{phone}</a>
          </div>

          {/* Email Card */}
          <div className="group relative bg-background p-8 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 text-center flex flex-col items-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-primary/5">
              <EnvelopeIcon weight="bold" className="w-6 h-6 sm:w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 relative z-10">Email Us</h3>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-medium mb-6 opacity-70 relative z-10">Our team is here to help.</p>
            <a href={`mailto:${email}`} onClick={() => trackLead('form')} className="text-primary font-black hover:underline text-sm sm:text-xl tracking-tight relative z-10 break-all">{email}</a>
          </div>

          {/* Visit Card */}
          <div
            className="group relative bg-background p-8 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 text-center flex flex-col items-center cursor-pointer overflow-hidden"
            onClick={() => trackEvent({ type: 'map_interact', metadata: { action: 'visit_us_click' } })}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-primary/5">
              <MapPinIcon weight="bold" className="w-6 h-6 sm:w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 relative z-10">Visit Us</h3>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-medium mb-6 opacity-70 relative z-10">Come say hello at our office.</p>
            <p className="text-sm sm:text-lg font-black text-foreground/80 leading-tight relative z-10 uppercase tracking-tight">{address}</p>
          </div>

          {/* Chat Card */}
          <div className="group relative bg-background p-8 sm:p-10 rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 text-center flex flex-col items-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-primary/5">
              <ChatCircleDotsIcon weight="bold" className="w-6 h-6 sm:w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 relative z-10">Chat</h3>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-medium mb-6 opacity-70 relative z-10">Available on Messenger/Viber.</p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              {messenger && <a href={messenger} target="_blank" onClick={() => trackLead('messenger')} className="text-primary font-black hover:underline text-sm sm:text-lg uppercase tracking-widest">Messenger</a>}
              {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`} target="_blank" onClick={() => trackLead('messenger')} className="text-primary font-black hover:underline text-sm sm:text-lg uppercase tracking-widest">WhatsApp</a>}
              {!messenger && !whatsapp && <span className="text-foreground/60 font-black uppercase tracking-widest">Online Now</span>}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-background rounded-[3rem] p-10 sm:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <h3 className="font-serif text-2xl sm:text-4xl font-black text-center mb-12 uppercase tracking-tight">{formHeading}</h3>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">Your Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us how we can help you..."
                className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full sm:w-auto px-16 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
