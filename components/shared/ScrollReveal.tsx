"use client";

import { useEffect } from "react";

/**
 * ScrollReveal
 * Note: To avoid hydration mismatches, we use an internal WeakSet to track
 * which elements are being observed, rather than adding attributes or classes
 * to the DOM. This prevents React from seeing any mismatches during hydration.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    } as const;

    let observer: IntersectionObserver | null = null;
    const observedElements = new WeakSet<Element>();
    const managedElements = new Set<Element>();

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
      // Find all elements with .reveal class
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((el) => {
        // If we haven't already attached an observer to this element
        if (!observedElements.has(el)) {
          observedElements.add(el);
          managedElements.add(el);
          obs.observe(el);
        }
      });
    };

    const start = () => {
      // Defer slightly to ensure initial hydration is likely finished
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
          });

          // Cleanup
          cleanupFns.push(() => mutationObserver.disconnect());
        });
      });
    };

    const cleanupFns: Array<() => void> = [];

    // Always defer until after page load + idle period
    const scheduleStart = () => {
      const deferStart = () => {
        const t = window.setTimeout(start, 300);
        cleanupFns.push(() => window.clearTimeout(t));
      };

      if (typeof window.requestIdleCallback === "function") {
        const idleId = window.requestIdleCallback(deferStart, { timeout: 1500 });
        cleanupFns.push(() => window.cancelIdleCallback(idleId));
      } else {
        const t = window.setTimeout(deferStart, 450);
        cleanupFns.push(() => window.clearTimeout(t));
      }
    };

    if (document.readyState === "complete") {
      scheduleStart();
    } else {
      const onLoad = () => {
        scheduleStart();
      };
      window.addEventListener("load", onLoad, { once: true });
      cleanupFns.push(() => window.removeEventListener("load", onLoad));
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      if (observer) observer.disconnect();
      // We don't remove "active" class on cleanup to avoid layout shifts,
      // but we do clear our tracking sets.
      managedElements.clear();
    };
  }, []);

  return null;
}
