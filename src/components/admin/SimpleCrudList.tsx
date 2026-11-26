"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface Entity {
  id: string;
  nombre: string;
}

export function SimpleCrudList({ resource, label }: { resource: string; label: string }) {
  const [items, setItems] = useState<Entity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Entity | null>(null);

  async function load() {
    try {
      const data = await api.get<Entity[]>(`/${resource}`);
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al cargar");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function eliminar(item: Entity) {
    await api.delete(`/${resource}/${item.id}`);
    setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-dark">{label}s</h1>
        <Link
          href={`/admin/${resource}/nuevo`}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Nueva {label.toLowerCase()}
        </Link>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {!items ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          No hay {label.toLowerCase()}s todavía.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-black/[.08] dark:divide-white/[.145]">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <span className="text-zinc-950 dark:text-zinc-50">{item.nombre}</span>
              <div className="flex gap-4 text-sm">
                <Link
                  href={`/admin/${resource}/${item.id}/editar`}
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
        titulo={`¿Eliminar ${label.toLowerCase()}?`}
        nombre={aEliminar?.nombre ?? ""}
        onConfirm={() => eliminar(aEliminar!)}
        onClose={() => setAEliminar(null)}
      />
    </div>
  );
}
