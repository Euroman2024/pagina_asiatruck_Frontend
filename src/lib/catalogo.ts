import type { Repuesto } from "@/types/catalogo";

/** Un repuesto es de una marca si se le asignó directamente o si es compatible con alguno de sus modelos. */
export function esDeMarca(repuesto: Repuesto, marcaId: string) {
  return (
    (repuesto.marcas ?? []).some((m) => m.id === marcaId) ||
    (repuesto.compatibilidad ?? []).some((c) => c.modelo.marcaId === marcaId)
  );
}
