"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { ImagePicker } from "./ImagePicker";
import { ModelosCompatiblesPicker } from "./ModelosCompatiblesPicker";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

// Con el sistema de proformas conectado, el stock lo controla su kárdex: aquí es solo de lectura
const STOCK_DESDE_PROFORMAS = process.env.NEXT_PUBLIC_STOCK_DESDE_PROFORMAS === "1";

export function RepuestoForm({
  categorias,
  marcas,
  modelos,
  id,
  initial,
}: {
  categorias: Categoria[];
  marcas: Marca[];
  modelos: Modelo[];
  id?: string;
  initial?: Repuesto;
}) {
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [precio, setPrecio] = useState(initial?.precio ?? "");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "0");
  const [imagenes, setImagenes] = useState<string[]>(initial?.imagenes ?? []);
  const [categoriaId, setCategoriaId] = useState(initial?.categoriaId ?? categorias[0]?.id ?? "");
  const [marcaIds, setMarcaIds] = useState<string[]>(initial?.marcas?.map((m) => m.id) ?? []);
  const [modeloIds, setModeloIds] = useState<string[]>(
    initial?.compatibilidad?.map((c) => c.modeloId) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        sku,
        nombre,
        descripcion: descripcion || undefined,
        precio: Number(precio),
        ...(STOCK_DESDE_PROFORMAS ? {} : { stock: Number(stock) }),
        imagenes,
        categoriaId,
        marcaIds,
        modeloIds,
      };
      type Respuesta = { sincronizacionProformas?: { ok: boolean; error?: string } };
      const respuesta = id
        ? await api.patch<Respuesta>(`/repuestos/${id}`, payload)
        : await api.post<Respuesta>("/repuestos", payload);
      if (respuesta?.sincronizacionProformas && !respuesta.sincronizacionProformas.ok) {
        // Quedó guardado en la web, pero proformas no lo recibió: avisar en vez de salir
        setError(
          `Se guardó en la página web, pero no se pudo actualizar el sistema de proformas: ${respuesta.sincronizacionProformas.error}. Vuelve a guardar para reintentar.`,
        );
        setSubmitting(false);
        return;
      }
      router.push("/admin/repuestos");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar");
      setSubmitting(false);
    }
  }

  const inputClass =
    "rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.2] dark:text-zinc-50 dark:focus:border-zinc-50";
  const seccionClass = "flex flex-col gap-4 rounded-xl border border-black/[.08] p-5";
  const tituloSeccion = "text-sm font-bold uppercase tracking-wide text-primary-dark";

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark">
        {id ? "Editar repuesto" : "Nuevo repuesto"}
      </h1>

      {categorias.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          Primero necesitas crear al menos una categoría.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {/* En pantallas anchas: datos e imágenes a la izquierda, compatibilidad a la derecha */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            <div className="flex flex-col gap-6">
              <section className={seccionClass}>
                <h2 className={tituloSeccion}>Datos del repuesto</h2>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">SKU</span>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className={inputClass}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Categoría</span>
                    <select
                      required
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      className={inputClass}
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id} className="text-zinc-950">
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Nombre</span>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Descripción</span>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Precio</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      className={inputClass}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Stock</span>
                    <input
                      type="number"
                      min="0"
                      required={!STOCK_DESDE_PROFORMAS}
                      disabled={STOCK_DESDE_PROFORMAS}
                      value={STOCK_DESDE_PROFORMAS && !id ? "0" : stock}
                      onChange={(e) => setStock(e.target.value)}
                      className={`${inputClass} disabled:bg-zinc-100 disabled:text-zinc-500`}
                    />
                    {STOCK_DESDE_PROFORMAS && (
                      <span className="text-xs text-zinc-500">
                        Lo controla el sistema de proformas (ingresos y egresos del kárdex).
                      </span>
                    )}
                  </label>
                </div>
              </section>

              <section className={seccionClass}>
                <h2 className={tituloSeccion}>Imágenes</h2>
                <ImagePicker images={imagenes} onChange={setImagenes} />
              </section>
            </div>

            <section className={seccionClass}>
              <h2 className={tituloSeccion}>Compatibilidad</h2>

              <div className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Marcas</span>
                <span className="text-xs text-zinc-500">
                  Selecciona las marcas de camión a las que sirve este repuesto. Así aparece al filtrar por marca.
                </span>
                {marcas.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Todavía no hay marcas cargadas.{" "}
                    <Link href="/admin/marcas/nuevo" className="font-semibold text-accent hover:text-accent-hover">
                      Crear una marca
                    </Link>
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 rounded-lg border border-black/[.12] p-3">
                    {marcas.map((marca) => {
                      const activo = marcaIds.includes(marca.id);
                      return (
                        <label
                          key={marca.id}
                          className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            activo
                              ? "border-accent bg-accent/10 font-semibold text-primary-dark"
                              : "border-black/[.12] text-zinc-600 hover:border-accent/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={activo}
                            onChange={() =>
                              setMarcaIds(activo ? marcaIds.filter((m) => m !== marca.id) : [...marcaIds, marca.id])
                            }
                            className="h-3.5 w-3.5 accent-[var(--accent)]"
                          />
                          {marca.nombre}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Modelos compatibles (opcional)</span>
                <span className="text-xs text-zinc-500">
                  Si sirve solo para ciertos modelos, márcalos. Así aparece también al filtrar por modelo.
                </span>
                <ModelosCompatiblesPicker modelos={modelos} seleccionados={modeloIds} onChange={setModeloIds} />
              </div>
            </section>
          </div>

          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-fit rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      )}
    </div>
  );
}
