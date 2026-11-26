"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Categoria, Marca, Modelo } from "@/types/catalogo";

const selectClass =
  "h-12 w-full rounded-xl border border-black/[.12] bg-white px-4 text-sm text-primary-dark outline-none transition-colors focus:border-accent disabled:opacity-50";

export function HeroFinder({
  marcas,
  modelos,
  categorias,
}: {
  marcas: Marca[];
  modelos: Modelo[];
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [categoria, setCategoria] = useState("");

  const modelosDeLaMarca = marca ? modelos.filter((m) => m.marcaId === marca) : [];

  function buscar(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (marca) params.set("marca", marca);
    if (modelo) params.set("modelo", modelo);
    if (categoria) params.set("categoria", categoria);
    const query = params.toString();
    router.push(query ? `/repuestos?${query}` : "/repuestos");
  }

  return (
    <form
      onSubmit={buscar}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-black/25 ring-1 ring-black/[.04] sm:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-1.5 bg-accent" aria-hidden />
      <h2 className="text-xl font-bold text-primary-dark">Encuentra tu repuesto</h2>
      <p className="mt-1 text-sm text-zinc-500">Elige tu camión y te mostramos lo que le sirve.</p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Marca</span>
          <select
            value={marca}
            onChange={(e) => {
              setMarca(e.target.value);
              setModelo("");
            }}
            className={selectClass}
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Modelo</span>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            disabled={!marca || modelosDeLaMarca.length === 0}
            className={selectClass}
          >
            <option value="">
              {!marca
                ? "Primero elige una marca"
                : modelosDeLaMarca.length === 0
                  ? "Esta marca no tiene modelos"
                  : "Todos los modelos"}
            </option>
            {modelosDeLaMarca.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Categoría</span>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={selectClass}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        Buscar repuestos
      </button>
    </form>
  );
}
