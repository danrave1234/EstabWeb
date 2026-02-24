"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackLead } from "@/components/shared/Analytics";
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@phosphor-icons/react";

export type ContactWithMapProps = {
  title?: string;
  subtitle?: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl?: string;
  businessHours?: { day: string; hours: string }[];
  formHeading?: string;
  formSubmitText?: string;
  formThankYouText?: string;
};

export default function ContactWithMap({
  title = "Visit Our Office",
  subtitle = "We're conveniently located and ready to welcome you.",
  email,
  phone,
  address,
  mapEmbedUrl = "https://www.openstreetmap.org/export/embed.html?bbox=120.9716,14.5308,121.0516,14.5508&layer=mapnik&marker=14.5408,121.0117",
  businessHours = [
    { day: "Mon - Fri", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  formHeading = "Send us a Message",
  formSubmitText = "Send Message",
  formThankYouText = "Message Sent!",
}: ContactWithMapProps) {
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
    <section id="contact-map" className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form & Details */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:bg-background transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:bg-background transition-all outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <textarea
                required
                rows={4}
                placeholder="How can we help you today?"
                className="w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:bg-background transition-all outline-none resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
              <button
                type="submit"
                disabled={isSubmitted}
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Contact Details</h4>
                <div className="space-y-3">
                  <a href={`tel:${phone}`} onClick={() => trackLead('call')} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <PhoneIcon weight="duotone" className="w-4 h-4" />
                    <span className="text-sm font-medium">{phone}</span>
                  </a>
                  <a href={`mailto:${email}`} onClick={() => trackLead('form')} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <EnvelopeIcon weight="duotone" className="w-4 h-4" />
                    <span className="text-sm font-medium">{email}</span>
                  </a>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPinIcon weight="duotone" className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium leading-tight">{address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Business Hours</h4>
                <div className="space-y-2">
                  {businessHours.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.day}</span>
                      <span className="font-bold text-foreground">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="relative h-[500px] lg:h-auto min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-border">
             <iframe
               src={mapEmbedUrl}
               width="100%"
               height="100%"
               style={{ border: 0 }}
               allowFullScreen
               loading="lazy"
               className="absolute inset-0"
             />
             <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
