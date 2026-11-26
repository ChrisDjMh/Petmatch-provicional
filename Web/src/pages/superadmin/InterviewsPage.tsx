import { useState } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { SelectField } from "@/components/panel/FormControls";
import { useInterviews } from "@/data/entrevistas";
import {
  formatDay,
  formatTime,
  interviewTitle,
  KIND_LABEL,
  needsResult,
  STATUS_BADGE,
  STATUS_LABEL,
  type Interview,
  type InterviewKind,
  type InterviewStatus,
} from "@/lib/entrevistas";

type KindFilter = "todas" | InterviewKind;
type StatusFilter = "todas" | InterviewStatus;

const KIND_FILTERS: { key: KindFilter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "adopcion", label: "Antes de adoptar" },
  { key: "seguimiento", label: "Seguimiento" },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "todas", label: "Todos los estados" },
  { key: "programada", label: "Programadas" },
  { key: "realizada", label: "Realizadas" },
  { key: "cancelada", label: "Canceladas" },
];

const stamp = (i: Interview) => `${i.date}T${i.time}`;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
        active ? "bg-ink text-background" : "bg-white/60 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

/* Texto que se abre debajo de cada entrevista: mensaje, observaciones o motivo de cancelación. */
function InterviewDetails({ interview }: { interview: Interview }) {
  const rows = [
    { label: "Domicilio", value: interview.address },
    { label: "Mensaje al adoptante", value: interview.message },
    { label: "Observaciones del refugio", value: interview.notes },
    { label: "Motivo de la cancelación", value: interview.cancelReason },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));

  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className={r.label === "Observaciones del refugio" ? "sm:col-span-2" : undefined}>
          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">{r.label}</dt>
          <dd className="mt-0.5 break-words leading-6">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function InterviewsPage() {
  // Solo lectura: el Super Admin supervisa las entrevistas de todos los refugios, no las agenda.
  const all = useInterviews();
  const [shelter, setShelter] = useState("");
  const [kind, setKind] = useState<KindFilter>("todas");
  const [status, setStatus] = useState<StatusFilter>("todas");
  const now = new Date();

  const shelterNames = Array.from(new Set(all.map((i) => i.shelterName))).sort((a, b) => a.localeCompare(b, "es"));

  const visible = all
    .filter((i) => (shelter === "" || i.shelterName === shelter) && (kind === "todas" || i.kind === kind))
    .filter((i) => status === "todas" || i.status === status)
    .sort((a, b) => stamp(b).localeCompare(stamp(a)));

  // Los totales siguen al refugio y a la clase elegidos, no al filtro de estado.
  const scope = all.filter((i) => (shelter === "" || i.shelterName === shelter) && (kind === "todas" || i.kind === kind));
  const totals: { label: string; value: number }[] = [
    { label: "Programadas", value: scope.filter((i) => i.status === "programada").length },
    { label: "Realizadas", value: scope.filter((i) => i.status === "realizada").length },
    { label: "Canceladas", value: scope.filter((i) => i.status === "cancelada").length },
  ];

  return (
    <SuperAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">Supervisión</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Entrevistas
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Entrevistas que hacen los refugios con los adoptantes, antes y después de adoptar. Aquí solo se
        consultan: cada refugio agenda y registra las suyas.
      </p>

      <ul aria-label="Totales" className="mt-8 grid gap-3 sm:grid-cols-3">
        {totals.map((t) => (
          <li key={t.label} className="rounded-2xl bg-white/70 p-5 shadow-soft backdrop-blur">
            <p className="font-heading text-4xl font-bold">{t.value}</p>
            <p className="mt-1 text-sm font-extrabold text-ink/70">{t.label}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-end">
        <SelectField
          id="interviews-shelter"
          label="Refugio"
          placeholder="Todos los refugios"
          options={shelterNames}
          value={shelter}
          onChange={(e) => setShelter(e.target.value)}
        />
        <div role="group" aria-label="Filtrar por clase de entrevista" className="flex flex-wrap gap-2">
          {KIND_FILTERS.map((item) => (
            <Chip key={item.key} active={kind === item.key} onClick={() => setKind(item.key)}>
              {item.label}
            </Chip>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Filtrar por estado" className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((item) => (
          <Chip key={item.key} active={status === item.key} onClick={() => setStatus(item.key)}>
            {item.label}
          </Chip>
        ))}
      </div>

      <p role="status" className="mt-4 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 entrevista" : `${visible.length} entrevistas`}
      </p>

      <section
        aria-label="Lista de entrevistas"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            No hay entrevistas con estos filtros.
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">Entrevistas de los refugios</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Fecha</th>
                  <th scope="col" className="px-4 py-3">Refugio</th>
                  <th scope="col" className="px-4 py-3">Adoptante y mascota</th>
                  <th scope="col" className="px-4 py-3">Clase</th>
                  <th scope="col" className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((i) => (
                  <tr key={i.id} className="border-t border-ink/10 align-top">
                    <td className="px-4 py-4 text-sm font-semibold">
                      <span className="inline-block first-letter:uppercase">{formatDay(i.date)}</span>
                      <br />
                      <span className="text-ink/70">{formatTime(i.time)}</span>
                    </td>
                    <td className="px-4 py-4 font-heading text-base font-bold">{i.shelterName}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="font-extrabold">{i.adopter}</span>
                      <br />
                      <span className="text-ink/70">{i.pet}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {interviewTitle(i)}
                      <br />
                      <span className="text-ink/60">{KIND_LABEL[i.kind]}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${STATUS_BADGE[i.status]}`}>
                        {needsResult(i, now) ? "Sin resultado" : STATUS_LABEL[i.status]}
                      </span>
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-extrabold underline-offset-4 hover:underline">
                          Ver detalle<span className="sr-only"> de la entrevista con {i.adopter}</span>
                        </summary>
                        <div className="mt-3 w-72">
                          <InterviewDetails interview={i} />
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 md:hidden">
              {visible.map((i) => (
                <li key={i.id} className="rounded-2xl bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-heading text-lg font-bold">{i.shelterName}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[i.status]}`}>
                      {needsResult(i, now) ? "Sin resultado" : STATUS_LABEL[i.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink/75">
                    {i.adopter} · {i.pet}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/60">
                    {interviewTitle(i)} · {formatDay(i.date)}, {formatTime(i.time)}
                  </p>
                  <details className="mt-3 border-t border-ink/10 pt-3">
                    <summary className="cursor-pointer text-sm font-extrabold underline-offset-4 hover:underline">
                      Ver detalle<span className="sr-only"> de la entrevista con {i.adopter}</span>
                    </summary>
                    <div className="mt-3">
                      <InterviewDetails interview={i} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </SuperAdminLayout>
  );
}