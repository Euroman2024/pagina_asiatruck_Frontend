"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";

/**
 * Modal para confirmar una eliminación. Reemplaza a confirm()/alert() del navegador:
 * muestra qué se va a borrar, el estado "Eliminando…" y, si falla, el error dentro del modal.
 */
export function ConfirmDeleteModal({
  open,
  titulo,
  nombre,
  detalle,
  onConfirm,
  onClose,
}: {
  open: boolean;
  titulo: string;
  /** Nombre del elemento, se muestra resaltado */
  nombre: string;
  /** Aclaración opcional debajo del nombre */
  detalle?: string;
  /** Debe lanzar un error si la eliminación falla */
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setEliminando(false);
    cancelarRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !eliminando) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, eliminando, onClose]);

  if (!open) return null;

  async function confirmar() {
    setError(null);
    setEliminando(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar. Inténtalo de nuevo.");
      setEliminando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !eliminando) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        aria-describedby="confirm-descripcion"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-titulo" className="text-lg font-bold text-primary-dark">
              {titulo}
            </h2>
            <div id="confirm-descripcion" className="mt-2 text-sm text-zinc-600">
              <p>
                Vas a eliminar <span className="font-semibold text-primary-dark">{nombre}</span>.
              </p>
              {detalle ? <p className="mt-1">{detalle}</p> : null}
              <p className="mt-1">Esta acción no se puede deshacer.</p>
            </div>

            {error ? (
              <p role="alert" className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent-hover">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-black/[.06] bg-surface px-6 py-4">
          <button
            ref={cancelarRef}
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="h-10 rounded-full border border-black/[.12] bg-white px-5 text-sm font-semibold text-primary-dark transition-colors hover:bg-black/[.04] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={eliminando}
            className="h-10 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {eliminando ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
