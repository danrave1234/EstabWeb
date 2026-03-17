import { FeaturedSpotlight, type FeaturedSpotlightProps } from "@/components/ui/feature-spotlight";

export type FeatureSpotlightBlockProps = Partial<FeaturedSpotlightProps>;

export default function FeatureSpotlightBlock(props: FeatureSpotlightBlockProps) {
  return (
    <section id="featured-spotlight" className="bg-background">
      <FeaturedSpotlight {...props} />
    </section>
  );
}
