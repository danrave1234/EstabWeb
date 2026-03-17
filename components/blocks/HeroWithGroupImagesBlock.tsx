import { HeroWithGroupImages, type HeroWithGroupImagesProps } from "@/components/ui/hero-with-group-images";

export type HeroWithGroupImagesBlockProps = Partial<HeroWithGroupImagesProps>;

export default function HeroWithGroupImagesBlock(props: HeroWithGroupImagesBlockProps) {
  return (
    <section id="hero-group-images">
      <HeroWithGroupImages {...props} />
    </section>
  );
}
