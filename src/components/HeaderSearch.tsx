"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function HeaderSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function buscar(e: FormEvent) {
    e.preventDefault();
    const termino = q.trim();
    router.push(termino ? `/repuestos?q=${encodeURIComponent(termino)}` : "/repuestos");
  }

  return (
    <form role="search" onSubmit={buscar} className={`relative ${className}`}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca por repuesto, SKU o modelo de camión…"
        aria-label="Buscar repuestos"
        className="h-11 w-full rounded-full border-2 border-transparent bg-white pl-5 pr-16 text-sm text-primary-dark shadow-inner outline-none transition-colors placeholder:text-zinc-500 focus:border-white"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1 top-1 flex h-9 w-12 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  );
}
