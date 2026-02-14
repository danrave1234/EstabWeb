"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, MessageSquare, Globe, Clock } from "lucide-react";

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
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/success");
    }, 1000);
  };

  return (
    <section id="contact-columns" className="py-16 sm:py-24 bg-muted/30 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-4">Mon-Fri from 8am to 5pm.</p>
            <a href={`tel:${phone}`} className="text-primary font-bold hover:underline">{phone}</a>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-4">Our team is here to help.</p>
            <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">{email}</a>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Visit Us</h3>
            <p className="text-sm text-muted-foreground mb-4">Come say hello at our office.</p>
            <p className="text-sm font-medium leading-relaxed">{address}</p>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Chat with Us</h3>
            <p className="text-sm text-muted-foreground mb-4">Available on Messenger/Viber.</p>
            <div className="flex gap-4">
               {messenger && <a href={messenger} target="_blank" className="text-primary font-bold hover:underline">Messenger</a>}
               {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`} target="_blank" className="text-primary font-bold hover:underline">WhatsApp</a>}
               {!messenger && !whatsapp && <span className="text-muted-foreground text-sm">Online Support</span>}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-background rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-border">
          <h3 className="text-2xl font-bold text-center mb-10">{formHeading}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  className="w-full bg-muted/20 border-transparent rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-muted/20 border-transparent rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <textarea
                required
                rows={4}
                placeholder="Tell us how we can help you..."
                className="w-full bg-muted/20 border-transparent rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
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
