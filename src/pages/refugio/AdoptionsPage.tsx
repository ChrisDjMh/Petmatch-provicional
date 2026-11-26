import { useState } from "react";
import { Link } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { adoptionRequests, type AdoptionStatus } from "@/data/adopciones";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type Filter = "todas" | AdoptionStatus;

const STATUS_BADGE: Record<AdoptionStatus, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-accent" },
  aprobada: { label: "Aprobada", className: "bg-ink text-background" },
  rechazada: { label: "Rechazada", className: "bg-white" },
  cancelada: { label: "Cancelada", className: "bg-white/60 text-ink/70" },
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "aprobada", label: "Aprobadas" },
  { key: "rechazada", label: "Rechazadas" },
  { key: "cancelada", label: "Canceladas" },
];

const linkClass =
  "inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";

export default function AdoptionsPage() {
  // Filtro de RF-35: por estado de la solicitud.
  const [filter, setFilter] = useState<Filter>("todas");

  const count = (key: Filter) =>
    key === "todas" ? adoptionRequests.length : adoptionRequests.filter((r) => r.status === key).length;

  const visible = adoptionRequests
    .filter((r) => filter === "todas" || r.status === filter)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return (
    <ShelterAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">Patitas Felices</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Adopciones
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Solicitudes de adopción de las mascotas de tu refugio, de la más reciente a la más antigua.
      </p>

      <div role="group" aria-label="Filtrar por estado" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={filter === item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              filter === item.key ? "bg-ink text-background" : "bg-white/60 hover:bg-white"
            }`}
          >
            {item.label} <span className="opacity-70">({count(item.key)})</span>
          </button>
        ))}
      </div>

      <p role="status" className="mt-4 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 solicitud" : `${visible.length} solicitudes`}
      </p>

      <section
        aria-label="Lista de solicitudes de adopción"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            No hay solicitudes con este estado.
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">Solicitudes de adopción</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Adoptante</th>
                  <th scope="col" className="px-4 py-3">Mascota</th>
                  <th scope="col" className="px-4 py-3">Fecha</th>
                  <th scope="col" className="px-4 py-3">Estado</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="border-t border-ink/10">
                    <th scope="row" className="px-4 py-4 font-heading text-base font-bold">{r.adopter}</th>
                    <td className="px-4 py-4 font-semibold text-ink/80">{r.pet}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-ink/80">{dateFormat.format(new Date(r.sentAt))}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${STATUS_BADGE[r.status].className}`}>
                        {STATUS_BADGE[r.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/refugio/adopciones/${r.id}`} className={linkClass}>
                        Ver<span className="sr-only"> solicitud de {r.adopter} para {r.pet}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 md:hidden">
              {visible.map((r) => (
                <li key={r.id} className="rounded-2xl bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-heading text-lg font-bold">{r.adopter}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[r.status].className}`}>
                      {STATUS_BADGE[r.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink/70">Quiere adoptar a {r.pet}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{dateFormat.format(new Date(r.sentAt))}</p>
                  <Link to={`/refugio/adopciones/${r.id}`} className={`${linkClass} mt-4 w-full`}>
                    Ver solicitud<span className="sr-only"> de {r.adopter} para {r.pet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </ShelterAdminLayout>
  );
}