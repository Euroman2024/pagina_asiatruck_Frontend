import type { Metadata } from "next";
import { getContenido } from "@/lib/contenido";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nosotros | Asiatruk",
  description: "Conoce a Asiatruk, proveedor de repuestos para camiones de marcas chinas en Ecuador.",
};

export default async function NosotrosPage() {
  const { nosotros } = await getContenido();
  const parrafos = nosotros.texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
      <h1 className="text-3xl font-bold text-primary-dark">{nosotros.titulo}</h1>

      <div className="mt-6 space-y-4">
        {parrafos.map((parrafo, index) => (
          <p key={index} className="whitespace-pre-line text-lg text-zinc-700">
            {parrafo}
          </p>
        ))}
      </div>

      {nosotros.datos.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {nosotros.datos.map((dato, index) => (
            <div key={index} className="min-w-0 rounded-xl border border-black/[.08] bg-white p-5">
              <p className="break-words text-xl font-bold text-primary">{dato.valor}</p>
              <p className="mt-1 text-sm text-zinc-600">{dato.etiqueta}</p>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
