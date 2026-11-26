"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { ImagePicker } from "./ImagePicker";
import type { Categoria } from "@/types/catalogo";

const inputClass =
  "rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-zinc-950 outline-none focus:border-accent";

export function CategoriaForm({ id, initial }: { id?: string; initial?: Categoria }) {
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [imagen, setImagen] = useState<string | null>(initial?.imagen ?? null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = { nombre, descripcion: descripcion.trim() || null, imagen };
      if (id) {
        await api.patch(`/categorias/${id}`, payload);
      } else {
        await api.post("/categorias", payload);
      }
      router.push("/admin/categorias");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-primary-dark">{id ? "Editar categoría" : "Nueva categoría"}</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Nombre</span>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Descripción</span>
          <span className="text-xs text-zinc-500">
            Una frase corta que se muestra en la página de categorías. Ej.: “Pastillas, discos y zapatas
            para un frenado seguro”.
          </span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            maxLength={160}
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Foto de la categoría</span>
          <span className="text-xs text-zinc-500">
            Una imagen representativa (por ejemplo, un disco de freno para “Frenos”). Se usa de fondo en
            las tarjetas.
          </span>
          <ImagePicker
            images={imagen ? [imagen] : []}
            onChange={(imgs) => setImagen(imgs[0] ?? null)}
            multiple={false}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-fit rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
