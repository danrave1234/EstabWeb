"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    // Initial check for sections
    const updateObservers = () => {
      const sections = document.querySelectorAll("section, .reveal");
      sections.forEach((section) => {
        if (!section.classList.contains("reveal")) {
          section.classList.add("reveal");
        }
        observer.observe(section);
      });
    };

    updateObservers();
    
    // Watch for dynamic changes (important for the configurator)
    const mutationObserver = new MutationObserver(() => {
      updateObservers();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
