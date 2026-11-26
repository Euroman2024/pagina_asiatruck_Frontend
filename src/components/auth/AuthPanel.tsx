"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { GoogleButton, googleDisponible } from "./GoogleButton";

type Vista = "login" | "registro" | "verificar";

interface EnvioCodigo {
  email: string;
  reenviarEnSegundos: number;
  minutos: number;
}

const inputClass =
  "h-11 w-full rounded-lg border border-black/[.12] bg-white px-3 text-sm text-primary-dark outline-none transition-colors focus:border-accent";
const primaryButton =
  "h-11 w-full rounded-full bg-accent text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60";

export function AuthPanel({
  inicial = "login",
  onSuccess,
}: {
  inicial?: "login" | "registro";
  /** Se llama cuando la sesión quedó iniciada */
  onSuccess: () => void;
}) {
  const [vista, setVista] = useState<Vista>(inicial);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comentario, setComentario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [minutos, setMinutos] = useState(10);
  const [espera, setEspera] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const codigoRef = useRef<HTMLInputElement>(null);

  // Cuenta regresiva para poder pedir otro código
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  useEffect(() => {
    if (vista === "verificar") codigoRef.current?.focus();
  }, [vista]);

  function cambiarVista(nueva: Vista) {
    setVista(nueva);
    setError(null);
    setAviso(null);
    setCodigo("");
  }

  function irAVerificar(envio: EnvioCodigo, mensaje?: string) {
    setEmail(envio.email);
    setMinutos(envio.minutos);
    setEspera(envio.reenviarEnSegundos);
    setVista("verificar");
    setError(null);
    setCodigo("");
    setAviso(mensaje ?? null);
  }

  async function ejecutar(accion: () => Promise<void>, errorGenerico: string) {
    setError(null);
    setCargando(true);
    try {
      await accion();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : errorGenerico);
    } finally {
      setCargando(false);
    }
  }

  function iniciarSesion(e: FormEvent) {
    e.preventDefault();
    ejecutar(async () => {
      try {
        await api.post("/auth/login", { email, password });
        onSuccess();
      } catch (err) {
        if (!(err instanceof ApiError) || err.code !== "EMAIL_NO_VERIFICADO") throw err;
        // La cuenta existe pero falta verificar el correo: se envía un código y se pasa a ese paso
        let envio: EnvioCodigo = { email: email.trim().toLowerCase(), reenviarEnSegundos: 0, minutos: 10 };
        try {
          envio = await api.post<EnvioCodigo>("/auth/resend-code", { email });
        } catch {
          // Si hay que esperar para reenviar, sigue valiendo el último código enviado
        }
        irAVerificar(envio, "Tu correo todavía no está verificado. Ingresa el código que te enviamos.");
      }
    }, "No se pudo iniciar sesión");
  }

  function registrar(e: FormEvent) {
    e.preventDefault();
    ejecutar(async () => {
      const envio = await api.post<EnvioCodigo>("/auth/register", {
        email,
        password,
        nombre: nombre.trim() || undefined,
        telefono,
        comentario: comentario.trim() || undefined,
      });
      irAVerificar(envio);
    }, "No se pudo crear la cuenta");
  }

  function entrarConGoogle(credential: string) {
    setAviso(null);
    ejecutar(async () => {
      await api.post("/auth/google", { credential });
      onSuccess();
    }, "No se pudo entrar con Google");
  }

  function verificar(valor: string) {
    ejecutar(async () => {
      await api.post("/auth/verify-email", { email, codigo: valor });
      onSuccess();
    }, "No se pudo verificar el código");
  }

  function reenviar() {
    setAviso(null);
    ejecutar(async () => {
      const envio = await api.post<EnvioCodigo>("/auth/resend-code", { email });
      setEspera(envio.reenviarEnSegundos);
      setMinutos(envio.minutos);
      setCodigo("");
      setAviso("Te enviamos un código nuevo.");
      codigoRef.current?.focus();
    }, "No se pudo reenviar el código");
  }

  const mensajes = (
    <>
      {aviso ? (
        <p className="rounded-lg border border-black/[.08] bg-surface px-3 py-2 text-sm text-zinc-700">{aviso}</p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent-hover">
          {error}
        </p>
      ) : null}
    </>
  );

  if (vista === "verificar") {
    return (
      <div>
        <h2 className="text-xl font-bold text-primary-dark">Verifica tu correo</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Enviamos un código de 6 dígitos a <span className="font-semibold text-primary-dark">{email}</span>.
          Vence en {minutos} minutos.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verificar(codigo);
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Código de verificación</span>
            <input
              ref={codigoRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              value={codigo}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCodigo(valor);
                if (valor.length === 6 && !cargando) verificar(valor);
              }}
              placeholder="000000"
              className="h-14 w-full rounded-lg border border-black/[.12] bg-white text-center text-2xl font-bold tracking-[0.5em] text-primary-dark outline-none transition-colors placeholder:text-zinc-300 focus:border-accent"
            />
          </label>

          {mensajes}

          <button type="submit" disabled={cargando || codigo.length !== 6} className={primaryButton}>
            {cargando ? "Verificando…" : "Verificar y entrar"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm">
          <button
            type="button"
            onClick={reenviar}
            disabled={espera > 0 || cargando}
            className="font-semibold text-accent hover:text-accent-hover disabled:text-zinc-400"
          >
            {espera > 0 ? `Reenviar código en ${espera} s` : "Reenviar código"}
          </button>
          <button
            type="button"
            onClick={() => cambiarVista("registro")}
            className="text-zinc-600 hover:text-primary-dark"
          >
            Usar otro correo
          </button>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          ¿No lo ves? Revisa la carpeta de spam o correo no deseado.
        </p>
      </div>
    );
  }

  const esLogin = vista === "login";

  return (
    <div>
      <div className="grid grid-cols-2 rounded-full bg-surface p-1 text-sm font-semibold">
        {(["login", "registro"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => cambiarVista(v)}
            aria-pressed={vista === v}
            className={`h-9 rounded-full transition-colors ${
              vista === v ? "bg-white text-accent shadow-sm" : "text-zinc-600 hover:text-primary-dark"
            }`}
          >
            {v === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>

      <h2 className="mt-6 text-xl font-bold text-primary-dark">
        {esLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        {esLogin
          ? "Ingresa con tu correo y contraseña."
          : "Te enviaremos un código a tu correo para verificarlo."}
      </p>

      <form onSubmit={esLogin ? iniciarSesion : registrar} className="mt-6 flex flex-col gap-4">
        {!esLogin ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Nombre</span>
            <input
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
          </label>
        ) : null}

        {!esLogin ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Teléfono</span>
            <input
              type="tel"
              required
              autoComplete="tel"
              pattern="\+?[\d\s\-]{7,20}"
              title="Solo números; puedes incluir el código de país con +"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="099 123 4567"
              className={inputClass}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Correo electrónico</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-zinc-700">
            Contraseña
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              className="text-xs font-semibold text-accent hover:text-accent-hover"
            >
              {verPassword ? "Ocultar" : "Mostrar"}
            </button>
          </span>
          <input
            type={verPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete={esLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {!esLogin ? <span className="mt-1 block text-xs text-zinc-500">Mínimo 6 caracteres.</span> : null}
        </label>

        {!esLogin ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              ¿Qué repuesto necesitas? <span className="font-normal text-zinc-500">(opcional)</span>
            </span>
            <textarea
              rows={3}
              maxLength={500}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Ej.: pastillas de freno para JAC HFC 1061, año 2019"
              className="w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-primary-dark outline-none transition-colors focus:border-accent"
            />
          </label>
        ) : null}

        {mensajes}

        <button type="submit" disabled={cargando} className={primaryButton}>
          {cargando
            ? esLogin
              ? "Ingresando…"
              : "Creando cuenta…"
            : esLogin
              ? "Ingresar"
              : "Crear cuenta"}
        </button>
      </form>

      {googleDisponible ? (
        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-400">
            <span className="h-px flex-1 bg-black/10" />o<span className="h-px flex-1 bg-black/10" />
          </div>
          <div className="mt-5">
            <GoogleButton onCredential={entrarConGoogle} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
