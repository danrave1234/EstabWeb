"use client";

import { useEffect } from "react";

/**
 * ScrollReveal
 * Note: To avoid hydration mismatches, we defer attaching observers until after the
 * window "load" event (or when document is already complete). This prevents the
 * "active" class from being added before React finishes hydrating server markup.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    } as const;

    let observer: IntersectionObserver | null = null;
    const ensureObserver = () => {
      if (!observer) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
            }
          });
        }, observerOptions);
      }
      return observer;
    };

    const updateObservers = () => {
      const obs = ensureObserver();
      const reveals = document.querySelectorAll(".reveal:not([data-reveal-managed])");
      reveals.forEach((el) => {
        obs.observe(el);
      });
    };

    const start = () => {
      // Double RAF to let hydration across nested routes fully settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateObservers();
          // Watch for dynamic changes (important for the configurator)
          const mutationObserver = new MutationObserver(() => {
            updateObservers();
          });
          mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
          });

          // Cleanup
          cleanupFns.push(() => mutationObserver.disconnect());
        });
      });
    };

    const cleanupFns: Array<() => void> = [];

    // Always defer until after load or a short timeout to avoid hydration mismatches
    if (document.readyState === "complete") {
      const t = window.setTimeout(start, 120);
      cleanupFns.push(() => window.clearTimeout(t));
    } else {
      const onLoad = () => {
        const t = window.setTimeout(start, 60);
        cleanupFns.push(() => window.clearTimeout(t));
      };
      window.addEventListener("load", onLoad, { once: true });
      cleanupFns.push(() => window.removeEventListener("load", onLoad));
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}
