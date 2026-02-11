"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export type ContactFormProps = {
  tagline: string;
  formHeading: string;
  formSubmitText: string;
  formThankYouText: string;
  email: string;
  phone: string;
  address: string;
};

export default function ContactForm({
  tagline,
  formHeading,
  formSubmitText,
  formThankYouText,
  email,
  phone,
  address,
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const phoneHref = phone.replace(/\s/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="bg-background p-6 sm:p-8 rounded-2xl shadow-sm border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full min-h-[40px] sm:min-h-[44px] px-4 py-2 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full min-h-[40px] sm:min-h-[44px] px-4 py-2 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full min-h-[40px] sm:min-h-[44px] px-6 py-2 sm:py-3 mt-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity touch-manipulation text-sm sm:text-base"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </form>
          </div>

          <div className="space-y-8 lg:pt-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70 mb-6 ml-1">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <a
                  href={`tel:${phoneHref}`}
                  className="group flex items-center gap-4 p-4 bg-background border border-border rounded-xl hover:border-primary transition-all duration-200 shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Call us</p>
                    <p className="text-lg font-bold text-foreground">{phone}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-background/50 border border-border/50 rounded-xl">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Office Address</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary shrink-0 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Email Us</p>
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors font-medium">{email}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
