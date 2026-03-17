import VerticalTabs from "@/components/ui/vertical-tabs";

type VerticalTabsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type VerticalTabsBlockProps = {
  title?: string;
  subtitle?: string;
  services?: VerticalTabsItem[];
};

const DEFAULT_SERVICES = [
  {
    id: "01",
    title: "Web Design",
    description: "Creating beautiful, functional, and user-centric digital experiences.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
  {
    id: "02",
    title: "Framer Development",
    description: "Building high-performance, animated websites with Framer.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
  },
  {
    id: "03",
    title: "Branding",
    description: "Defining your brand's visual identity and voice for a lasting impression.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  },
];

export default function VerticalTabsBlock({
  title = "How I can help you",
  subtitle = "SERVICES",
  services = DEFAULT_SERVICES,
}: VerticalTabsBlockProps) {
  return (
    <VerticalTabs
      title={title}
      subtitle={subtitle}
      services={services}
    />
  );
}
