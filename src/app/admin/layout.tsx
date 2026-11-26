"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";

const ADMIN_LINKS: { href: string; label: string; icon: AdminIconName }[] = [
  { href: "/admin", label: "Panel", icon: "panel" },
  { href: "/admin/repuestos", label: "Repuestos", icon: "repuestos" },
  { href: "/admin/categorias", label: "Categorías", icon: "categorias" },
  { href: "/admin/marcas", label: "Marcas", icon: "marcas" },
  { href: "/admin/modelos", label: "Modelos", icon: "modelos" },
  { href: "/admin/clientes", label: "Clientes", icon: "clientes" },
  { href: "/admin/contenido", label: "Contenido del sitio", icon: "contenido" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.rol !== "ADMIN")) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user || user.rol !== "ADMIN") {
    return (
      <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
        <p className="text-sm text-zinc-500">Verificando acceso...</p>
      </main>
    );
  }

  const nombre = user.nombre ?? user.email;

  return (
    <div className="flex flex-1 flex-col bg-surface lg:flex-row">
      {/* En celular/tablet: menú horizontal desplazable en vez de barra lateral */}
      <nav className="no-scrollbar flex gap-2 overflow-x-auto bg-primary-dark px-4 py-3 lg:hidden">
        {ADMIN_LINKS.map((link) => {
          const active =
            pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-accent text-accent-foreground" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <AdminIcon name={link.icon} className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Barra lateral pegada al borde izquierdo, a toda la altura */}
      <aside className="hidden w-72 shrink-0 bg-primary-dark lg:block">
        {/* top = alto de la parte fija del header (ver Header.tsx) */}
        <div className="sticky top-[112px] flex h-[calc(100vh-112px)] flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold uppercase text-accent-foreground">
              {nombre.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">{nombre}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Administrador
              </p>
            </div>
          </div>

          <p className="px-6 pb-2 pt-6 text-xs font-semibold uppercase tracking-wider text-white/40">
            Menú
          </p>
          <nav className="flex flex-col gap-1.5 px-4">
            {ADMIN_LINKS.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                    active
                      ? "bg-accent text-accent-foreground shadow-lg shadow-black/30"
                      : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <AdminIcon name={link.icon} className="h-[22px] w-[22px]" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 p-4">
            <Link
              href="/"
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <AdminIcon name="volver" className="h-[22px] w-[22px]" />
              Volver a la tienda
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-3 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-black/[.06] bg-white p-4 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
