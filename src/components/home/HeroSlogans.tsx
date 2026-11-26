"use client";

import { useEffect, useState } from "react";

export function HeroSlogans({ slogans, className = "text-white" }: { slogans: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (slogans.length <= 1) return;

    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % slogans.length);
        setVisible(true);
      }, 300);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [slogans.length]);

  return (
    <p
      className={`text-sm font-semibold transition-opacity duration-300 ${className} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {slogans[index]}
    </p>
  );
}
