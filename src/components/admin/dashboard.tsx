import Link from "next/link";
import { AdminIcon } from "./AdminIcon";

// Colores de datos validados con la guía de dataviz (superficie blanca).
// La serie única usa el azul de datos; los estados son fijos y siempre van con ícono + texto.
const SERIES = "#2a78d6";
const SERIES_TRACK = "#cde2fb";

export const STATUS = {
  ok: { color: "#0ca30c", icon: "ok" },
  advertencia: { color: "#fab219", icon: "alerta" },
  importante: { color: "#ec835a", icon: "alerta" },
  critico: { color: "#d03b3b", icon: "critico" },
} as const;

export type StatusKey = keyof typeof STATUS;

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-black/[.08] bg-white p-5 ${className}`}>
      <h2 className="font-semibold text-primary-dark">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-black/[.08] bg-white p-4 sm:p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 break-words text-2xl font-semibold text-primary-dark sm:text-3xl">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </div>
  );
}

export function Meter({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-zinc-600">{label}</span>
        <span className="font-semibold text-primary-dark">
          {value} de {total} <span className="font-normal text-zinc-500">({pct}%)</span>
        </span>
      </div>
      <div
        className="mt-1.5 h-2.5 overflow-hidden rounded-full"
        style={{ backgroundColor: SERIES_TRACK }}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SERIES }} />
      </div>
    </div>
  );
}

export function StatusRow({
  status,
  label,
  count,
  okText,
  href,
}: {
  status: StatusKey;
  label: string;
  count: number;
  okText: string;
  href: string;
}) {
  const resuelto = count === 0;
  const s = resuelto ? STATUS.ok : STATUS[status];
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span style={{ color: s.color }}>
        <AdminIcon name={s.icon} className="h-5 w-5" />
      </span>
      <span className="flex-1 text-sm text-primary-dark">{label}</span>
      {resuelto ? (
        <span className="text-sm text-zinc-500">{okText}</span>
      ) : (
        <>
          <span className="text-sm font-semibold text-primary-dark">{count}</span>
          <Link href={href} className="text-sm font-semibold text-accent hover:text-accent-hover">
            Revisar →
          </Link>
        </>
      )}
    </li>
  );
}

export function StackedBar({
  segments,
}: {
  segments: { key: string; label: string; count: number; status: StatusKey }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const visibles = segments.filter((s) => s.count > 0);
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  return (
    <div>
      {total === 0 ? (
        <p className="text-sm text-zinc-500">Todavía no hay repuestos cargados.</p>
      ) : (
        <div className="flex h-4 gap-[2px]">
          {visibles.map((s, i) => (
            <div
              key={s.key}
              tabIndex={0}
              className={`group relative h-full outline-none ${i === 0 ? "rounded-l" : ""} ${
                i === visibles.length - 1 ? "rounded-r" : ""
              }`}
              style={{ flexGrow: s.count, backgroundColor: STATUS[s.status].color }}
            >
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-primary-dark px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block group-focus-visible:block">
                {s.label}: {s.count} ({pct(s.count)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span style={{ color: STATUS[s.status].color }}>
              <AdminIcon name={STATUS[s.status].icon} className="h-4 w-4" />
            </span>
            <span className="text-zinc-600">{s.label}</span>
            <span className="font-semibold text-primary-dark">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({
  rows,
  unidad,
  vacio,
}: {
  rows: { label: string; value: number }[];
  unidad: [singular: string, plural: string];
  vacio: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  if (rows.length === 0) {
    return <p className="text-sm text-zinc-500">{vacio}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const pct = total === 0 ? 0 : Math.round((r.value / total) * 100);
        const texto = `${r.value} ${r.value === 1 ? unidad[0] : unidad[1]}`;
        return (
          <li
            key={r.label}
            tabIndex={0}
            className="group relative grid grid-cols-[7.5rem_1fr] items-center gap-3 rounded-md outline-none"
          >
            <span className="truncate text-sm text-zinc-600" title={r.label}>
              {r.label}
            </span>
            <div className="flex items-center gap-2 border-l border-black/15 py-1">
              {r.value > 0 ? (
                <div
                  className="h-4 rounded-r transition-opacity group-hover:opacity-80"
                  style={{ width: `${(r.value / max) * 85}%`, backgroundColor: SERIES }}
                />
              ) : null}
              <span className="text-sm font-semibold text-primary-dark">{r.value}</span>
              {r.value === 0 ? <span className="text-xs text-zinc-500">vacía</span> : null}
            </div>
            <span className="pointer-events-none absolute -top-9 left-0 z-10 hidden max-w-full rounded-md bg-primary-dark px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block group-focus-visible:block">
              {r.label}: {texto} ({pct}% del total)
            </span>
          </li>
        );
      })}
    </ul>
  );
}
