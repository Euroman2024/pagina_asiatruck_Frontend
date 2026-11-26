"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { AuthPanel } from "./AuthPanel";

// /admin no se incluye en el control: tiene su propia verificación (solo administradores)
const RUTAS_LIBRES = ["/login", "/registro", "/admin"];

/** Deja ver el inicio sin cuenta; para cualquier otra página pide iniciar sesión o registrarse. */
export function AccesoRequerido({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useSession();

  const libre = pathname === "/" || RUTAS_LIBRES.some((ruta) => pathname.startsWith(ruta));
  if (libre || user) return <>{children}</>;

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
        <p className="text-sm text-zinc-500">Verificando acceso...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <span className="block h-1.5 bg-accent" aria-hidden />
        <div className="p-6 sm:p-8">
          <p className="mb-5 rounded-lg border border-black/[.08] bg-surface px-3 py-2 text-sm font-medium text-primary-dark">
            Inicia sesión o crea tu cuenta para continuar.
          </p>
          {/* Al entrar se recarga la misma página, que ya se muestra con la sesión iniciada */}
          <AuthPanel onSuccess={() => window.location.reload()} />
        </div>
      </div>
    </main>
  );
}
