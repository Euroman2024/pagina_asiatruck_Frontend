"use client";

import Link from "next/link";
import type { Modelo } from "@/types/catalogo";

export function ModelosCompatiblesPicker({
  modelos,
  seleccionados,
  onChange,
}: {
  modelos: Modelo[];
  seleccionados: string[];
  onChange: (ids: string[]) => void;
}) {
  if (modelos.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Todavía no hay modelos cargados.{" "}
        <Link href="/admin/modelos/nuevo" className="font-semibold text-accent hover:text-accent-hover">
          Crear un modelo
        </Link>
      </p>
    );
  }

  const porMarca = new Map<string, { marca: string; modelos: Modelo[] }>();
  for (const modelo of modelos) {
    const grupo = porMarca.get(modelo.marcaId) ?? { marca: modelo.marca?.nombre ?? "Sin marca", modelos: [] };
    grupo.modelos.push(modelo);
    porMarca.set(modelo.marcaId, grupo);
  }
  const grupos = [...porMarca.values()].sort((a, b) => a.marca.localeCompare(b.marca, "es"));

  function toggle(id: string) {
    onChange(seleccionados.includes(id) ? seleccionados.filter((s) => s !== id) : [...seleccionados, id]);
  }

  return (
    <div className="space-y-3 rounded-lg border border-black/[.12] p-3">
      {grupos.map((grupo) => (
        <div key={grupo.marca}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">{grupo.marca}</p>
          <div className="flex flex-wrap gap-2">
            {grupo.modelos.map((modelo) => {
              const activo = seleccionados.includes(modelo.id);
              return (
                <label
                  key={modelo.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    activo
                      ? "border-accent bg-accent/10 font-semibold text-primary-dark"
                      : "border-black/[.12] text-zinc-600 hover:border-accent/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => toggle(modelo.id)}
                    className="h-3.5 w-3.5 accent-[var(--accent)]"
                  />
                  {modelo.nombre}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-xs text-zinc-500">
        {seleccionados.length === 0
          ? "Ningún modelo seleccionado."
          : `${seleccionados.length} ${seleccionados.length === 1 ? "modelo seleccionado" : "modelos seleccionados"}.`}
      </p>
    </div>
  );
}
