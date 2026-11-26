import { useState } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { donations, type DonationStatus, type DonationType } from "@/data/donaciones";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });
const moneyFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const TYPE_LABEL: Record<DonationType, string> = {
  unica: "Única",
  mensual: "Mensual",
  "post-adopcion": "Post-adopción",
};

const STATUS_BADGE: Record<DonationStatus, { label: string; className: string }> = {
  exitosa: { label: "Exitosa", className: "bg-accent" },
  pendiente: { label: "Pendiente", className: "bg-white" },
  fallida: { label: "Fallida", className: "bg-ink text-background" },
};

const selectClass =
  "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";

const shelterNames = [...new Set(donations.map((d) => d.shelterName))].sort((a, b) =>
  a.localeCompare(b, "es"),
);

export default function DonationsPage() {
  // Filtros de RF-19: por refugio y por estado.
  const [shelter, setShelter] = useState("");
  const [status, setStatus] = useState<"" | DonationStatus>("");

  const visible = donations
    .filter((d) => (!shelter || d.shelterName === shelter) && (!status || d.status === status))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = visible.filter((d) => d.status === "exitosa").reduce((sum, d) => sum + d.amount, 0);
  const hasFilters = shelter !== "" || status !== "";

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Supervisión</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Donaciones
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
          >
            Registro de las donaciones de la plataforma. Es solo de consulta: el dinero va directo a la
            cuenta de cada refugio y PetMatch no lo mueve ni lo retiene.
          </p>
        </div>
        <div className="anim-fade-up rounded-2xl bg-accent px-5 py-3 text-right">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/70">
            Exitosas en esta vista
          </p>
          <p className="font-heading text-2xl font-bold">{moneyFormat.format(total)}</p>
        </div>
      </div>

      <form
        aria-label="Filtros de donaciones"
        onSubmit={(event) => event.preventDefault()}
        className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div>
          <label htmlFor="filter-shelter" className="mb-2 block text-sm font-extrabold">
            Refugio
          </label>
          <select
            id="filter-shelter"
            value={shelter}
            onChange={(event) => setShelter(event.target.value)}
            className={selectClass}
          >
            <option value="">Todos los refugios</option>
            {shelterNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="mb-2 block text-sm font-extrabold">
            Estado
          </label>
          <select
            id="filter-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as "" | DonationStatus)}
            className={selectClass}
          >
            <option value="">Todos los estados</option>
            <option value="exitosa">Exitosa</option>
            <option value="pendiente">Pendiente</option>
            <option value="fallida">Fallida</option>
          </select>
        </div>
        <button
          type="button"
          disabled={!hasFilters}
          onClick={() => {
            setShelter("");
            setStatus("");
          }}
          className="rounded-full border-2 border-ink/80 px-5 py-3 text-sm font-extrabold transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Limpiar filtros
        </button>
      </form>

      <p role="status" className="mt-4 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 donación" : `${visible.length} donaciones`}
      </p>

      <section
        aria-label="Lista de donaciones"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            No hay donaciones con estos filtros. Prueba con otro refugio o estado.
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">Donaciones registradas</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Refugio</th>
                  <th scope="col" className="px-4 py-3">Donante</th>
                  <th scope="col" className="px-4 py-3">Fecha</th>
                  <th scope="col" className="px-4 py-3">Tipo</th>
                  <th scope="col" className="px-4 py-3 text-right">Monto</th>
                  <th scope="col" className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id} className="border-t border-ink/10">
                    <th scope="row" className="px-4 py-4 font-heading text-base font-bold">
                      {d.shelterName}
                    </th>
                    <td className="px-4 py-4 font-semibold text-ink/80">{d.donor}</td>
                    <td className="px-4 py-4 font-semibold text-ink/80">{dateFormat.format(new Date(d.date))}</td>
                    <td className="px-4 py-4 font-semibold text-ink/80">{TYPE_LABEL[d.type]}</td>
                    <td className="px-4 py-4 text-right font-extrabold">{moneyFormat.format(d.amount)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${STATUS_BADGE[d.status].className}`}>
                        {STATUS_BADGE[d.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 md:hidden">
              {visible.map((d) => (
                <li key={d.id} className="rounded-2xl bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-heading text-lg font-bold">{d.shelterName}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[d.status].className}`}>
                      {STATUS_BADGE[d.status].label}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-2xl font-bold">{moneyFormat.format(d.amount)}</p>
                  <p className="mt-1 text-sm font-semibold text-ink/70">
                    {d.donor} · {TYPE_LABEL[d.type]}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/60">{dateFormat.format(new Date(d.date))}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </SuperAdminLayout>
  );
}