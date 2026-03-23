"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  ArrowUpRight,
  Clock,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ContactInfoItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
  href?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
}

export interface AgencyContactProps {
  title?: string;
  subtitle?: string;
  description?: string;
  formHeading?: string;
  formButtonText?: string;
  formThankYouText?: string;
  infoHeading?: string;
  infoItems?: ContactInfoItem[];
  socials?: SocialLink[];
  mapEmbedUrl?: string;
  officeHours?: string;
  onFormSubmit?: (data: { name: string; email: string; message: string }) => void | Promise<void>;
}

const ICON_MAP: Record<string, any> = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
  clock: Clock,
};

const DEFAULT_INFO: ContactInfoItem[] = [
  { id: "1", label: "Email", value: "hello@agency.com", icon: "mail", href: "mailto:hello@agency.com" },
  { id: "2", label: "Phone", value: "+63 912 345 6789", icon: "phone", href: "tel:+639123456789" },
  { id: "3", label: "Office", value: "BGC, Taguig, Metro Manila", icon: "map" },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "1", platform: "instagram", href: "#" },
  { id: "2", platform: "twitter", href: "#" },
  { id: "3", platform: "linkedin", href: "#" },
];

const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export function AgencyContact({
  title = "Let's build something remarkable together",
  subtitle = "GET IN TOUCH",
  description = "We're always looking for new challenges and exciting projects. Drop us a line and let's start a conversation.",
  formHeading = "Send us a message",
  formButtonText = "Send Message",
  formThankYouText = "Message Sent! We'll be in touch soon.",
  infoHeading = "Contact Details",
  infoItems = DEFAULT_INFO,
  socials = DEFAULT_SOCIALS,
  mapEmbedUrl,
  officeHours = "Mon - Fri, 9:00 AM - 6:00 PM",
  onFormSubmit,
}: AgencyContactProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!onFormSubmit) {
      setIsSubmitted(true);
      toast.success(formThankYouText || "Message Sent!");
      setTimeout(() => setIsSubmitted(false), 5000);
      return;
    }
    setIsSubmitting(true);
    try {
      await onFormSubmit(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      toast.success(formThankYouText || "Message Sent!");
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-20 md:py-32 bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -z-10 hidden lg:block" />
      
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Content & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-primary"
              >
                {subtitle}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1]"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                {description}
              </motion.p>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-foreground">{infoHeading}</h3>
                <div className="space-y-6">
                  {infoItems.map((item, index) => {
                    const Icon = ICON_MAP[item.icon || "mail"] || Mail;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                              {item.value}
                              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <p className="text-base font-medium text-foreground">{item.value}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {socials.length > 0 && (
                <div className="flex items-center gap-4 pt-4">
                  {socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.platform.toLowerCase()] || Instagram;
                    return (
                      <a
                        key={social.id}
                        href={social.href}
                        className="size-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                        aria-label={social.platform}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form & Map */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-background border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5"
            >
              <h3 className="text-2xl font-medium mb-8 text-foreground">{formHeading}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-4 outline-none focus:border-primary/30 focus:bg-background transition-all font-medium placeholder:text-muted-foreground/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@example.com"
                      className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-4 outline-none focus:border-primary/30 focus:bg-background transition-all font-medium placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-4 outline-none focus:border-primary/30 focus:bg-background transition-all font-medium placeholder:text-muted-foreground/30 resize-none"
                  />
                </div>
                {submitError && (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitted || isSubmitting}
                  className="w-full h-14 rounded-2xl text-base font-medium group transition-all duration-300"
                >
                  {isSubmitted ? formThankYouText : isSubmitting ? (
                    "Sending…"
                  ) : (
                    <span className="flex items-center gap-2">
                      {formButtonText}
                      <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Optional Map */}
            {mapEmbedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="w-full h-[300px] rounded-[2rem] overflow-hidden border border-border/50 grayscale hover:grayscale-0 transition-all duration-700"
              >
                <iframe
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </motion.div>
            )}

            {!mapEmbedUrl && officeHours && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-6 bg-muted/30 border border-border/50 rounded-2xl"
              >
                <div className="size-10 rounded-full bg-background flex items-center justify-center text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Office Hours</p>
                  <p className="text-sm font-medium text-foreground">{officeHours}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgencyContact;
