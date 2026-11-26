"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus";
import { MarcasDropdown } from "./MarcasDropdown";
import type { Marca } from "@/types/catalogo";

const itemClass =
  "flex h-full items-center px-4 text-white/85 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white";
// Línea blanca abajo para la sección activa
const activeClass = "!text-white bg-white/10 shadow-[inset_0_-3px_0_0_#ffffff]";

export function NavBar({ marcas }: { marcas: Marca[] }) {
  const pathname = usePathname();
  const esActivo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const marcasActivo = pathname.startsWith("/marcas") || pathname.startsWith("/modelos");

  return (
    <nav className="hidden border-t border-white/15 lg:block">
      <div className="mx-auto flex h-11 max-w-[96rem] items-stretch px-6 text-[15px] font-semibold lg:px-10">
        <Link href="/" className={`${itemClass} ml-auto ${esActivo("/") ? activeClass : ""}`}>
          Inicio
        </Link>
        <Link href="/nosotros" className={`${itemClass} ${esActivo("/nosotros") ? activeClass : ""}`}>
          Nosotros
        </Link>
        <Link href="/repuestos" className={`${itemClass} ${esActivo("/repuestos") ? activeClass : ""}`}>
          Repuestos
        </Link>
        <MarcasDropdown marcas={marcas} className={`${itemClass} ${marcasActivo ? activeClass : ""}`} />

        <div className="ml-4 flex items-center border-l border-white/20 pl-5">
          <AuthStatus />
        </div>
      </div>
    </nav>
  );
}
