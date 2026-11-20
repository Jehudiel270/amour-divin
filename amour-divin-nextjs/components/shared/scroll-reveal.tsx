"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prepare = () => {
      const candidates = document.querySelectorAll(
        "main section:not([data-reveal-ready]), main h1:not([data-reveal-ready]), main h2:not([data-reveal-ready]), main details:not([data-reveal-ready]), main article:not([data-reveal-ready]), main .grid > div:not([data-reveal-ready]), main .ad-card:not([data-reveal-ready])"
      );

      candidates.forEach((element, index) => {
        const node = element as HTMLElement;
        if (node.closest("nav, footer")) return;
        node.dataset.revealReady = "true";
        node.dataset.reveal = "up";
        node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      });
    };

    prepare();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const observe = () => {
      document.querySelectorAll<HTMLElement>('main [data-reveal="up"]:not([data-reveal-visible])').forEach((element) => {
        observer.observe(element);
      });
    };

    observe();
    const mutationObserver = new MutationObserver(() => {
      prepare();
      observe();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
