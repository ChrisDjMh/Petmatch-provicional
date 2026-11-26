import { useState } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { logEntries, type LogType } from "@/data/bitacora";

const dateTimeFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const TYPE_LABEL: Record<LogType, string> = {
  refugio: "Refugio",
  mascota: "Mascota",
  solicitud: "Solicitud de adopción",
  hito: "Hito",
  donacion: "Donación",
};

const fieldClass =
  "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";

export default function LogPage() {
  // Filtros de RF-61: por tipo de registro y por fecha (desde / hasta, ambos días incluidos).
  const [type, setType] = useState<"" | LogType>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const invalidRange = from !== "" && to !== "" && from > to;

  // Las fechas vienen como "AAAA-MM-DDTHH:MM:SS", así que los primeros 10 caracteres son el día.
  const visible = invalidRange
    ? []
    : logEntries
        .filter(
          (e) =>
            (!type || e.type === type) &&
            (!from || e.date.slice(0, 10) >= from) &&
            (!to || e.date.slice(0, 10) <= to),
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasFilters = type !== "" || from !== "" || to !== "";

  return (
    <SuperAdminLayout>
      <div>
        <p className="anim-fade-up eyebrow text-ink/70">Supervisión</p>
        <h1
          style={{ animationDelay: "80ms" }}
          className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Bitácora
        </h1>
        <p
          style={{ animationDelay: "160ms" }}
          className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
        >
          Historial de cambios de estado de la plataforma, del más reciente al más antiguo. Es solo de
          lectura: los registros no se pueden editar ni borrar.
        </p>
      </div>

      <form
        aria-label="Filtros de la bitácora"
        onSubmit={(event) => event.preventDefault()}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end"
      >
        <div>
          <label htmlFor="log-type" className="mb-2 block text-sm font-extrabold">
            Tipo de registro
          </label>
          <select
            id="log-type"
            value={type}
            onChange={(event) => setType(event.target.value as "" | LogType)}
            className={fieldClass}
          >
            <option value="">Todos los tipos</option>
            {(Object.keys(TYPE_LABEL) as LogType[]).map((key) => (
              <option key={key} value={key}>
                {TYPE_LABEL[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="log-from" className="mb-2 block text-sm font-extrabold">
            Desde
          </label>
          <input
            id="log-from"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="log-to" className="mb-2 block text-sm font-extrabold">
            Hasta
          </label>
          <input
            id="log-to"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            className={fieldClass}
          />
        </div>
        <button
          type="button"
          disabled={!hasFilters}
          onClick={() => {
            setType("");
            setFrom("");
            setTo("");
          }}
          className="rounded-full border-2 border-ink/80 px-5 py-3 text-sm font-extrabold transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Limpiar filtros
        </button>
      </form>

      <p role="status" className="mt-4 text-sm font-bold text-ink/70">
        {invalidRange
          ? "⚠ La fecha inicial no puede ser posterior a la final."
          : visible.length === 1
            ? "1 registro"
            : `${visible.length} registros`}
      </p>

      <section
        aria-label="Registros de la bitácora"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            {invalidRange
              ? "Corrige el rango de fechas para ver los registros."
              : "No hay registros con estos filtros. Prueba con otro tipo o con otras fechas."}
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left lg:table">
              <caption className="sr-only">Cambios de estado registrados</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Fecha y hora</th>
                  <th scope="col" className="px-4 py-3">Tipo</th>
                  <th scope="col" className="px-4 py-3">Registro</th>
                  <th scope="col" className="px-4 py-3">Cambio</th>
                  <th scope="col" className="px-4 py-3">Quién</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e) => (
                  <tr key={e.id} className="border-t border-ink/10 align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-ink/80">
                      {dateTimeFormat.format(new Date(e.date))}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-extrabold">
                        {TYPE_LABEL[e.type]}
                      </span>
                    </td>
                    <th scope="row" className="px-4 py-4 text-sm font-bold">{e.subject}</th>
                    <td className="px-4 py-4 text-sm font-semibold">
                      <span className="text-ink/65">{e.from}</span>
                      <span aria-label="cambió a"> → </span>
                      <span>{e.to}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-ink/80">{e.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 lg:hidden">
              {visible.map((e) => (
                <li key={e.id} className="rounded-2xl bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold">
                      {TYPE_LABEL[e.type]}
                    </span>
                    <span className="text-xs font-semibold text-ink/60">
                      {dateTimeFormat.format(new Date(e.date))}
                    </span>
                  </div>
                  <p className="mt-3 font-bold">{e.subject}</p>
                  <p className="mt-1 text-sm font-semibold">
                    <span className="text-ink/65">{e.from}</span>
                    <span aria-label="cambió a"> → </span>
                    {e.to}
                  </p>
                  <p className="mt-2 text-sm text-ink/65">Por: {e.author}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </SuperAdminLayout>
  );
}