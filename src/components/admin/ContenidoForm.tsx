"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { revalidarSitio } from "@/app/admin/contenido/actions";
import type { ContenidoSitio } from "@/lib/contenido";

type Seccion = keyof ContenidoSitio;

const SECCIONES: { id: Seccion; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto y redes" },
];

const inputClass =
  "w-full rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none focus:border-accent";
const grupoClass = "flex flex-col gap-4 rounded-xl border border-black/[.08] p-5";
const tituloGrupo = "text-sm font-bold uppercase tracking-wide text-primary-dark";

function Campo({ label, ayuda, children }: { label: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      {ayuda ? <span className="text-xs text-zinc-500">{ayuda}</span> : null}
      {children}
    </label>
  );
}

export function ContenidoForm({ initial }: { initial: ContenidoSitio }) {
  const [contenido, setContenido] = useState(initial);
  // Los slogans se editan como texto, uno por línea
  const [slogans, setSlogans] = useState(initial.inicio.slogans.join("\n"));
  const [seccion, setSeccion] = useState<Seccion>("inicio");
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { inicio, nosotros, contacto } = contenido;

  function cambiar<S extends Seccion>(s: S, cambios: Partial<ContenidoSitio[S]>) {
    setGuardado(false);
    setContenido((actual) => ({ ...actual, [s]: { ...actual[s], ...cambios } }));
  }

  function cambiarDato(index: number, cambios: Partial<ContenidoSitio["nosotros"]["datos"][number]>) {
    cambiar("nosotros", {
      datos: nosotros.datos.map((dato, i) => (i === index ? { ...dato, ...cambios } : dato)),
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardado(false);
    setSubmitting(true);
    try {
      const payload: ContenidoSitio = {
        ...contenido,
        inicio: {
          ...inicio,
          slogans: slogans
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        nosotros: { ...nosotros, datos: nosotros.datos.filter((d) => d.valor.trim() || d.etiqueta.trim()) },
        contacto: { ...contacto, whatsapp: contacto.whatsapp.replace(/\D/g, "") },
      };
      await api.put("/contenido", payload);
      await revalidarSitio();
      setContenido(payload);
      setGuardado(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark">Contenido del sitio</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Edita los textos que ven los clientes en la tienda. Los cambios se publican al guardar.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeccion(s.id)}
            aria-pressed={seccion === s.id}
            className={`h-10 rounded-full px-5 text-sm font-semibold transition-colors ${
              seccion === s.id
                ? "bg-accent text-accent-foreground"
                : "border border-black/[.12] text-zinc-600 hover:border-accent hover:text-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {seccion === "inicio" ? (
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            <section className={grupoClass}>
              <h2 className={tituloGrupo}>Portada</h2>
              <Campo label="Título principal">
                <input
                  type="text"
                  required
                  value={inicio.titulo}
                  onChange={(e) => cambiar("inicio", { titulo: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo
                label="Palabra resaltada"
                ayuda="Parte del título que se pinta en rojo. Escríbela igual que aparece en el título."
              >
                <input
                  type="text"
                  value={inicio.tituloResaltado}
                  onChange={(e) => cambiar("inicio", { tituloResaltado: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Subtítulo">
                <textarea
                  rows={2}
                  value={inicio.subtitulo}
                  onChange={(e) => cambiar("inicio", { subtitulo: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Frases que rotan" ayuda="Una frase por línea. Se van alternando sobre el título.">
                <textarea
                  rows={4}
                  value={slogans}
                  onChange={(e) => {
                    setGuardado(false);
                    setSlogans(e.target.value);
                  }}
                  className={inputClass}
                />
              </Campo>
            </section>

            <div className="flex flex-col gap-6">
              <section className={grupoClass}>
                <h2 className={tituloGrupo}>Títulos de las secciones</h2>
                <Campo label="Categorías">
                  <input
                    type="text"
                    required
                    value={inicio.tituloCategorias}
                    onChange={(e) => cambiar("inicio", { tituloCategorias: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Repuestos más recientes">
                  <input
                    type="text"
                    required
                    value={inicio.tituloDestacados}
                    onChange={(e) => cambiar("inicio", { tituloDestacados: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Marcas">
                  <input
                    type="text"
                    required
                    value={inicio.tituloMarcas}
                    onChange={(e) => cambiar("inicio", { tituloMarcas: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
              </section>

              <section className={grupoClass}>
                <h2 className={tituloGrupo}>Bloque “Nosotros” del inicio</h2>
                <Campo label="Título">
                  <input
                    type="text"
                    required
                    value={inicio.nosotrosTitulo}
                    onChange={(e) => cambiar("inicio", { nosotrosTitulo: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Resumen">
                  <textarea
                    rows={3}
                    value={inicio.nosotrosResumen}
                    onChange={(e) => cambiar("inicio", { nosotrosResumen: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
              </section>

              <section className={grupoClass}>
                <h2 className={tituloGrupo}>Franja final</h2>
                <Campo label="Título">
                  <input
                    type="text"
                    required
                    value={inicio.ctaTitulo}
                    onChange={(e) => cambiar("inicio", { ctaTitulo: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Texto">
                  <textarea
                    rows={2}
                    value={inicio.ctaTexto}
                    onChange={(e) => cambiar("inicio", { ctaTexto: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
              </section>
            </div>
          </div>
        ) : null}

        {seccion === "nosotros" ? (
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            <section className={grupoClass}>
              <h2 className={tituloGrupo}>Página Nosotros</h2>
              <Campo label="Título">
                <input
                  type="text"
                  required
                  value={nosotros.titulo}
                  onChange={(e) => cambiar("nosotros", { titulo: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Texto" ayuda="Deja una línea en blanco para separar párrafos.">
                <textarea
                  rows={10}
                  value={nosotros.texto}
                  onChange={(e) => cambiar("nosotros", { texto: e.target.value })}
                  className={inputClass}
                />
              </Campo>
            </section>

            <section className={grupoClass}>
              <h2 className={tituloGrupo}>Datos destacados</h2>
              <p className="text-xs text-zinc-500">
                Tarjetas que se muestran bajo el texto. Ej.: “15 años” · “De experiencia”.
              </p>
              {nosotros.datos.map((dato, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="grid flex-1 grid-cols-2 gap-3">
                    <Campo label="Dato">
                      <input
                        type="text"
                        value={dato.valor}
                        onChange={(e) => cambiarDato(index, { valor: e.target.value })}
                        className={inputClass}
                      />
                    </Campo>
                    <Campo label="Descripción">
                      <input
                        type="text"
                        value={dato.etiqueta}
                        onChange={(e) => cambiarDato(index, { etiqueta: e.target.value })}
                        className={inputClass}
                      />
                    </Campo>
                  </div>
                  <button
                    type="button"
                    onClick={() => cambiar("nosotros", { datos: nosotros.datos.filter((_, i) => i !== index) })}
                    aria-label="Quitar dato"
                    className="h-[38px] rounded-md border border-black/[.12] px-3 text-sm text-zinc-600 transition-colors hover:border-accent hover:text-accent"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => cambiar("nosotros", { datos: [...nosotros.datos, { valor: "", etiqueta: "" }] })}
                className="w-fit text-sm font-semibold text-accent hover:text-accent-hover"
              >
                + Agregar dato
              </button>
            </section>
          </div>
        ) : null}

        {seccion === "contacto" ? (
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            <section className={grupoClass}>
              <h2 className={tituloGrupo}>Contacto</h2>
              <p className="text-xs text-zinc-500">
                Se muestra en el pie de todas las páginas. Los campos vacíos no aparecen.
              </p>
              <Campo label="Frase bajo el logo">
                <input
                  type="text"
                  value={contacto.descripcion}
                  onChange={(e) => cambiar("contacto", { descripcion: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Dirección">
                <input
                  type="text"
                  value={contacto.direccion}
                  onChange={(e) => cambiar("contacto", { direccion: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Campo label="Teléfono">
                  <input
                    type="tel"
                    value={contacto.telefono}
                    onChange={(e) => cambiar("contacto", { telefono: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
                <Campo label="WhatsApp" ayuda="Con código de país, solo números. Ej.: 593991234567">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={contacto.whatsapp}
                    onChange={(e) => cambiar("contacto", { whatsapp: e.target.value })}
                    className={inputClass}
                  />
                </Campo>
              </div>
              <Campo label="Correo electrónico">
                <input
                  type="email"
                  value={contacto.email}
                  onChange={(e) => cambiar("contacto", { email: e.target.value })}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Horario de atención">
                <input
                  type="text"
                  value={contacto.horario}
                  onChange={(e) => cambiar("contacto", { horario: e.target.value })}
                  placeholder="Lunes a viernes, 8:00 a 18:00"
                  className={inputClass}
                />
              </Campo>
            </section>

            <section className={grupoClass}>
              <h2 className={tituloGrupo}>Redes sociales</h2>
              <p className="text-xs text-zinc-500">
                Pega el enlace completo de cada perfil. Las redes sin enlace no se muestran.
              </p>
              {(["facebook", "instagram", "tiktok"] as const).map((red) => (
                <Campo key={red} label={red === "tiktok" ? "TikTok" : red === "facebook" ? "Facebook" : "Instagram"}>
                  <input
                    type="url"
                    value={contacto[red]}
                    onChange={(e) => cambiar("contacto", { [red]: e.target.value })}
                    placeholder="https://"
                    className={inputClass}
                  />
                </Campo>
              ))}
            </section>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-fit rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
          {guardado ? (
            <p role="status" className="text-sm font-semibold text-green-700">
              Cambios guardados y publicados.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
