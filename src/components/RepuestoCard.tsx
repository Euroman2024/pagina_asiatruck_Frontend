import Link from "next/link";
import { BotonComprar } from "./BotonComprar";
import { FotoProducto } from "./FotoProducto";
import type { Repuesto } from "@/types/catalogo";

export function RepuestoCard({ repuesto }: { repuesto: Repuesto }) {
  const sinStock = repuesto.stock === 0;

  return (
    <div className="group flex h-full flex-col rounded-xl border border-black/[.08] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/15">
      <Link href={`/repuestos/${repuesto.id}`} className="block flex-1">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-surface">
          {repuesto.imagenes[0] ? (
            <FotoProducto
              src={repuesto.imagenes[0]}
              alt={repuesto.nombre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
              Sin foto
            </div>
          )}
          {sinStock ? (
            <span className="absolute left-2 top-2 rounded-full bg-primary-dark px-2.5 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          ) : null}
        </div>
        <p className="text-xs text-zinc-500">
          {repuesto.sku}
          {repuesto.categoria ? ` · ${repuesto.categoria.nombre}` : ""}
        </p>
        <h2 className="mt-0.5 font-semibold text-primary-dark">{repuesto.nombre}</h2>
        <p className="mt-2 text-lg font-bold text-primary">${Number(repuesto.precio).toFixed(2)}</p>
      </Link>
      {/* Fuera del enlace: un botón dentro de un <a> no es HTML válido */}
      <div className="mt-3">
        <BotonComprar sinStock={sinStock} className="w-full" />
      </div>
    </div>
  );
}
