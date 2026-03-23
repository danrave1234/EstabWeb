"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react";
import { submitFormLead, trackEvent, trackLead } from "@/components/shared/Analytics";

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
  messageLabel?: string;
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
  messageLabel = "Message",
  infoLabel = "Contact Information",
  callLabel = "Call us",
  locationLabel = "Location",
  emailUsLabel = "Email Us",
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneHref = phone.replace(/\s/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitFormLead(
      undefined,
      { name: formData.name, email: formData.email, message: formData.message },
      "contact",
    );
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error || "Something went wrong. Please try again.");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/success");
    }, 600);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 reveal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {formHeading}
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-12 xl:col-span-7 bg-background p-8 sm:p-16 rounded-[3rem] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">{nameLabel}</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">{emailLabel}</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground/60 ml-1">{messageLabel}</label>
                <textarea
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={4}
                  className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-5 outline-none focus:border-primary focus:bg-background transition-all font-medium placeholder:text-muted-foreground/40 shadow-inner resize-none"
                />
              </div>
              {submitError && (
                <p className="text-sm font-medium text-destructive" role="alert">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitted || isSubmitting}
                onClick={() => trackEvent({ type: 'cta_click', section_key: 'contact', cta_id: 'contact_form_submit' })}
                className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
              >
                {isSubmitted ? formThankYouText : isSubmitting ? "Sending…" : formSubmitText}
              </button>
            </form>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 space-y-6 sm:space-y-10 lg:pt-4">
            <h3 className="font-serif text-2xl sm:text-4xl font-black text-foreground leading-tight">
              {infoLabel}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <a
                href={`tel:${phoneHref}`}
                onClick={() => trackLead('call')}
                className="group relative flex items-center gap-6 p-6 sm:p-10 bg-background border border-border/40 rounded-[2rem] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10 shadow-lg shadow-primary/5 transform group-hover:rotate-6">
                  <PhoneIcon weight="bold" className="w-8 h-8" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-[0.2em] mb-1">{callLabel}</p>
                  <p className="text-lg sm:text-2xl font-black text-foreground tracking-tight">{phone}</p>
                </div>
              </a>

              <div className="group relative flex items-start gap-6 p-6 sm:p-10 bg-muted/20 border border-border/40 rounded-[2rem] overflow-hidden">
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary shrink-0 mt-1 shadow-sm">
                  <MapPinIcon weight="bold" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-[0.2em] mb-2">{locationLabel}</p>
                  <p className="text-base sm:text-xl font-black text-foreground/80 leading-tight uppercase tracking-tight">
                    {address}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${email}`}
                className="group relative flex items-center gap-6 p-6 sm:p-10 bg-muted/20 border border-border/40 rounded-[2rem] hover:bg-background hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground shrink-0 transition-all duration-500 shadow-sm transform group-hover:rotate-3">
                  <EnvelopeIcon weight="bold" className="w-6 h-6" />
                </div>
                <div className="overflow-hidden relative z-10">
                  <p className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-[0.2em] mb-1">{emailUsLabel}</p>
                  <span className="text-sm sm:text-lg text-foreground font-black tracking-tight truncate block">{email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

