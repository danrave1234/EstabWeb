import TestimonialV2, {
  type TestimonialV2Item,
} from "@/components/ui/testimonial-v2";

export type TestimonialsV2BlockProps = {
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: TestimonialV2Item[];
};

const FALLBACK_TESTIMONIALS: TestimonialV2Item[] = [
  {
    text: "This platform revolutionized our operations, streamlining finance and inventory. The cloud-based system keeps us productive anywhere.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this solution was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our complete satisfaction.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "The seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface and power.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient and organized.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance remarkably.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
];

export default function TestimonialsV2Block({
  badge,
  title,
  subtitle,
  items,
}: TestimonialsV2BlockProps) {
  const safeItems = Array.isArray(items) && items.length > 0 ? items : FALLBACK_TESTIMONIALS;

  return (
    <div id="testimonials">
      <TestimonialV2
        badge={badge}
        title={title}
        subtitle={subtitle}
        testimonials={safeItems}
      />
    </div>
  );
}
