import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4"

type Gallery4BlockProps = {
  title?: string
  description?: string
  items?: Gallery4Item[]
}

const FALLBACK_ITEMS: Gallery4Item[] = [
  {
    id: "renovation-1",
    title: "Modern Kitchen Renovation",
    description: "A complete redesign focused on function, durability, and clean finishes.",
    href: "#contact",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1080&q=80",
  },
  {
    id: "renovation-2",
    title: "Small Business Fit-Out",
    description: "Retail interior upgrade delivered on schedule with minimal downtime.",
    href: "#contact",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1080&q=80",
  },
  {
    id: "renovation-3",
    title: "Residential Exterior Refresh",
    description: "Facade improvements that boosted curb appeal and long-term protection.",
    href: "#contact",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80",
  },
  {
    id: "renovation-4",
    title: "Office Interior Revamp",
    description: "Workspace redesign with practical storage and cleaner circulation.",
    href: "#contact",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1080&q=80",
  },
  {
    id: "renovation-5",
    title: "Outdoor Patio Upgrade",
    description: "Durable outdoor improvements built for comfort and long-term use.",
    href: "#contact",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1080&q=80",
  },
]

export default function Gallery4Block({
  title = "Project Highlights",
  description = "A quick look at recent builds, upgrades, and client results.",
  items,
}: Gallery4BlockProps) {
  const safeItems = Array.isArray(items) && items.length > 0 ? items : FALLBACK_ITEMS
  return <Gallery4 title={title} description={description} items={safeItems} />
}
