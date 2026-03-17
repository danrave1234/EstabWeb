"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  date: string;
  author: string;
  readingTime?: string;
  href?: string;
}

export interface AgencyBlogProps {
  title?: string;
  subtitle?: string;
  description?: string;
  posts?: BlogPost[];
  ctaText?: string;
  onCtaClick?: () => void;
  featuredPostId?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Digital Experiences in 2026",
    excerpt: "How AI and immersive technologies are reshaping the way we interact with brands and digital products.",
    category: "Insights",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    date: "Mar 15, 2026",
    author: "Alex Rivera",
    readingTime: "5 min read",
  },
  {
    id: "2",
    title: "Mastering Minimalist Design Systems",
    excerpt: "A deep dive into creating scalable, clean, and functional design systems for modern agencies.",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=1000&auto=format&fit=crop",
    date: "Mar 12, 2026",
    author: "Sarah Chen",
    readingTime: "8 min read",
  },
  {
    id: "3",
    title: "Why Speed is the Ultimate Feature",
    excerpt: "Exploring the technical and psychological impact of performance in modern web applications.",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    date: "Mar 10, 2026",
    author: "Marc Santos",
    readingTime: "6 min read",
  },
];

export function AgencyBlog({
  title = "Our Latest Insights & Stories",
  subtitle = "JOURNAL",
  description = "Stay updated with our latest thoughts on design, technology, and the future of business.",
  posts = DEFAULT_POSTS,
  ctaText = "View All Posts",
  onCtaClick,
  featuredPostId,
}: AgencyBlogProps) {
  const featuredPost = posts.find(p => p.id === featuredPostId) || posts[0];
  const otherPosts = posts.filter(p => p.id !== (featuredPostId || posts[0]?.id));

  return (
    <section className="relative w-full py-20 md:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="space-y-6 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-primary"
            >
              {subtitle}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1]"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={onCtaClick}
              variant="outline"
              className="group h-14 px-8 rounded-full text-base font-medium transition-all duration-300"
            >
              {ctaText}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-12 group cursor-pointer"
            >
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] bg-muted mb-8">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-border/50">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4">
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col md:flex-row lg:flex-col gap-6 lg:items-end justify-between h-full pt-2">
                  <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span>{featuredPost.date}</span>
                    </div>
                    {featuredPost.readingTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span>{featuredPost.readingTime}</span>
                      </div>
                    )}
                  </div>
                  <div className="size-14 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-45">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secondary Posts */}
          {otherPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="lg:col-span-6 group cursor-pointer"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] bg-muted mb-8">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-border/50">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 px-4">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="size-1 bg-primary rounded-full" />
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                  {post.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="pt-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-foreground group-hover:text-primary transition-colors">
                  Read Article
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AgencyBlog;
