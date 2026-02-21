"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";

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
          <div className="text-center mb-12 sm:mb-16">
            {title && (
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group flex flex-col bg-background rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <time className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wider">
                  {post.date}
                </time>
                <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                <a
                  href={post.href ?? "#"}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary group/link"
                >
                  {linkText}
                  <ArrowRightIcon weight="duotone" className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
