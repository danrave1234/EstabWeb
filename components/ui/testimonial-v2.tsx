"use client";

import React from 'react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

export interface TestimonialV2Item {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialV2Props {
  badge?: string;
  title?: string;
  subtitle?: string;
  testimonials: TestimonialV2Item[];
  className?: string;
}

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialV2Item[];
  duration?: number;
}) => {
  return (
    <div className={cn("relative overflow-hidden", props.className)}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="w-full max-w-[17.5rem] rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-neutral-800 dark:bg-neutral-900 sm:max-w-xs md:p-10" 
                >
                  <blockquote className="m-0 p-0 text-left">
                    <p className="m-0 break-words font-normal leading-relaxed text-neutral-600 transition-colors duration-300 dark:text-neutral-400">
                      {text}
                    </p>
                    <footer className="flex items-center gap-3 mt-6">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 group-hover:ring-primary/30 transition-all duration-300 ease-in-out"
                      />
                      <div className="flex flex-col">
                        <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300">
                          {name}
                        </cite>
                        <span className="text-sm leading-5 tracking-tight text-neutral-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export default function TestimonialV2({
  badge = "Testimonials",
  title = "What our users say",
  subtitle = "Discover how thousands of teams streamline their operations with our platform.",
  testimonials,
  className,
}: TestimonialV2Props) {
  
  const colCount = 3;
  const firstColumn = testimonials.filter((_, i) => i % colCount === 0);
  const secondColumn = testimonials.filter((_, i) => i % colCount === 1);
  const thirdColumn = testimonials.filter((_, i) => i % colCount === 2);

  return (
    <section 
      aria-labelledby="testimonials-heading"
      className={cn("bg-transparent py-24 relative overflow-hidden", className)}
    >
      <motion.div 
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          {badge && (
            <div className="flex justify-center">
              <div className="border border-neutral-300 dark:border-neutral-700 py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-400 bg-neutral-100/50 dark:bg-neutral-800/50 transition-colors">
                {badge}
              </div>
            </div>
          )}

          <h2 id="testimonials-heading" className="mt-6 break-words text-center text-4xl font-extrabold tracking-tight text-neutral-900 transition-colors dark:text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-sm break-words text-center text-lg leading-relaxed text-neutral-500 transition-colors dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        <div 
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          {firstColumn.length > 0 && <TestimonialsColumn testimonials={firstColumn} className="w-full max-w-[17.5rem] sm:max-w-xs" duration={15} />}
          {secondColumn.length > 0 && <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />}
          {thirdColumn.length > 0 && <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />}
        </div>
      </motion.div>
    </section>
  );
}
