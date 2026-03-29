"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitFormLead, trackEvent } from "@/components/shared/Analytics";
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import Image from "next/image";

export type ContactVisualProps = {
  title?: string;
  subtitle?: string;
  email: string;
  phone: string;
  address: string;
  backgroundImage?: string;
  formHeading?: string;
  formSubmitText?: string;
  formThankYouText?: string;
};

export default function ContactVisual({
  title = "Ready to Get Started?",
  subtitle = "Contact us today for a free consultation and let's bring your vision to life.",
  email,
  phone,
  address,
  backgroundImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80",
  formHeading = "Send a Message",
  formSubmitText = "Send Message",
  formThankYouText = "Message Received!",
}: ContactVisualProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  function handleFormFocus() {
    if (formStarted) return;
    setFormStarted(true);
    trackEvent({ type: 'form_start', section_key: 'contact--visual' });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitFormLead(
      undefined,
      { name: formData.name, email: formData.email, message: formData.message },
      "contact--visual",
    );
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error || "Something went wrong. Please try again.");
      return;
    }
    trackEvent({ type: 'form_submit', section_key: 'contact--visual' });
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    toast.success(formThankYouText || "Message sent successfully!");
  };

  return (
    <section id="contact-visual" className="relative min-h-[600px] flex items-center py-16 sm:py-24 overflow-hidden reveal">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Contact background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-6 pt-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 group">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5 sm:mb-1">Call Us Now</p>
                  <p className="text-[10px] sm:text-xl font-bold">{phone}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 group">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <EnvelopeIcon weight="duotone" className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left overflow-hidden w-full">
                  <p className="text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5 sm:mb-1">Email Inquiry</p>
                  <p className="text-[10px] sm:text-xl font-bold truncate">{email}</p>
                </div>
              </div>

              <div 
                className="col-span-2 lg:col-span-1 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 group cursor-pointer"
                onClick={() => trackEvent({ type: 'map_interact', metadata: { action: 'location_view' } })}
              >
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <MapPinIcon weight="duotone" className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5 sm:mb-1">Our Location</p>
                  <p className="text-[10px] sm:text-xl font-bold leading-tight">{address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">{formHeading}</h3>
              
              <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full bg-gray-50 border-transparent rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full bg-gray-50 border-transparent rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project or needs"
                    className="w-full bg-gray-50 border-transparent rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                {submitError && (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitted || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-bold text-lg hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <PaperPlaneRightIcon weight="duotone" className={`w-5 h-5 ${isSubmitted || isSubmitting ? 'hidden' : ''}`} />
                  {isSubmitted ? formThankYouText : isSubmitting ? "Sending…" : formSubmitText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

