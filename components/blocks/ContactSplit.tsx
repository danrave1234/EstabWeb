"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitFormLead } from "@/components/shared/Analytics";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@phosphor-icons/react";

export type ContactSplitProps = {
  tagline: string;
  formHeading: string;
  formSubmitText: string;
  formThankYouText: string;
  email: string;
  phone: string;
  address: string;
  callLabel?: string;
  emailUsLabel?: string;
  locationLabel?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
};

export default function ContactSplit({
  tagline,
  formHeading,
  formSubmitText,
  formThankYouText,
  email,
  phone,
  address,
  callLabel = "Call Us",
  emailUsLabel = "Email Us",
  locationLabel = "Location",
  nameLabel = "Your Name",
  emailLabel = "Email Address",
  messageLabel = "Message",
}: ContactSplitProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitFormLead(
      undefined,
      { name: formData.name, email: formData.email, message: formData.message },
      "contact--split",
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
    <section id="contact" className="bg-background reveal">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Contact Info Side */}
        <div className="bg-primary p-8 sm:p-16 lg:p-24 text-primary-foreground reveal">
          <div className="max-w-md ml-auto">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight">
              {formHeading}
            </h2>
            <p className="text-primary-foreground/80 mb-12 text-lg">
              {tagline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5 sm:mb-1">{callLabel}</p>
                  <p className="text-sm sm:text-xl font-bold">{phone}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5 sm:mb-1">{emailUsLabel}</p>
                  <p className="text-sm sm:text-xl font-bold truncate">{email}</p>
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5 sm:mb-1">{locationLabel}</p>
                  <p className="text-sm sm:text-xl font-bold leading-tight">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="bg-muted/30 p-8 sm:p-16 lg:p-24 flex items-center reveal">
          <div className="max-w-md w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">{nameLabel}</label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border-none rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-primary shadow-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">{emailLabel}</label>
                <input
                  type="email"
                  required
                  className="w-full bg-background border-none rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-primary shadow-sm"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">{messageLabel}</label>
                <textarea
                  rows={4}
                  required
                  className="w-full bg-background border-none rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-primary shadow-sm resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitted ? formThankYouText : isSubmitting ? "Sending…" : formSubmitText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
