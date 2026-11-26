import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { adoptionRequests } from "@/data/adopciones";
import { getDeliveryDate, registerDelivery } from "@/data/entregas";
import { todayStr } from "@/lib/hitos";

type Filter = "todas" | "pendientes" | "entregadas";
const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });
const fmt = (value: string) => dateFormat.format(new Date(`${value}T12:00:00`));

export default function DeliveriesPage() {
  const [filter, setFilter] = useState<Filter>("todas");
  const [dates, setDates] = useState<Record<string, string>>({});
  const [refresh, setRefresh] = useState(0);
  const today = todayStr();

  const records = useMemo(() => adoptionRequests
    .filter((request) => request.status === "aprobada")
    .map((request) => ({ ...request, deliveryDate: getDeliveryDate(request.id) }))
    .sort((a, b) => Number(Boolean(a.deliveryDate)) - Number(Boolean(b.deliveryDate)) || a.pet.localeCompare(b.pet, "es")), [refresh]);

  const visible = records.filter((item) => filter === "todas" || (filter === "pendientes" ? !item.deliveryDate : Boolean(item.deliveryDate)));
  const counts = { todas: records.length, pendientes: records.filter((x) => !x.deliveryDate).length, entregadas: records.filter((x) => x.deliveryDate).length };

  function saveDelivery(requestId: string) {
    const date = dates[requestId] || today;
    if (!date || date > today) return;
    registerDelivery(requestId, date);
    setRefresh((n) => n + 1);
  }

  return (
    <ShelterAdminLayout>
      <p className="eyebrow text-ink/70">Patitas Felices</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Entregas de mascotas</h1>
      <p className="mt-3 max-w-2xl leading-7 text-ink/70">
        Administra las adopciones aprobadas, registra cuándo se entrega cada mascota y consulta las entregas concretadas.
      </p>

      <div role="group" aria-label="Filtrar entregas" className="mt-7 flex flex-wrap gap-2">
        {(["todas", "pendientes", "entregadas"] as Filter[]).map((key) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${filter === key ? "bg-ink text-background" : "bg-white/70 hover:bg-white"}`}>
            {key === "todas" ? "Todas" : key === "pendientes" ? "Pendientes de entrega" : "Entregadas"} ({counts[key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <section className="mt-5 rounded-[2rem] bg-white/70 px-6 py-14 text-center shadow-soft">
          <h2 className="font-heading text-2xl font-bold">No hay entregas en esta lista</h2>
          <p className="mt-2 text-ink/70">Las solicitudes aprobadas aparecerán aquí para registrar su entrega.</p>
        </section>
      ) : (
        <ul className="mt-5 grid gap-4">
          {visible.map((item) => (
            <li key={item.id} className="rounded-[2rem] bg-white/75 p-5 shadow-soft sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/55">Solicitud {item.id}</p>
                  <h2 className="mt-1 font-heading text-2xl font-bold">{item.pet}</h2>
                  <p className="mt-1 text-sm text-ink/70">Adoptante: <strong className="text-ink">{item.adopter}</strong></p>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${item.deliveryDate ? "bg-accent" : "bg-white"}`}>
                  {item.deliveryDate ? "Entregada" : "Pendiente de entrega"}
                </span>
              </div>
              {item.deliveryDate ? (
                <p className="mt-4 rounded-2xl bg-cards-2/50 px-4 py-3 text-sm font-semibold">Fecha de entrega: {fmt(item.deliveryDate)}</p>
              ) : (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-cards-2/50 p-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label htmlFor={`delivery-${item.id}`} className="mb-1.5 block text-sm font-extrabold">Fecha de entrega</label>
                    <input id={`delivery-${item.id}`} type="date" max={today} value={dates[item.id] ?? today}
                      onChange={(e) => setDates((current) => ({ ...current, [item.id]: e.target.value }))}
                      className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 font-semibold" />
                  </div>
                  <button type="button" onClick={() => saveDelivery(item.id)} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background transition hover:bg-ink/85">
                    Registrar entrega
                  </button>
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-ink/60">Al registrar, se habilitan los cinco hitos de seguimiento.</p>
                <Link to={`/refugio/adopciones/${item.id}`} className="rounded-full border-2 border-ink/70 px-4 py-2 text-sm font-extrabold transition hover:bg-cards-2/50">
                  Ver adopción
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ShelterAdminLayout>
  );
}
