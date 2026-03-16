"use client";
import Reveal from "@/components/shared/Reveal";

type Metric = {
  label: string;
  value: string;
};

type CaseStudyDetailProps = {
  title?: string;
  subtitle?: string;
  clientName?: string;
  industry?: string;
  imageUrl?: string;
  problem?: string;
  solution?: string;
  results?: string;
  metrics?: Metric[];
};

export default function CaseStudyDetail({
  title = "Case Study",
  subtitle = "A detailed look at how we delivered measurable results",
  clientName = "Client",
  industry = "Industry",
  imageUrl,
  problem = "The client was struggling with inefficiencies in their existing workflow, leading to lost time and revenue.",
  solution = "We designed and implemented a tailored solution that addressed the root cause, streamlined operations, and aligned with the client's long-term goals.",
  results = "Within 90 days, the client saw a significant reduction in overhead and a marked improvement in customer satisfaction scores.",
  metrics = [
    { label: "Time Saved", value: "40%" },
    { label: "Revenue Growth", value: "2×" },
    { label: "Client Satisfaction", value: "98%" },
  ],
}: CaseStudyDetailProps) {
  return (
    <Reveal as="section" id="case-study-detail" className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {clientName} &bull; {industry}
          </p>
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Optional featured image */}
          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl border border-border">
              <img
                src={imageUrl}
                alt={title}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          )}

          {/* Metrics row */}
          {metrics && metrics.length > 0 && (
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-center"
                >
                  <p className="text-2xl font-black text-primary sm:text-3xl">{m.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Problem / Solution / Results */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/10 p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                The Problem
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{problem}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Our Solution
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{solution}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                The Results
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{results}</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
