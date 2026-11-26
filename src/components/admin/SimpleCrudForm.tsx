"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export function SimpleCrudForm({
  resource,
  label,
  id,
  initialNombre,
}: {
  resource: string;
  label: string;
  id?: string;
  initialNombre?: string;
}) {
  const [nombre, setNombre] = useState(initialNombre ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/${resource}/${id}`, { nombre });
      } else {
        await api.post(`/${resource}`, { nombre });
      }
      router.push(`/admin/${resource}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-primary-dark">
        {id ? `Editar ${label.toLowerCase()}` : `Nueva ${label.toLowerCase()}`}
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Nombre</span>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.2] dark:text-zinc-50 dark:focus:border-zinc-50"
          />
        </label>

        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

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
