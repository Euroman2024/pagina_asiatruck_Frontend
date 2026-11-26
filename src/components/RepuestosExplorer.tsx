"use client";

import { useMemo, useState } from "react";
import { RepuestoCard } from "./RepuestoCard";
import { esDeMarca } from "@/lib/catalogo";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

type Orden = "recientes" | "precio-asc" | "precio-desc" | "nombre";

const inputClass =
  "w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-primary-dark outline-none transition-colors focus:border-accent";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function RepuestosExplorer({
  repuestos,
  categorias,
  marcas,
  modelos,
  inicial = {},
}: {
  repuestos: Repuesto[];
  /** Si no se pasa, se oculta el filtro de categoría (p. ej. en la página de una categoría) */
  categorias?: Categoria[];
  /** Si no se pasa, se oculta el filtro de marca (p. ej. en la página de una marca) */
  marcas?: Marca[];
  modelos: Modelo[];
  inicial?: { q?: string; categoria?: string; marca?: string; modelo?: string };
}) {
  const [busqueda, setBusqueda] = useState(inicial.q ?? "");
  const [categoriaId, setCategoriaId] = useState(inicial.categoria ?? "");
  const [marcaId, setMarcaId] = useState(inicial.marca ?? "");
  const [modeloId, setModeloId] = useState(inicial.modelo ?? "");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [orden, setOrden] = useState<Orden>("recientes");

  const modelosDeLaMarca = marcaId ? modelos.filter((m) => m.marcaId === marcaId) : modelos;

  function cambiarMarca(id: string) {
    setMarcaId(id);
    if (id && modeloId && !modelos.some((m) => m.id === modeloId && m.marcaId === id)) {
      setModeloId("");
    }
  }

  const hayFiltros =
    busqueda !== "" ||
    categoriaId !== "" ||
    marcaId !== "" ||
    modeloId !== "" ||
    precioMin !== "" ||
    precioMax !== "" ||
    soloDisponibles;

  const resultados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    const min = precioMin === "" ? -Infinity : Number(precioMin);
    const max = precioMax === "" ? Infinity : Number(precioMax);

    const filtrados = repuestos.filter((r) => {
      const precio = Number(r.precio);
      if (precio < min || precio > max) return false;
      if (soloDisponibles && r.stock === 0) return false;
      if (categoriaId && r.categoriaId !== categoriaId) return false;
      const compatibles = r.compatibilidad ?? [];
      if (marcaId && !esDeMarca(r, marcaId)) return false;
      if (modeloId && !compatibles.some((c) => c.modeloId === modeloId)) return false;
      if (!termino) return true;
      const modelosTexto = compatibles.map((c) => `${c.modelo.marca?.nombre ?? ""} ${c.modelo.nombre}`).join(" ");
      const marcasTexto = (r.marcas ?? []).map((m) => m.nombre).join(" ");
      const texto = normalizar(
        `${r.nombre} ${r.sku} ${r.descripcion ?? ""} ${r.categoria?.nombre ?? ""} ${marcasTexto} ${modelosTexto}`,
      );
      return texto.includes(termino);
    });

    return filtrados.sort((a, b) => {
      switch (orden) {
        case "precio-asc":
          return Number(a.precio) - Number(b.precio);
        case "precio-desc":
          return Number(b.precio) - Number(a.precio);
        case "nombre":
          return a.nombre.localeCompare(b.nombre, "es");
        default:
          return new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime();
      }
    });
  }, [repuestos, busqueda, categoriaId, marcaId, modeloId, precioMin, precioMax, soloDisponibles, orden]);

  function limpiar() {
    setBusqueda("");
    setCategoriaId("");
    setMarcaId("");
    setModeloId("");
    setPrecioMin("");
    setPrecioMax("");
    setSoloDisponibles(false);
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="shrink-0 lg:w-64">
        <div className="space-y-5 rounded-xl border border-black/[.08] bg-surface p-5 lg:sticky lg:top-[128px]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-primary-dark">Filtros</h2>
            {hayFiltros ? (
              <button
                type="button"
                onClick={limpiar}
                className="text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Limpiar
              </button>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Buscar</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, SKU o descripción"
              className={inputClass}
            />
          </label>

          {categorias ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Categoría</span>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className={inputClass}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {marcas ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Marca</span>
              <select value={marcaId} onChange={(e) => cambiarMarca(e.target.value)} className={inputClass}>
                <option value="">Todas las marcas</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Modelo</span>
            <select
              value={modeloId}
              onChange={(e) => setModeloId(e.target.value)}
              disabled={modelosDeLaMarca.length === 0}
              className={`${inputClass} disabled:opacity-50`}
            >
              <option value="">
                {modelosDeLaMarca.length === 0 ? "Esta marca no tiene modelos" : "Todos los modelos"}
              </option>
              {modelosDeLaMarca.map((m) => (
                <option key={m.id} value={m.id}>
                  {marcaId || !marcas ? m.nombre : `${m.marca?.nombre ?? ""} ${m.nombre}`.trim()}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Precio (USD)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                placeholder="Mín."
                aria-label="Precio mínimo"
                className={inputClass}
              />
              <span className="text-zinc-400">–</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                placeholder="Máx."
                aria-label="Precio máximo"
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Solo con stock disponible
          </label>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-600">
            <span className="font-semibold text-primary-dark">{resultados.length}</span>{" "}
            {resultados.length === 1 ? "repuesto" : "repuestos"}
            {hayFiltros ? ` de ${repuestos.length}` : ""}
          </p>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            Ordenar por
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="rounded-lg border border-black/[.12] bg-white px-3 py-1.5 text-sm text-primary-dark outline-none focus:border-accent"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A-Z)</option>
            </select>
          </label>
        </div>

        {resultados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
            <p className="font-semibold text-primary-dark">
              {repuestos.length === 0
                ? "Todavía no hay repuestos cargados."
                : "No encontramos repuestos con esos filtros."}
            </p>
            {hayFiltros ? (
              <button
                type="button"
                onClick={limpiar}
                className="mt-3 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {resultados.map((repuesto) => (
              <li key={repuesto.id}>
                <RepuestoCard repuesto={repuesto} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
