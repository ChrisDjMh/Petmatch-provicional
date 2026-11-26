import { useState } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import ReasonDialog from "@/components/panel/ReasonDialog";
import { initialShelters, type Shelter, type ShelterStatus } from "@/data/refugios";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

type Filter = "todos" | ShelterStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Activos" },
  { key: "suspendido", label: "Suspendidos" },
];

const STATUS_BADGE: Record<ShelterStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-accent" },
  suspendido: { label: "Suspendido", className: "bg-ink text-background" },
};

const actionClass =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-[0.98]";

export default function ActiveSheltersPage() {
  // Por ahora solo frontend: los cambios no se guardan; con backend se enviarán a la API (RF-17, RF-18).
  const [shelters, setShelters] = useState<Shelter[]>(initialShelters);
  const [filter, setFilter] = useState<Filter>("todos");
  const [suspending, setSuspending] = useState<Shelter | null>(null);
  const [reactivating, setReactivating] = useState<Shelter | null>(null);
  const [notice, setNotice] = useState("");

  const visible = shelters.filter((s) => filter === "todos" || s.status === filter);

  function suspend(reason: string) {
    if (!suspending) return;
    const target = suspending;
    setShelters((list) =>
      list.map((s) =>
        s.id === target.id
          ? { ...s, status: "suspendido", suspensionReason: reason, suspendedAt: new Date().toISOString() }
          : s,
      ),
    );
    setNotice(`${target.shelterName} quedó suspendido. Se avisó a ${target.email}.`);
    setSuspending(null);
  }

  function reactivate() {
    if (!reactivating) return;
    const target = reactivating;
    setShelters((list) =>
      list.map((s) =>
        s.id === target.id
          ? { ...s, status: "activo", suspensionReason: undefined, suspendedAt: undefined }
          : s,
      ),
    );
    setNotice(`${target.shelterName} volvió a estar activo.`);
    setReactivating(null);
  }

  function actionButton(shelter: Shelter) {
    return shelter.status === "activo" ? (
      <button
        type="button"
        onClick={() => setSuspending(shelter)}
        className={`${actionClass} border-2 border-ink/80 hover:bg-cards-2/40`}
      >
        Suspender<span className="sr-only"> a {shelter.shelterName}</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setReactivating(shelter)}
        className={`${actionClass} bg-ink text-background hover:bg-ink/85`}
      >
        Reactivar<span className="sr-only"> a {shelter.shelterName}</span>
      </button>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Supervisión</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Refugios activos
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
          >
            Refugios aprobados. Un refugio suspendido deja de aparecer en la app y no recibe solicitudes
            ni donaciones, pero conserva su información e historial.
          </p>
        </div>
        <span className="anim-fade-up inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-extrabold">
          {shelters.filter((s) => s.status === "activo").length} activos
        </span>
      </div>

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
            {item.label}
          </button>
        ))}
      </div>

      {/* Aviso de la última acción; los lectores de pantalla lo anuncian solos. */}
      <p
        role="status"
        className={notice ? "anim-fade-up mt-4 rounded-2xl bg-accent px-5 py-3 text-sm font-bold" : "sr-only"}
      >
        {notice}
      </p>

      <section
        aria-label="Lista de refugios"
        className="anim-fade-up mt-6 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            No hay refugios con este estado.
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">Refugios aprobados y su estado</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Refugio</th>
                  <th scope="col" className="px-4 py-3">Ciudad</th>
                  <th scope="col" className="px-4 py-3">Estado</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s.id} className="border-t border-ink/10 align-top">
                    <th scope="row" className="px-4 py-4">
                      <span className="font-heading text-lg font-bold">{s.shelterName}</span>
                      <span className="mt-0.5 block text-sm font-semibold text-ink/65">{s.responsible}</span>
                      {s.suspensionReason && (
                        <span className="mt-2 block max-w-md rounded-2xl bg-cards-2/40 p-3 text-sm font-normal leading-6">
                          <strong>Motivo:</strong> {s.suspensionReason}
                        </span>
                      )}
                    </th>
                    <td className="px-4 py-4 font-semibold text-ink/80">{s.city}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${STATUS_BADGE[s.status].className}`}>
                        {STATUS_BADGE[s.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">{actionButton(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 md:hidden">
              {visible.map((s) => (
                <li key={s.id} className="rounded-2xl bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-heading text-xl font-bold">{s.shelterName}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[s.status].className}`}>
                      {STATUS_BADGE[s.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink/70">{s.city} · {s.responsible}</p>
                  <p className="mt-0.5 text-sm text-ink/60">Activo desde el {dateFormat.format(new Date(s.approvedAt))}</p>
                  {s.suspensionReason && (
                    <p className="mt-3 rounded-2xl bg-cards-2/40 p-3 text-sm leading-6">
                      <strong>Motivo:</strong> {s.suspensionReason}
                    </p>
                  )}
                  <div className="mt-4 flex [&>button]:w-full">{actionButton(s)}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <ReasonDialog
        open={suspending !== null}
        title={suspending ? `Suspender a ${suspending.shelterName}` : ""}
        description="El refugio dejará de aparecer en la app y no recibirá solicitudes ni donaciones nuevas. Conserva su información e historial."
        label="Motivo de la suspensión"
        hint="El representante lo verá en su panel y le llegará por correo."
        submitLabel="Suspender refugio"
        onSubmit={suspend}
        onCancel={() => setSuspending(null)}
      />

      <ConfirmDialog
        open={reactivating !== null}
        title={reactivating ? `¿Reactivar a ${reactivating.shelterName}?` : ""}
        confirmLabel="Reactivar"
        onCancel={() => setReactivating(null)}
        onConfirm={reactivate}
      >
        <p>
          Recupera sus funciones y sus mascotas disponibles vuelven a aparecer en la app. Se avisará a{" "}
          {reactivating?.email}.
        </p>
      </ConfirmDialog>
    </SuperAdminLayout>
  );
}