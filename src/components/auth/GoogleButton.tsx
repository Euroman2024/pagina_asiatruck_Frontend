"use client";

import { useEffect, useRef, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** true si el acceso con Google está configurado (hay ID de cliente) */
export const googleDisponible = Boolean(CLIENT_ID);

interface GoogleAccountsId {
  initialize(opciones: { client_id: string; callback: (respuesta: { credential: string }) => void }): void;
  renderButton(
    contenedor: HTMLElement,
    opciones: { theme: string; size: string; shape: string; text: string; locale: string; width: number },
  ): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

let scriptPromise: Promise<void> | null = null;

function cargarScriptDeGoogle() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("No se pudo cargar Google"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Botón oficial "Continuar con Google". Entrega el comprobante firmado (ID token) al hacer clic. */
export function GoogleButton({ onCredential }: { onCredential: (credential: string) => void }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    callback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelado = false;

    cargarScriptDeGoogle()
      .then(() => {
        const el = contenedor.current;
        if (cancelado || !el || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (respuesta) => callback.current(respuesta.credential),
        });
        window.google.accounts.id.renderButton(el, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          locale: "es",
          width: Math.min(400, el.offsetWidth), // el botón de Google admite hasta 400 px
        });
      })
      .catch(() => setFallo(true));

    return () => {
      cancelado = true;
    };
  }, []);

  if (!CLIENT_ID) return null;

  if (fallo) {
    return (
      <p className="text-center text-xs text-zinc-500">
        No se pudo cargar el acceso con Google. Revisa tu conexión e inténtalo de nuevo.
      </p>
    );
  }

  return <div ref={contenedor} className="flex min-h-[44px] w-full justify-center" />;
}
