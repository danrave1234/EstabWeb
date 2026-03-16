"use client";

import Reveal from "@/components/shared/Reveal";

type GymResultStory = {
  name: string;
  result: string;
  timeframe?: string;
  quote?: string;
  beforeImage?: string;
  afterImage?: string;
};

type GymResultsStoriesProps = {
  title?: string;
  subtitle?: string;
  stories?: GymResultStory[];
};

export default function GymResultsStories({
  title = "Member Results",
  subtitle = "Real stories from members who committed to consistent training and coaching.",
  stories = [],
}: GymResultsStoriesProps) {
  return (
    <Reveal as="section" id="results" className="border-b border-border bg-muted/10">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {stories.map((story, idx) => (
            <article key={`${story.name}-${idx}`} className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  {story.beforeImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.beforeImage} alt={`${story.name} before`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Before</div>
                  )}
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  {story.afterImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.afterImage} alt={`${story.name} after`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">After</div>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-black text-foreground">{story.name}</h3>
                <p className="text-sm font-semibold text-primary">{story.result}</p>
                {story.timeframe && <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{story.timeframe}</p>}
                {story.quote && <p className="text-sm leading-relaxed text-muted-foreground">"{story.quote}"</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
