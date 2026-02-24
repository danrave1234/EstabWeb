"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@phosphor-icons/react";
import { trackLead } from "@/components/shared/Analytics";

export type ContactMinimalProps = {
  title?: string;
  subtitle?: string;
  email: string;
  phone: string;
  address: string;
  formHeading?: string;
  formSubmitText?: string;
  formThankYouText?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
};

export default function ContactMinimal({
  title = "Get in Touch",
  subtitle = "Have questions? We're here to help.",
  email,
  phone,
  address,
  formHeading = "Send us a message",
  formSubmitText = "Send Message",
  formThankYouText = "Thank you! We'll get back to you soon.",
  nameLabel = "Name",
  emailLabel = "Email",
  messageLabel = "Message",
}: ContactMinimalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    trackLead('form', undefined, { name: formData.name, email: formData.email }, 'contact');
    setTimeout(() => {
      router.push("/success");
    }, 1000);
  };

  return (
    <section id="contact-minimal" className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Header & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                <a 
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  onClick={() => trackLead('call')}
                  className="flex items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Call Us</p>
                    <p className="text-sm sm:text-base font-bold text-foreground">{phone}</p>
                  </div>
                </a>

                <div className="flex items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <EnvelopeIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Email Us</p>
                    <p className="text-sm sm:text-base font-bold text-foreground break-all">{email}</p>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1 flex items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPinIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Visit Us</p>
                    <p className="text-xs sm:text-base font-medium text-foreground leading-tight">{address}</p>
                  </div>
                </div>
              </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-card rounded-2xl p-6 sm:p-10 shadow-xl shadow-foreground/5 border border-border relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <EnvelopeIcon weight="duotone" className="w-32 h-32" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-8">{formHeading}</h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{messageLabel}</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitted ? formThankYouText : formSubmitText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
