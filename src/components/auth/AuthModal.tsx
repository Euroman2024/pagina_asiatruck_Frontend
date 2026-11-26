"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AuthPanel } from "./AuthPanel";

export function AuthModal({
  open,
  inicial,
  mensaje,
  onClose,
}: {
  open: boolean;
  inicial?: "login" | "registro";
  /** Explica por qué se pide acceder (p. ej. al intentar comprar) */
  mensaje?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Evita que la página de fondo se desplace mientras el modal está abierto
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Acceso a tu cuenta"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <span className="block h-1.5 bg-accent" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-surface hover:text-primary-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 pt-12 sm:p-8 sm:pt-12">
          {mensaje ? (
            <p className="mb-5 rounded-lg border border-black/[.08] bg-surface px-3 py-2 text-sm font-medium text-primary-dark">
              {mensaje}
            </p>
          ) : null}
          {/* Al entrar se recarga la página para que todo refleje la sesión iniciada */}
          <AuthPanel inicial={inicial} onSuccess={() => window.location.reload()} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
