import { api } from "@/lib/api";
import { ModeloForm } from "@/components/admin/ModeloForm";
import type { Marca } from "@/types/catalogo";

export default async function NuevoModeloPage() {
  const marcas = await api.get<Marca[]>("/marcas");
  return <ModeloForm marcas={marcas} />;
}
