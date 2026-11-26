"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ContenidoSitio } from "@/lib/contenido";

const linkClass = "transition-colors hover:text-accent";

export function Footer({ contacto }: { contacto: ContenidoSitio["contacto"] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const redes = [
    { nombre: "Facebook", url: contacto.facebook },
    { nombre: "Instagram", url: contacto.instagram },
    { nombre: "TikTok", url: contacto.tiktok },
  ].filter((red) => red.url);
  const hayContacto =
    contacto.direccion || contacto.telefono || contacto.whatsapp || contacto.email || contacto.horario;

  return (
    <footer className="border-t-4 border-accent bg-primary-dark text-white/70">
      <div className="mx-auto max-w-[96rem] px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Image src="/logo-asiatruk-blanco.png" alt="Asiatruk" width={747} height={160} className="h-10 w-auto" />
            {contacto.descripcion ? <p className="mt-2 text-sm">{contacto.descripcion}</p> : null}
          </div>

          {hayContacto ? (
            <div>
              <p className="text-sm font-semibold text-white">Contacto</p>
              <div className="mt-2 space-y-1 text-sm">
                {contacto.direccion ? <p>{contacto.direccion}</p> : null}
                {contacto.telefono ? (
                  <p>
                    <a href={`tel:${contacto.telefono.replace(/[^\d+]/g, "")}`} className={linkClass}>
                      {contacto.telefono}
                    </a>
                  </p>
                ) : null}
                {contacto.whatsapp ? (
                  <p>
                    <a
                      href={`https://wa.me/${contacto.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      WhatsApp: +{contacto.whatsapp}
                    </a>
                  </p>
                ) : null}
                {contacto.email ? (
                  <p>
                    <a href={`mailto:${contacto.email}`} className={linkClass}>
                      {contacto.email}
                    </a>
                  </p>
                ) : null}
                {contacto.horario ? <p>{contacto.horario}</p> : null}
              </div>
            </div>
          ) : null}

          {redes.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-white">Síguenos</p>
              <div className="mt-2 flex gap-4 text-sm">
                {redes.map((red) => (
                  <a
                    key={red.nombre}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {red.nombre}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-white/15 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} Asiatruk. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
