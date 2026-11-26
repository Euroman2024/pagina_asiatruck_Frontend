"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import type { Marca } from "@/types/catalogo";

export function MarcasDropdown({ marcas, className = "" }: { marcas: Marca[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative h-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex h-full items-center gap-1.5 ${className} ${open ? "bg-white/10 text-white" : ""}`}
      >
        Marcas
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 w-60 overflow-hidden rounded-b-xl border border-t-0 border-black/[.08] bg-white py-2 shadow-xl">
          <p className="px-4 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Repuestos por marca
          </p>
          {marcas.map((marca) => (
            <Link
              key={marca.id}
              href={`/marcas/${marca.id}`}
              onClick={() => setOpen(false)}
              className="block border-l-4 border-transparent px-4 py-2 text-sm font-medium text-primary-dark transition-colors hover:border-accent hover:bg-surface hover:text-accent"
            >
              {marca.nombre}
            </Link>
          ))}
          <div className="mt-1 border-t border-black/[.08] pt-1">
            <Link
              href="/marcas"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-surface"
            >
              Ver todas las marcas →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
