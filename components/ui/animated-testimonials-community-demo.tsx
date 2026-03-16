"use client"

import { AnimatedTestimonialsCommunity } from "@/components/ui/animated-testimonials-community"

export function AnimatedTestimonialsCommunityDemo() {
  return (
    <AnimatedTestimonialsCommunity
      testimonials={[
        {
          id: 1,
          name: "Alex Johnson",
          role: "Full Stack Developer",
          company: "TechFlow",
          content:
            "This starter template saved me weeks of setup time. The Supabase integration is flawless, and the UI components are beautiful and easy to customize. Worth every penny!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
        },
        {
          id: 2,
          name: "Sarah Miller",
          role: "Frontend Engineer",
          company: "DesignHub",
          content:
            "I've used many starter templates, but this one stands out for its clean architecture and attention to detail. The TypeScript support is excellent, and the documentation is comprehensive.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
        },
        {
          id: 3,
          name: "Michael Chen",
          role: "Product Manager",
          company: "InnovateLabs",
          content:
            "Our team was able to launch our MVP in record time thanks to this template. The authentication flow and user management features worked right out of the box. Highly recommended!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
        },
      ]}
      trustedCompanies={["Google", "Microsoft", "Airbnb", "Spotify", "Netflix"]}
    />
  )
}
