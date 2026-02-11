"use client";

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
};

export default function TeamGrid({
  title = "Meet Our Team",
  subtitle = "The experts dedicated to your success.",
  members = [],
}: TeamGridProps) {
  if (!members?.length) return null;

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
          {members.map((member, index) => (
            <div key={index} className="group relative flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-lg bg-muted">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  {member.bioUrl && (
                    <a
                      href={member.bioUrl}
                      className="text-white text-sm font-bold flex items-center gap-2"
                    >
                      View Profile &rarr;
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
        </div>
      </div>
    </section>
  );
}
