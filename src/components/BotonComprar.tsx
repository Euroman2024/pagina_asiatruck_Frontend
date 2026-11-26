"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { AuthModal } from "./auth/AuthModal";

/** Botón "Comprar": si no hay sesión iniciada, pide iniciar sesión o registrarse. */
export function BotonComprar({
  sinStock,
  className = "",
}: {
  sinStock: boolean;
  className?: string;
}) {
  const [modal, setModal] = useState(false);
  const [comprobando, setComprobando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function comprar() {
    setAviso(null);
    setComprobando(true);
    try {
      // Se consulta al hacer clic (y no al cargar) porque la sesión vence a la hora
      await api.get("/auth/me");
      // TODO: iniciar el flujo de compra (carrito / pedido) cuando exista
      setAviso("Ya iniciaste sesión. La compra en línea estará disponible pronto.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setModal(true);
      } else {
        setAviso("No pudimos comprobar tu sesión. Inténtalo de nuevo.");
      }
    } finally {
      setComprobando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={comprar}
        disabled={sinStock || comprobando}
        className={`h-11 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {sinStock ? "Agotado" : "Comprar"}
      </button>
      {aviso ? (
        <p role="status" className="mt-2 text-xs text-zinc-600">
          {aviso}
        </p>
      ) : null}
      <AuthModal
        open={modal}
        onClose={() => setModal(false)}
        mensaje="Inicia sesión o crea tu cuenta para comprar."
      />
    </>
  );
}
