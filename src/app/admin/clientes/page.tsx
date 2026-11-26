"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { UsuarioAdmin } from "@/types/auth";

const fecha = new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" });

export default function AdminClientesPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<UsuarioAdmin[]>("/usuarios")
      .then(setUsuarios)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Error al cargar"));
  }, []);

  const clientes = usuarios?.filter((u) => u.rol === "CLIENTE") ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark">Clientes</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Personas registradas en la tienda, con su teléfono y el repuesto que dijeron necesitar.
      </p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {!usuarios ? (
        error ? null : <p className="mt-6 text-sm text-zinc-500">Cargando...</p>
      ) : clientes.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">Todavía no hay clientes registrados.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/[.08] text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-2 pr-4 font-semibold">Cliente</th>
                <th className="py-2 pr-4 font-semibold">Teléfono</th>
                <th className="py-2 pr-4 font-semibold">Repuesto que necesita</th>
                <th className="py-2 font-semibold">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[.08]">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="align-top">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-primary-dark">{cliente.nombre ?? "Sin nombre"}</p>
                    <a href={`mailto:${cliente.email}`} className="text-zinc-600 hover:text-accent">
                      {cliente.email}
                    </a>
                    {!cliente.emailVerificado ? (
                      <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-xs text-zinc-500">
                        Correo sin verificar
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    {cliente.telefono ? (
                      <a
                        href={`tel:${cliente.telefono.replace(/[^\d+]/g, "")}`}
                        className="font-medium text-primary-dark hover:text-accent"
                      >
                        {cliente.telefono}
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="max-w-md whitespace-pre-line py-3 pr-4 text-zinc-700">
                    {cliente.comentario ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="whitespace-nowrap py-3 text-zinc-600">
                    {fecha.format(new Date(cliente.creadoEn))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
