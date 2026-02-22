import Image from "next/image";
import Reveal from "@/components/shared/Reveal";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type TeamMember = {
  imageUrl: string;
  name: string;
  specialty: string;
  bioUrl?: string;
};

export type TeamGridProps = {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  linkText?: string;
};

export default function TeamGrid({
  title = "Meet Our Team",
  subtitle = "The experts dedicated to your success.",
  members = [],
  linkText = "View Profile",
}: TeamGridProps) {
  if (!members?.length) return null;

  return (
    <Reveal as="section" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <Reveal as="div" className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </Reveal>

        <Reveal as="div" className={`grid ${dynamicGridCols(members.length, 4)} gap-4 sm:gap-8`}>
          {members.map((member, index) => (
            <div key={index} className="group relative flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-lg bg-muted">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  {member.bioUrl && (
                    <a
                      href={member.bioUrl}
                      className="text-white text-sm font-bold flex items-center gap-2"
                    >
                      {linkText} &rarr;
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-primary font-medium text-sm uppercase tracking-widest">
                {member.specialty}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </Reveal>
  );
}
