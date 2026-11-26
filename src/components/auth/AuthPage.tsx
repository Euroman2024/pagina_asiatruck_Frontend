"use client";

import { AuthPanel } from "./AuthPanel";

/** Versión en página completa de los formularios de acceso (para /login y /registro). */
export function AuthPage({ inicial }: { inicial: "login" | "registro" }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <span className="block h-1.5 bg-accent" aria-hidden />
        <div className="p-6 sm:p-8">
          <AuthPanel
            inicial={inicial}
            onSuccess={() => {
              window.location.href = "/";
            }}
          />
        </div>
      </div>
    </main>
  );
}
