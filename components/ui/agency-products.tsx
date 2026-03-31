"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  ArrowRight, 
  Plus, 
  Tag as TagIcon, 
  Package, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/components/shared/Analytics";
import { cn } from "@/lib/utils";

export type ProductItem = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  image: string;
  category: string;
  tag?: string;
  rating?: number;
  isNew?: boolean;
  inStock?: boolean;
};

export type AgencyProductGridProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  items: ProductItem[];
  categories?: string[];
  ctaText?: string;
  onAddToCart?: (product: ProductItem) => void;
};

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export default function AgencyProductGrid({
  title = "Premium Collection",
  subtitle = "SHOP THE BEST",
  description = "Curated products designed for those who value quality and craftsmanship.",
  items = [],
  categories = ["All", "Essentials", "Premium", "Limited"],
  ctaText = "Add to Cart",
  onAddToCart,
}: AgencyProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const normalizedCategories = categories.map((category) => normalizeText(category));

  const categoryKeyCounts = normalizedCategories.reduce<Record<string, number>>((counts, normalizedCategory) => {
    const categoryIdentifier = normalizedCategory || "__blank__";
    counts[categoryIdentifier] = (counts[categoryIdentifier] ?? 0) + 1;
    return counts;
  }, {});

  const productIdCounts = items.reduce<Record<string, number>>((counts, item) => {
    const normalizedId = normalizeText(item.id);
    const productIdentifier = normalizedId || "__blank__";
    counts[productIdentifier] = (counts[productIdentifier] ?? 0) + 1;
    return counts;
  }, {});

  const getCategoryKey = (category: string, index: number) => {
    const normalizedCategory = normalizeText(category);
    const categoryIdentifier = normalizedCategory || "__blank__";

    if (normalizedCategory && categoryKeyCounts[categoryIdentifier] === 1) {
      return normalizedCategory;
    }

    return `${normalizedCategory || "category"}-${index}`;
  };

  const getProductKey = (product: ProductItem, index: number) => {
    const normalizedId = normalizeText(product.id);

    if (normalizedId && productIdCounts[normalizedId] === 1) {
      return normalizedId;
    }

    const fallbackParts = [
      normalizedId,
      normalizeText(product.name),
      normalizeText(product.category),
      normalizeText(product.price),
      normalizeText(product.image),
    ].filter(Boolean);

    return fallbackParts.length > 0
      ? `${fallbackParts.join("-")}-${index}`
      : `product-${index}`;
  };

  const filteredItems = items.flatMap((item, index) =>
    activeCategory === "All" || normalizeText(item.category) === activeCategory
      ? [{ product: item, productKey: getProductKey(item, index) }]
      : []
  );

  const handleAddToCart = (product: ProductItem) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    trackEvent({
      type: "cta_click",
      section_key: "products_agency",
      cta_id: `add_to_cart_${normalizeText(product.id) || "product"}`,
    });
  };

  return (
    <section className="overflow-hidden bg-background py-24 text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-[0.2em] text-sm uppercase block"
            >
              {subtitle}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-medium tracking-tight text-foreground md:text-5xl"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              {description}
            </motion.p>
          </div>

          {/* Categories Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 md:justify-end"
          >
            {normalizedCategories.map((category, index) => (
              <button
                key={getCategoryKey(category, index)}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map(({ product, productKey }, index) => (
              <motion.div
                key={productKey}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/30"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                      <Package size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* Overlays/Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.tag && (
                      <Badge className="rounded-full border-none bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-md">
                        {product.tag}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="rounded-full border-none bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                        NEW ARRIVAL
                      </Badge>
                    )}
                  </div>

                  {/* Quick Add Button (Desktop) */}
                  <div className="absolute inset-0 flex items-end bg-foreground/0 p-6 transition-colors duration-500 group-hover:bg-foreground/12">
                    <motion.button
                      initial={{ y: 40, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      animate={{ y: 0 }}
                      className="flex w-full translate-y-20 items-center justify-center gap-2 rounded-2xl bg-background py-4 text-sm font-bold text-foreground shadow-xl transition-transform duration-500 group-hover:translate-y-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="size-4" />
                      {ctaText}
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col border-t border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="size-3 fill-current" />
                      <span className="text-xs font-bold text-muted-foreground">{product.rating || "4.8"}</span>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-medium text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  
                  <p className="mb-6 flex-grow line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm font-medium text-muted-foreground/70 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground md:hidden"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer/Explore */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-border" />
          <Button
            variant="link"
            className="group gap-2 p-0 text-xs font-bold uppercase tracking-widest text-foreground"
          >
            Explore the full collection
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
