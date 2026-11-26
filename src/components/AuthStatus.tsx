"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { AuthModal } from "./auth/AuthModal";

export function AuthStatus() {
  const { user, loading } = useSession();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  async function handleLogout() {
    await api.post("/auth/logout", {});
    window.location.href = "/";
  }

  if (loading) {
    return <div className="h-9 w-9" />;
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-accent shadow-sm transition-all hover:scale-105 hover:bg-surface"
        >
          Iniciar sesión
        </button>
        <AuthModal open={modal} onClose={() => setModal(false)} />
      </>
    );
  }

  const nombre = user.nombre ?? user.email;
  const esAdmin = user.rol === "ADMIN";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mi cuenta"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold uppercase text-accent ring-white/50 transition-all hover:ring-4"
      >
        {nombre.charAt(0)}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-10 mt-2 w-60 overflow-hidden rounded-xl border border-black/[.08] bg-white shadow-xl">
          <div className="border-b border-black/[.08] bg-surface px-4 py-3">
            <p className="truncate text-sm font-semibold text-primary-dark">{nombre}</p>
            <p className="truncate text-xs text-zinc-500">{user.email}</p>
            {esAdmin ? (
              <span className="mt-1.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                Administrador
              </span>
            ) : null}
          </div>
          {esAdmin ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-surface hover:text-accent"
            >
              Panel de administración
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-primary-dark transition-colors hover:bg-surface hover:text-accent"
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
