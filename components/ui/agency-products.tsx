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

  const filteredItems = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const handleAddToCart = (product: ProductItem) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    trackEvent({
      type: "cta_click",
      section_key: "products_agency",
      cta_id: `add_to_cart_${product.id}`,
    });
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
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
              className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-950"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-neutral-500 leading-relaxed max-w-lg"
            >
              {description}
            </motion.p>
          </div>

          {/* Categories Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-neutral-950 text-white shadow-lg"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col h-full bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 hover:border-neutral-200 transition-colors"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                      <Package size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* Overlays/Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.tag && (
                      <Badge className="bg-white/90 backdrop-blur-md text-neutral-950 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm">
                        {product.tag}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-primary text-white border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm">
                        NEW ARRIVAL
                      </Badge>
                    )}
                  </div>

                  {/* Quick Add Button (Desktop) */}
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/20 transition-colors duration-500 flex items-end p-6">
                    <motion.button
                      initial={{ y: 40, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      animate={{ y: 0 }}
                      className="w-full bg-white text-neutral-950 py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500"
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
                <div className="p-6 flex flex-col flex-grow bg-white border-t border-neutral-100">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="size-3 fill-current" />
                      <span className="text-xs font-bold text-neutral-600">{product.rating || "4.8"}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-medium text-neutral-950 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-6 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-950">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-400 line-through font-medium">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-neutral-100 hover:bg-primary hover:text-white transition-colors h-10 w-10 md:hidden"
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
          <div className="h-px w-24 bg-neutral-200" />
          <Button
            variant="link"
            className="text-neutral-950 font-bold tracking-widest uppercase text-xs gap-2 group p-0"
          >
            Explore the full collection
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
