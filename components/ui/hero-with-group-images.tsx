import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface HeroWithGroupImagesProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  className?: string;
}

function HeroWithGroupImages({
  badge = "We're live!",
  title = "This is the start of something!",
  description = "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  primaryButtonText = "Sign up here",
  primaryButtonHref = "#",
  secondaryButtonText = "Jump on a call",
  secondaryButtonHref = "#",
  image1 = "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2024&auto=format&fit=crop",
  image2 = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  image3 = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
  className,
}: HeroWithGroupImagesProps) {
  return (
    <div className={cn("w-full py-20 lg:py-40 bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            {badge && (
              <div>
                <Badge variant="outline">{badge}</Badge>
              </div>
            )}
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular text-foreground">
                {title}
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                {description}
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button asChild size="lg" className="gap-4" variant="outline">
                <a href={secondaryButtonHref}>
                  {secondaryButtonText} <PhoneCall className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="lg" className="gap-4">
                <a href={primaryButtonHref}>
                  {primaryButtonText} <MoveRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-muted rounded-md aspect-square overflow-hidden shadow-xl">
              <img src={image1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="bg-muted rounded-md row-span-2 overflow-hidden shadow-xl">
              <img src={image2} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="bg-muted rounded-md aspect-square overflow-hidden shadow-xl">
              <img src={image3} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeroWithGroupImages };
