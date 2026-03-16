import TeamShowcase, {
  type TeamShowcaseMember,
} from "@/components/ui/team-showcase";

export type TeamShowcaseBlockProps = {
  members?: {
    id: string;
    name: string;
    role: string;
    image: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      behance?: string;
    };
  }[];
};

const FALLBACK_MEMBERS: TeamShowcaseMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Director of Photography",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Lead Front-End",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "4",
    name: "David Park",
    role: "Product Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    social: { linkedin: "#" },
  },
  {
    id: "5",
    name: "Alex Kim",
    role: "CTO & Product Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "6",
    name: "Jordan Lee",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
    social: { instagram: "#" },
  },
];

export default function TeamShowcaseBlock({ members }: TeamShowcaseBlockProps) {
  const safeMembers: TeamShowcaseMember[] =
    Array.isArray(members) && members.length > 0
      ? members.map((m, i) => ({
          id: m.id ?? String(i + 1),
          name: m.name ?? `Team Member ${i + 1}`,
          role: m.role ?? "Role",
          image: m.image ?? "",
          social: m.social,
        }))
      : FALLBACK_MEMBERS;

  return (
    <section id="team" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <TeamShowcase members={safeMembers} />
    </section>
  );
}
