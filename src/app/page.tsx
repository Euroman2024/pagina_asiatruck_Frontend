import Link from "next/link";
import { api } from "@/lib/api";
import { getContenido } from "@/lib/contenido";
import { Carousel } from "@/components/home/Carousel";
import { HeroSlogans } from "@/components/home/HeroSlogans";
import { HeroFinder } from "@/components/home/HeroFinder";
import { FotoProducto } from "@/components/FotoProducto";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export const revalidate = 60;

/** Título de la portada, con la parte resaltada en rojo si aparece dentro del título. */
function TituloPortada({ titulo, resaltado }: { titulo: string; resaltado: string }) {
  const inicio = resaltado ? titulo.indexOf(resaltado) : -1;
  if (inicio === -1) return <>{titulo}</>;
  return (
    <>
      {titulo.slice(0, inicio)}
      <span className="text-accent">{resaltado}</span>
      {titulo.slice(inicio + resaltado.length)}
    </>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
        <h2 className="text-2xl font-bold text-primary-dark">{title}</h2>
      </div>
      <Link href={href} className="text-sm font-semibold text-primary hover:text-primary-hover">
        {linkLabel} →
      </Link>
    </div>
  );
}

export default async function Home() {
  const [repuestos, categorias, marcas, modelos, { inicio }] = await Promise.all([
    api.get<Repuesto[]>("/repuestos"),
    api.get<Categoria[]>("/categorias"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
    getContenido(),
  ]);

  const destacados = [...repuestos]
    .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())
    .slice(0, 8);

  const categoriaInfo = new Map(
    categorias.map((categoria) => {
      const repuestosDeCategoria = repuestos.filter((r) => r.categoriaId === categoria.id);
      const conFoto = repuestosDeCategoria.find((r) => r.imagenes[0]);
      return [
        categoria.id,
        { imagen: categoria.imagen ?? conFoto?.imagenes[0], cantidad: repuestosDeCategoria.length },
      ];
    }),
  );

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: fondo claro para contrastar con el header rojo */}
      <section className="relative overflow-hidden bg-white">
        {/* Panel rojo a la derecha con un solo corte diagonal, como la "A" del logo */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          <div
            className="absolute inset-0 bg-primary/15"
            style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[92%] bg-gradient-to-br from-primary to-primary-hover"
            style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-[96rem] items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_26rem] lg:px-10">
          <div>
            {inicio.slogans.length > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <HeroSlogans slogans={inicio.slogans} className="text-accent" />
              </div>
            ) : null}
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-primary-dark sm:text-5xl">
              <TituloPortada titulo={inicio.titulo} resaltado={inicio.tituloResaltado} />
            </h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-600">{inicio.subtitulo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/repuestos"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:bg-accent-hover"
              >
                Ver catálogo
              </Link>
              <Link
                href="/categorias"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary-dark/15 px-7 text-sm font-semibold text-primary-dark transition-colors hover:border-accent hover:text-accent"
              >
                Ver categorías
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-black/[.08] pt-8">
              <div>
                <p className="text-3xl font-extrabold text-accent">{repuestos.length}+</p>
                <p className="text-sm text-zinc-600">Repuestos</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-accent">{marcas.length}</p>
                <p className="text-sm text-zinc-600">Marcas</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-accent">{categorias.length}</p>
                <p className="text-sm text-zinc-600">Categorías</p>
              </div>
            </div>
          </div>

          <HeroFinder marcas={marcas} modelos={modelos} categorias={categorias} />
        </div>
      </section>

      {/* Categorías */}
      {categorias.length > 0 ? (
        <section className="bg-surface">
          <div className="mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-14">
            <SectionTitle title={inicio.tituloCategorias} href="/categorias" linkLabel="Ver todas" />

            <div className="mt-6">
              <Carousel autoPlay intervalMs={3200} scrollAmount={224}>
                {categorias.map((categoria) => {
                  const info = categoriaInfo.get(categoria.id);
                  return (
                    <Link
                      key={categoria.id}
                      href={`/categorias/${categoria.id}`}
                      className="group relative h-56 w-52 shrink-0 snap-start overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
                    >
                      {/* El degradado queda debajo: se ve si no hay foto o si es muy pequeña para fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
                      {info?.imagen ? (
                        <FotoProducto
                          fondo
                          src={info.imagen}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : null}

                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />

                      {info?.cantidad ? (
                        <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                          {info.cantidad} {info.cantidad === 1 ? "repuesto" : "repuestos"}
                        </span>
                      ) : null}

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="mb-2 block h-1.5 w-8 rounded-full bg-accent transition-all group-hover:w-12" />
                        <span className="flex items-center gap-1.5 font-semibold text-white">
                          {categoria.nombre}
                          <span className="translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </section>
      ) : null}

      {/* Repuestos destacados */}
      {destacados.length > 0 ? (
        <section className="mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-14">
          <SectionTitle title={inicio.tituloDestacados} href="/repuestos" linkLabel="Ver catálogo completo" />

          <div className="mt-6">
            <Carousel autoPlay intervalMs={2800} scrollAmount={304}>
              {destacados.map((repuesto) => (
                <Link
                  key={repuesto.id}
                  href={`/repuestos/${repuesto.id}`}
                  className="group block w-72 shrink-0 snap-start rounded-lg border border-primary/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/20"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-surface">
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
                  </div>
                  <p className="mt-3 truncate text-base font-semibold text-primary-dark">
                    {repuesto.nombre}
                  </p>
                  <p className="text-lg font-bold text-primary">${Number(repuesto.precio).toFixed(2)}</p>
                </Link>
              ))}
            </Carousel>
          </div>
        </section>
      ) : null}

      {/* Nosotros */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-14">
          <Link href="/nosotros" className="group block">
            <div className="rounded-2xl border border-primary/10 bg-white p-8 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-xl group-hover:shadow-accent/20">
              <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
              <h2 className="text-2xl font-bold text-primary-dark">{inicio.nosotrosTitulo}</h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line text-zinc-600">{inicio.nosotrosResumen}</p>
              <span className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full border border-primary px-5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                Sobre nosotros
                <span>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Marcas */}
      {marcas.length > 0 ? (
        <section className="mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-14">
          <SectionTitle title={inicio.tituloMarcas} href="/marcas" linkLabel="Ver todas" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            {marcas.map((marca) => (
              <Link
                key={marca.id}
                href={`/marcas/${marca.id}`}
                className="flex h-24 items-center justify-center rounded-xl border border-primary/15 bg-white p-4 text-center font-semibold text-primary-dark shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/30"
              >
                {marca.nombre}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA final */}
      <section className="relative overflow-hidden bg-primary-dark">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 md:block">
          <div className="absolute -left-20 top-0 h-full w-40 -skew-x-[35deg] bg-primary" />
          <div className="absolute left-24 top-0 h-full w-8 -skew-x-[35deg] bg-primary-hover" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[96rem] flex-col items-start gap-4 px-6 lg:px-10 py-14 sm:flex-row sm:items-center sm:justify-between md:pl-56">
          <div>
            <h2 className="text-2xl font-bold text-white">{inicio.ctaTitulo}</h2>
            <p className="mt-1 text-sm text-white/75">{inicio.ctaTexto}</p>
          </div>
          <Link
            href="/repuestos"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-7 text-sm font-bold text-accent-foreground shadow-lg shadow-black/20 transition-all hover:scale-105 hover:bg-accent-hover"
          >
            Ver catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
