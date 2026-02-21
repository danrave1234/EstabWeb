"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react";
import { trackLead } from "@/components/shared/Analytics";

export type ContactFormProps = {
  tagline: string;
  formHeading: string;
  formSubmitText: string;
  formThankYouText: string;
  email: string;
  phone: string;
  address: string;
  nameLabel?: string;
  emailLabel?: string;
  infoLabel?: string;
  callLabel?: string;
  locationLabel?: string;
  emailUsLabel?: string;
};

export default function ContactForm({
  tagline,
  formHeading,
  formSubmitText,
  formThankYouText,
  email,
  phone,
  address,
  nameLabel = "Your Name",
  emailLabel = "Email Address",
  infoLabel = "Contact Information",
  callLabel = "Call us",
  locationLabel = "Location",
  emailUsLabel = "Email Us",
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const phoneHref = phone.replace(/\s/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    trackLead('form', undefined, { name: formData.name, email: formData.email });
    
    // Simulate API call
    setTimeout(() => {
      router.push("/success");
    }, 800);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 reveal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            {formHeading}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-6 bg-background p-4 sm:p-8 rounded-2xl shadow-sm border border-border">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5 ml-1">{nameLabel}</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5 ml-1">{emailLabel}</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full min-h-[40px] sm:min-h-[44px] px-6 py-2 sm:py-3 mt-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity touch-manipulation text-xs sm:text-base"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4 sm:space-y-8 lg:pt-2">
            <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-primary/70 mb-4 sm:mb-6 ml-1">
              {infoLabel}
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-6">
              <a
                href={`tel:${phoneHref}`}
                onClick={() => trackLead('call')}
                className="col-span-2 lg:col-span-1 group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-background border border-border rounded-xl hover:border-primary transition-all duration-200 shadow-sm"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-6 h-6" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">{callLabel}</p>
                  <p className="text-[10px] sm:text-lg font-bold text-foreground">{phone}</p>
                </div>
              </a>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-background/50 border border-border/50 rounded-xl">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                  <MapPinIcon weight="duotone" className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5 sm:mb-1">{locationLabel}</p>
                  <p className="text-[9px] sm:text-sm text-foreground leading-relaxed whitespace-pre-line line-clamp-2 sm:line-clamp-none">
                    {address}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${email}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary transition-all duration-200"
              >
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary shrink-0 transition-colors">
                  <EnvelopeIcon weight="duotone" className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[8px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">{emailUsLabel}</p>
                  <span className="text-[9px] sm:text-sm text-foreground group-hover:text-primary transition-colors font-medium truncate block">{email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
