import { useMemo, useState } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import {
  adminDeliveries,
  updateAdminDeliveryStatus,
  type DeliveryStatus,
} from "@/data/entregasAdmin";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS: Record<DeliveryStatus, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-amber-100 text-amber-900" },
  entregado: { label: "Entregado", className: "bg-accent text-ink" },
  cancelado: { label: "Cancelado", className: "bg-ink text-background" },
};

const selectClass =
  "rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-bold text-ink outline-none transition focus:border-ink";

export default function DeliveriesPage() {
  const [status, setStatus] = useState<"" | DeliveryStatus>("");
  const [shelter, setShelter] = useState("");
  const [search, setSearch] = useState("");
  const [, setRevision] = useState(0);

  const shelters = useMemo(
    () => [...new Set(adminDeliveries.map((item) => item.shelterName))].sort((a, b) => a.localeCompare(b, "es")),
    [],
  );
  const visible = adminDeliveries
    .filter((item) => {
      const query = search.trim().toLocaleLowerCase("es-MX");
      const matchesSearch =
        !query ||
        [item.id, item.recipient, item.address, item.shelterName].some((value) =>
          value.toLocaleLowerCase("es-MX").includes(query),
        );
      return matchesSearch && (!status || item.status === status) && (!shelter || item.shelterName === shelter);
    })
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const counts = {
    pendiente: adminDeliveries.filter((item) => item.status === "pendiente").length,
    entregado: adminDeliveries.filter((item) => item.status === "entregado").length,
    cancelado: adminDeliveries.filter((item) => item.status === "cancelado").length,
  };
  const hasFilters = Boolean(status || shelter || search);

  function changeStatus(id: string, nextStatus: DeliveryStatus) {
    updateAdminDeliveryStatus(id, nextStatus);
    setRevision((value) => value + 1);
  }

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ink/70">Supervisión</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Entregas</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/70">
            Consulta las entregas registradas en PetMatch y actualiza su estado operativo.
          </p>
        </div>
        <div className="rounded-2xl bg-accent px-5 py-3 text-right">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/70">Total de entregas</p>
          <p className="font-heading text-2xl font-bold tabular-nums">{adminDeliveries.length}</p>
        </div>
      </div>

      <section aria-label="Resumen de estados" className="mt-7 grid gap-3 sm:grid-cols-3">
        {(["pendiente", "entregado", "cancelado"] as DeliveryStatus[]).map((key) => (
          <div key={key} className="rounded-2xl bg-white/75 p-4 shadow-soft">
            <p className="text-sm font-bold text-ink/65">{STATUS[key].label}</p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums">{counts[key]}</p>
          </div>
        ))}
      </section>

      <section aria-label="Filtros de entregas" className="mt-7 grid gap-4 rounded-[2rem] bg-white/65 p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="delivery-search" className="mb-2 block text-sm font-extrabold">Buscar</label>
          <input
            id="delivery-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Folio, persona, dirección..."
            className={`${selectClass} w-full`}
          />
        </div>
        <div>
          <label htmlFor="delivery-shelter" className="mb-2 block text-sm font-extrabold">Refugio</label>
          <select id="delivery-shelter" value={shelter} onChange={(event) => setShelter(event.target.value)} className={`${selectClass} w-full`}>
            <option value="">Todos los refugios</option>
            {shelters.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="delivery-status" className="mb-2 block text-sm font-extrabold">Estado</label>
          <select id="delivery-status" value={status} onChange={(event) => setStatus(event.target.value as "" | DeliveryStatus)} className={`${selectClass} w-full`}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button
          type="button"
          disabled={!hasFilters}
          onClick={() => { setSearch(""); setShelter(""); setStatus(""); }}
          className="rounded-full border-2 border-ink/80 px-5 py-3 text-sm font-extrabold transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Limpiar
        </button>
      </section>

      <p role="status" className="mt-5 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 entrega encontrada" : `${visible.length} entregas encontradas`}
      </p>

      <section aria-label="Listado de entregas" className="mt-3 space-y-3">
        {visible.length === 0 ? (
          <div className="rounded-[2rem] bg-white/70 px-6 py-14 text-center shadow-soft">
            <h2 className="font-heading text-2xl font-bold">No encontramos entregas</h2>
            <p className="mt-2 text-ink/70">Prueba con otro folio, refugio o estado.</p>
          </div>
        ) : visible.map((item) => (
          <article key={item.id} className="rounded-[2rem] bg-white/75 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/55">{item.id}</p>
                <h2 className="mt-1 font-heading text-xl font-bold">{item.shelterName}</h2>
                <p className="mt-1 text-sm text-ink/70">Persona destinataria: <strong className="text-ink">{item.recipient}</strong></p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${STATUS[item.status].className}`}>
                {STATUS[item.status].label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-cards-2/50 p-3">
                <p className="font-extrabold">Fecha y hora</p>
                <p className="mt-1 text-ink/75">{dateFormat.format(new Date(item.date))} · {timeFormat.format(new Date(item.date))}</p>
              </div>
              <div className="rounded-xl bg-cards-2/50 p-3">
                <p className="font-extrabold">Dirección de entrega</p>
                <p className="mt-1 text-ink/75">{item.address}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
              <label htmlFor={`status-${item.id}`} className="text-sm font-extrabold">Cambiar estado</label>
              <select
                id={`status-${item.id}`}
                value={item.status}
                onChange={(event) => changeStatus(item.id, event.target.value as DeliveryStatus)}
                className={selectClass}
              >
                <option value="pendiente">Pendiente</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </article>
        ))}
      </section>
    </SuperAdminLayout>
  );
}
