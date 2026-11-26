"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Carousel({
  children,
  autoPlay = false,
  intervalMs = 3000,
  scrollAmount = 320,
}: {
  children: ReactNode;
  autoPlay?: boolean;
  intervalMs?: number;
  scrollAmount?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByAmount(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  useEffect(() => {
    if (!autoPlay || paused) return;

    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoPlay, paused, intervalMs, scrollAmount]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollByAmount(-scrollAmount)}
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-black/[.08] bg-background p-2 text-foreground shadow-sm transition-colors hover:bg-black/[.04] md:flex dark:border-white/[.145] dark:hover:bg-white/[.08]"
      >
        <span className="sr-only">Anterior</span>‹
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => scrollByAmount(scrollAmount)}
        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-black/[.08] bg-background p-2 text-foreground shadow-sm transition-colors hover:bg-black/[.04] md:flex dark:border-white/[.145] dark:hover:bg-white/[.08]"
      >
        <span className="sr-only">Siguiente</span>›
      </button>
    </div>
  );
}
