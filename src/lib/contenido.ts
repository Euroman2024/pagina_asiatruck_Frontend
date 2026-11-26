import { api } from "@/lib/api";

/** Textos del sitio que se editan desde el panel (Contenido del sitio). */
export interface ContenidoSitio {
  inicio: {
    /** Frases que rotan sobre el título */
    slogans: string[];
    titulo: string;
    /** Parte del título que se pinta en rojo (debe aparecer tal cual dentro del título) */
    tituloResaltado: string;
    subtitulo: string;
    tituloCategorias: string;
    tituloDestacados: string;
    tituloMarcas: string;
    nosotrosTitulo: string;
    nosotrosResumen: string;
    ctaTitulo: string;
    ctaTexto: string;
  };
  nosotros: {
    titulo: string;
    /** Los párrafos se separan con una línea en blanco */
    texto: string;
    datos: { valor: string; etiqueta: string }[];
  };
  contacto: {
    descripcion: string;
    direccion: string;
    telefono: string;
    /** Solo números con código de país, p. ej. 593991234567 */
    whatsapp: string;
    email: string;
    horario: string;
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export const CONTENIDO_POR_DEFECTO: ContenidoSitio = {
  inicio: {
    slogans: [
      "Compatibilidad verificada por marca y modelo",
      "Catálogo en constante actualización",
      "Atención directa para talleres y flotas",
      "Repuestos para las principales marcas chinas",
    ],
    titulo: "Repuestos para camiones de marcas chinas en Ecuador",
    tituloResaltado: "camiones",
    subtitulo: "Encuentra el repuesto compatible con tu camión, filtrando por marca, modelo y categoría.",
    tituloCategorias: "Explora por categoría",
    tituloDestacados: "Recién llegados",
    tituloMarcas: "Marcas con las que trabajamos",
    nosotrosTitulo: "Nosotros",
    nosotrosResumen:
      "Asiatruk es un proveedor de repuestos para camiones de marcas chinas en Ecuador. Trabajamos con [años de experiencia] atendiendo a talleres, flotas y particulares en [ciudades/provincias].",
    ctaTitulo: "¿No encuentras lo que buscas?",
    ctaTexto: "Mira el catálogo completo filtrando por marca, modelo o categoría.",
  },
  nosotros: {
    titulo: "Nosotros",
    texto:
      "Asiatruk es un proveedor de repuestos para camiones de marcas chinas en Ecuador. Desde [año de fundación], trabajamos junto a talleres, flotas de transporte y particulares para conseguir el repuesto correcto, compatible con su marca y modelo.",
    datos: [
      { valor: "[Años] años", etiqueta: "De experiencia" },
      { valor: "[Ciudades/provincias]", etiqueta: "Zonas de cobertura" },
      { valor: "[Diferencial]", etiqueta: "Lo que nos distingue" },
    ],
  },
  contacto: {
    descripcion: "Repuestos para camiones de marcas chinas en Ecuador.",
    direccion: "",
    telefono: "",
    whatsapp: "",
    email: "",
    horario: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  },
};

/** Completa lo guardado con los textos por defecto, sección por sección. */
export function completarContenido(guardado: Partial<ContenidoSitio> | null | undefined): ContenidoSitio {
  return {
    inicio: { ...CONTENIDO_POR_DEFECTO.inicio, ...guardado?.inicio },
    nosotros: { ...CONTENIDO_POR_DEFECTO.nosotros, ...guardado?.nosotros },
    contacto: { ...CONTENIDO_POR_DEFECTO.contacto, ...guardado?.contacto },
  };
}

export async function getContenido(): Promise<ContenidoSitio> {
  try {
    return completarContenido(await api.get<Partial<ContenidoSitio>>("/contenido"));
  } catch {
    // Si el backend no responde, el sitio sigue mostrando los textos por defecto
    return CONTENIDO_POR_DEFECTO;
  }
}
