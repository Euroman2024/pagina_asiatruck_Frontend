import Link from "next/link";
import { api } from "@/lib/api";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { BarList, Card, Meter, StackedBar, StatTile, StatusRow } from "@/components/admin/dashboard";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export const dynamic = "force-dynamic";

const STOCK_BAJO = 5;

const ACCIONES = [
  { href: "/admin/repuestos/nuevo", label: "Nuevo repuesto" },
  { href: "/admin/categorias/nuevo", label: "Nueva categoría" },
  { href: "/admin/marcas/nuevo", label: "Nueva marca" },
  { href: "/admin/modelos/nuevo", label: "Nuevo modelo" },
];

const dinero = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
const numero = new Intl.NumberFormat("es-EC");

export default async function AdminHomePage() {
  const [repuestos, categorias, marcas, modelos] = await Promise.all([
    api.get<Repuesto[]>("/repuestos"),
    api.get<Categoria[]>("/categorias"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
  ]);

  const total = repuestos.length;
  const unidades = repuestos.reduce((sum, r) => sum + r.stock, 0);
  const valorInventario = repuestos.reduce((sum, r) => sum + Number(r.precio) * r.stock, 0);

  const sinStock = repuestos.filter((r) => r.stock === 0);
  const stockBajo = repuestos.filter((r) => r.stock > 0 && r.stock < STOCK_BAJO);
  const stockOk = repuestos.filter((r) => r.stock >= STOCK_BAJO);
  const conFoto = repuestos.filter((r) => r.imagenes.length > 0);
  const conDescripcion = repuestos.filter((r) => r.descripcion?.trim());
  const sinCompatibles = repuestos.filter((r) => !r.marcas?.length && !r.compatibilidad?.length);
  const completos = repuestos.filter(
    (r) => r.imagenes.length > 0 && r.descripcion?.trim() && r.stock > 0,
  );

  const repuestosPorCategoria = categorias
    .map((c) => ({ label: c.nombre, value: repuestos.filter((r) => r.categoriaId === c.id).length }))
    .sort((a, b) => b.value - a.value);
  const modelosPorMarca = marcas
    .map((m) => ({ label: m.nombre, value: modelos.filter((mo) => mo.marcaId === m.id).length }))
    .sort((a, b) => b.value - a.value);

  const categoriasVacias = repuestosPorCategoria.filter((c) => c.value === 0).length;
  const marcasSinModelos = modelosPorMarca.filter((m) => m.value === 0).length;
  const completitud = total === 0 ? 0 : Math.round((completos.length / total) * 100);

  const atencion = repuestos
    .map((r) => {
      const problemas: string[] = [];
      if (r.stock === 0) problemas.push("Sin stock");
      else if (r.stock < STOCK_BAJO) problemas.push("Stock bajo");
      if (r.imagenes.length === 0) problemas.push("Sin foto");
      if (!r.descripcion?.trim()) problemas.push("Sin descripción");
      if (!r.marcas?.length && !r.compatibilidad?.length) problemas.push("Sin marca ni modelos");
      return { repuesto: r, problemas };
    })
    .filter((item) => item.problemas.length > 0)
    .sort((a, b) => b.problemas.length - a.problemas.length);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
          <h1 className="text-2xl font-bold text-primary-dark">Panel de administración</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Resumen de tu catálogo: qué tienes cargado y qué te falta completar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCIONES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:scale-105 hover:bg-accent-hover"
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Números principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Repuestos en catálogo" value={numero.format(total)} />
        <StatTile label="Unidades en stock" value={numero.format(unidades)} />
        <StatTile
          label="Valor del inventario"
          value={dinero.format(valorInventario)}
          detail="Precio × stock de cada repuesto"
        />
        <StatTile
          label="Catálogo"
          value={`${categorias.length} · ${marcas.length} · ${modelos.length}`}
          detail="Categorías · marcas · modelos"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Completitud */}
        <Card title="Completitud del catálogo" subtitle="Repuestos con foto, descripción y stock">
          <p className="text-5xl font-semibold text-primary-dark">{completitud}%</p>
          <p className="mt-1 text-sm text-zinc-500">
            {completos.length} de {total} repuestos están completos
          </p>
          <div className="mt-5 space-y-4">
            <Meter label="Con foto" value={conFoto.length} total={total} />
            <Meter label="Con descripción" value={conDescripcion.length} total={total} />
            <Meter label="Con stock" value={total - sinStock.length} total={total} />
          </div>
        </Card>

        {/* Pendientes */}
        <Card title="Pendientes" subtitle="Lo que falta cargar o revisar">
          <ul className="divide-y divide-black/[.06]">
            <StatusRow
              status="critico"
              label="Repuestos sin stock"
              count={sinStock.length}
              okText="Ninguno"
              href="/admin/repuestos"
            />
            <StatusRow
              status="advertencia"
              label={`Stock bajo (menos de ${STOCK_BAJO} u.)`}
              count={stockBajo.length}
              okText="Ninguno"
              href="/admin/repuestos"
            />
            <StatusRow
              status="importante"
              label="Repuestos sin foto"
              count={total - conFoto.length}
              okText="Todos tienen"
              href="/admin/repuestos"
            />
            <StatusRow
              status="advertencia"
              label="Repuestos sin descripción"
              count={total - conDescripcion.length}
              okText="Todos tienen"
              href="/admin/repuestos"
            />
            <StatusRow
              status="advertencia"
              label="Repuestos sin marca ni modelos"
              count={sinCompatibles.length}
              okText="Todos tienen"
              href="/admin/repuestos"
            />
            <StatusRow
              status="advertencia"
              label="Categorías sin repuestos"
              count={categoriasVacias}
              okText="Ninguna"
              href="/admin/categorias"
            />
            <StatusRow
              status="advertencia"
              label="Marcas sin modelos"
              count={marcasSinModelos}
              okText="Ninguna"
              href="/admin/modelos"
            />
          </ul>
        </Card>
      </div>

      {/* Stock */}
      <Card title="Estado del stock" subtitle={`${numero.format(total)} repuestos según su stock`}>
        <StackedBar
          segments={[
            { key: "sin", label: "Sin stock", count: sinStock.length, status: "critico" },
            { key: "bajo", label: `Bajo (1–${STOCK_BAJO - 1} u.)`, count: stockBajo.length, status: "advertencia" },
            { key: "ok", label: `OK (${STOCK_BAJO}+ u.)`, count: stockOk.length, status: "ok" },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Repuestos por categoría">
          <BarList
            rows={repuestosPorCategoria}
            unidad={["repuesto", "repuestos"]}
            vacio="Todavía no hay categorías."
          />
        </Card>
        <Card title="Modelos por marca">
          <BarList rows={modelosPorMarca} unidad={["modelo", "modelos"]} vacio="Todavía no hay marcas." />
        </Card>
      </div>

      {/* Tabla de atención */}
      <Card
        title="Repuestos que necesitan atención"
        subtitle={
          atencion.length === 0
            ? "Todos los repuestos tienen foto, descripción y buen stock."
            : `${atencion.length} de ${total} repuestos tienen algo pendiente`
        }
      >
        {atencion.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="py-2 pr-4 font-medium">Repuesto</th>
                  <th className="py-2 pr-4 font-medium">Categoría</th>
                  <th className="py-2 pr-4 text-right font-medium">Stock</th>
                  <th className="py-2 pr-4 font-medium">Pendiente</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[.06]">
                {atencion.map(({ repuesto, problemas }) => (
                  <tr key={repuesto.id} className="hover:bg-surface">
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-primary-dark">{repuesto.nombre}</p>
                      <p className="text-xs text-zinc-500">{repuesto.sku}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-zinc-600">{repuesto.categoria?.nombre ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-primary-dark">
                      {repuesto.stock}
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        {problemas.map((p) => (
                          <span
                            key={p}
                            className="rounded-full border border-black/10 bg-surface px-2 py-0.5 text-xs text-zinc-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/admin/repuestos/${repuesto.id}/editar`}
                        className="whitespace-nowrap font-semibold text-accent hover:text-accent-hover"
                      >
                        Completar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
