"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { ShoppingCartIcon } from "@phosphor-icons/react";

export type Product = {
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  stock?: number | string;
  tag?: string;
  isPopular?: boolean;
};

export type ProductGridProps = {
  title?: string;
  subtitle?: string;
  items: Product[];
  addToCartLabel?: string;
  outOfStockLabel?: string;
  currencySymbol?: string;
};

export default function ProductGrid({
  title = "Our Products",
  subtitle = "Quality products delivered to your doorstep.",
  items = [],
  addToCartLabel = "Add to Cart",
  outOfStockLabel = "Out of Stock",
  currencySymbol = "₱",
}: ProductGridProps) {
  return (
    <section id="products" className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((product, index) => {
            const hasStock = product.stock === undefined || 
                           (typeof product.stock === "number" && product.stock > 0) ||
                           (typeof product.stock === "string" && product.stock.toLowerCase() !== "out of stock");

            return (
              <div
                key={index}
                className={`group flex flex-col bg-background rounded-2xl border transition-all duration-300 ${
                  product.isPopular
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : "border-border shadow-sm hover:shadow-md hover:border-primary/30"
                }`}
              >
                <div className="relative h-56 w-full bg-muted flex items-center justify-center overflow-hidden rounded-t-2xl">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : product.icon ? (
                    <div className="w-16 h-16 text-primary opacity-20">
                      <DynamicIcon name={product.icon} className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-xs font-medium">No Image Available</div>
                  )}
                  
                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      {product.tag}
                    </div>
                  )}
                  
                  {!hasStock && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                        {outOfStockLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-4 flex-grow">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-primary">
                        {product.price.includes(currencySymbol) 
                          ? product.price 
                          : `${currencySymbol}${product.price}`}
                      </p>
                      {product.stock !== undefined && hasStock && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!hasStock}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        hasStock
                          ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground shadow-sm active:scale-[0.98]"
                          : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      <ShoppingCartIcon weight="bold" className="w-4 h-4" />
                      {addToCartLabel}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
