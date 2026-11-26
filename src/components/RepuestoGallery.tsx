"use client";

import { useState } from "react";
import { FotoProducto } from "./FotoProducto";

export function RepuestoGallery({ images, nombre }: { images: string[]; nombre: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-black/[.08] bg-black/[.02] text-sm text-zinc-400 dark:border-white/[.145] dark:bg-white/[.03]">
        Sin foto
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.145]">
        <FotoProducto src={images[selected]} alt={nombre} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              className={`aspect-square overflow-hidden rounded-md border transition-colors ${
                index === selected
                  ? "border-zinc-950 dark:border-zinc-50"
                  : "border-black/[.08] hover:border-black/[.2] dark:border-white/[.145] dark:hover:border-white/[.3]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
