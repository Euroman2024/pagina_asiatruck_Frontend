"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import type { Repuesto } from "@/types/catalogo";

export default function AdminRepuestosPage() {
  const [items, setItems] = useState<Repuesto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Repuesto | null>(null);

  async function load() {
    try {
      const data = await api.get<Repuesto[]>("/repuestos");
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al cargar");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function eliminar(item: Repuesto) {
    await api.delete(`/repuestos/${item.id}`);
    setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-dark">Repuestos</h1>
        <Link
          href="/admin/repuestos/nuevo"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Nuevo repuesto
        </Link>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {!items ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">No hay repuestos todavía.</p>
      ) : (
        <ul className="mt-6 divide-y divide-black/[.08] dark:divide-white/[.145]">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-black/[.02] dark:bg-white/[.03]">
                  {item.imagenes[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imagenes[0]}
                      alt={item.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.sku}</p>
                  <span className="text-zinc-950 dark:text-zinc-50">{item.nombre}</span>
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">${Number(item.precio).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <Link
                  href={`/admin/repuestos/${item.id}/editar`}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setAEliminar(item)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteModal
        open={aEliminar !== null}
        titulo="¿Eliminar repuesto?"
        nombre={aEliminar?.nombre ?? ""}
        detalle={aEliminar ? `SKU ${aEliminar.sku}. También se quitan sus modelos compatibles.` : undefined}
        onConfirm={() => eliminar(aEliminar!)}
        onClose={() => setAEliminar(null)}
      />
    </div>
  );
}
