import Link from "next/link";
import { api } from "@/lib/api";
import { FotoProducto } from "@/components/FotoProducto";
import type { Categoria, Repuesto } from "@/types/catalogo";

export const revalidate = 60;

export default async function CategoriasPage() {
  const [categorias, repuestos] = await Promise.all([
    api.get<Categoria[]>("/categorias"),
    api.get<Repuesto[]>("/repuestos"),
  ]);

  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 py-12 lg:px-10">
      <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
      <h1 className="text-3xl font-bold text-primary-dark">Categorías</h1>
      <p className="mt-1 text-zinc-600">Elige una categoría para ver sus repuestos.</p>

      {categorias.length === 0 ? (
        <p className="mt-8 text-zinc-600">Todavía no hay categorías cargadas.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categorias.map((categoria) => {
            const suyos = repuestos.filter((r) => r.categoriaId === categoria.id);
            const conFoto = suyos.filter((r) => r.imagenes[0]);
            const fondo = categoria.imagen ?? conFoto[0]?.imagenes[0];
            const miniaturas = conFoto.slice(0, 3);

            return (
              <li key={categoria.id}>
                <Link
                  href={`/categorias/${categoria.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-primary-dark shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover" />
                  {fondo ? (
                    <FotoProducto
                      fondo
                      src={fondo}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

                  <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
                    {suyos.length} {suyos.length === 1 ? "repuesto" : "repuestos"}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="mb-3 block h-1.5 w-10 rounded-full bg-accent transition-all duration-300 group-hover:w-16" />
                    <h2 className="text-2xl font-bold text-white">{categoria.nombre}</h2>
                    {categoria.descripcion ? (
                      <p className="mt-1.5 line-clamp-2 text-sm text-white/80">{categoria.descripcion}</p>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex -space-x-2">
                        {miniaturas.map((r) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={r.id}
                            src={r.imagenes[0]}
                            alt={r.nombre}
                            title={r.nombre}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                          />
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-white transition-all group-hover:gap-2">
                        Ver repuestos <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
