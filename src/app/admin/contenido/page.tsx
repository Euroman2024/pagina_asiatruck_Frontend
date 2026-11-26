import { getContenido } from "@/lib/contenido";
import { ContenidoForm } from "@/components/admin/ContenidoForm";

export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  return <ContenidoForm initial={await getContenido()} />;
}
