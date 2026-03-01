"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { dynamicGridCols } from "@/lib/utils/grid-cols";
import { trackEvent } from "@/components/shared/Analytics";

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  href?: string;
};

export type BlogGridProps = {
  title?: string;
  subtitle?: string;
  posts: BlogPost[];
  linkText?: string;
};

export default function BlogGrid({
  title = "Latest Insights",
  subtitle = "Expert advice and updates from our team.",
  posts = [],
  linkText = "Read Article",
}: BlogGridProps) {
  if (!posts?.length) return null;

  return (
    <section id="blog" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 sm:mb-24">
            {title && (
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${dynamicGridCols(posts.length, 3)} gap-6 sm:gap-10`}>
          {posts.map((post, index) => (
            <article
              key={index}
              className="group flex flex-col bg-background rounded-[2.5rem] border border-border/40 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl backdrop-blur-sm bg-primary/90">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-8 sm:p-10 flex flex-col">
                <time className="text-[10px] sm:text-xs text-primary font-black mb-4 uppercase tracking-[0.3em]">
                  {post.date}
                </time>
                <h3 className="font-serif text-xl sm:text-3xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-lg text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-8 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                <a
                  href={post.href ?? "#"}
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'blog', cta_id: `blog_post_${index}` })}
                  className="inline-flex items-center gap-3 text-sm sm:text-base font-black text-primary group/link uppercase tracking-widest"
                >
                  {linkText}
                  <ArrowRightIcon weight="bold" className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/link:translate-x-2" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
