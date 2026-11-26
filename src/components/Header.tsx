import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { AuthStatus } from "./AuthStatus";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { NavBar } from "./NavBar";
import type { Marca } from "@/types/catalogo";

// Alto del header fijo en pantallas grandes: fila principal (h-16) + borde 1px + menú (h-11) + borde inferior 3px = 112px.
// Si se cambia, actualizar los "top" sticky del panel admin y del panel de filtros.

export async function Header() {
  const marcas = await api.get<Marca[]>("/marcas");

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-primary-hover bg-primary shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]">
      {/* Fila principal: logo, buscador y cuenta */}
      <div className="mx-auto flex h-16 max-w-[96rem] items-center gap-4 px-4 sm:px-6 lg:gap-10 lg:px-10">
        <Link href="/" aria-label="Asiatruk - Inicio" className="shrink-0">
          <Image
            src="/logo-asiatruk-blanco.png"
            alt="Asiatruk"
            width={747}
            height={160}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <HeaderSearch className="ml-auto hidden w-full max-w-md md:block" />
        {/* En pantallas grandes la cuenta va en la fila del menú (NavBar) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <AuthStatus />
          <MobileMenu />
        </div>
      </div>

      {/* Buscador en celular */}
      <div className="px-4 pb-3 md:hidden">
        <HeaderSearch />
      </div>

      <NavBar marcas={marcas} />
    </header>
  );
}
