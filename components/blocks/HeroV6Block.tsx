import { HeroV6, type HeroV6Props } from "@/components/ui/hero-v6";

export type HeroV6BlockProps = Partial<HeroV6Props>;

export default function HeroV6Block(props: HeroV6BlockProps) {
  return (
    <section id="hero-v6">
      <HeroV6 {...props} />
    </section>
  );
}
