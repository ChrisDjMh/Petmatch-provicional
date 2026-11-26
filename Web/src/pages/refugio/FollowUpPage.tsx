import { Link } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import AdoptionTabs from "@/components/panel/AdoptionTabs";
import { adoptionRequests } from "@/data/adopciones";
import { completedMilestones, getDeliveryDate, milestoneRecords } from "@/data/entregas";
import { CURRENT_SHELTER, findActiveInterview, useInterviews } from "@/data/entrevistas";
import { addDays, buildMilestones, GRACE_DAYS, type MilestoneState } from "@/lib/hitos";

const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });
const fmt = (date: string) => dayFormat.format(new Date(`${date}T12:00:00`));

/* Estado que se muestra: es el de RN-12, más "Completado con retraso" cuando un hito vencido se registró tarde. */
type DisplayState = MilestoneState | "completado-con-retraso";

const STATE_LABEL: Record<DisplayState, string> = {
  pendiente: "Pendiente",
  disponible: "Disponible",
  completado: "✓ Completado",
  "completado-con-retraso": "✓ Completado con retraso",
  vencido: "! Vencido",
};

const STATE_BADGE: Record<DisplayState, string> = {
  pendiente: "bg-white",
  disponible: "bg-white border-2 border-ink",
  completado: "bg-accent",
  "completado-con-retraso": "bg-accent",
  vencido: "bg-ink text-background",
};

export default function FollowUpPage() {
  const interviews = useInterviews().filter((i) => i.shelterId === CURRENT_SHELTER.id);

  // Adopciones concretadas (con entrega registrada) y sus cinco hitos (RF-46).
  const adoptions = adoptionRequests
    .filter((r) => r.status === "aprobada")
    .flatMap((request) => {
      const deliveryDate = getDeliveryDate(request.id);
      if (!deliveryDate) return [];
      const records = milestoneRecords[request.id] ?? {};
      const milestones = buildMilestones(deliveryDate, completedMilestones[request.id] ?? []).map((m) => {
        const record = records[m.days];
        const late = m.state === "completado" && record && record.registeredAt > addDays(m.dueDate, GRACE_DAYS);
        const display: DisplayState = late ? "completado-con-retraso" : m.state;
        return { ...m, display, record };
      });
      return [{ request, deliveryDate, milestones }];
    });

  const overdue = adoptions.flatMap((a) =>
    a.milestones.filter((m) => m.state === "vencido").map((m) => ({ adoption: a, milestone: m })),
  );

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
        Seguimiento de las mascotas que ya fueron entregadas: los cinco hitos de cada adopción y lo que
        registró el adoptante.
      </p>

      <AdoptionTabs />

      <section
        id="hitos-vencidos"
        aria-labelledby="overdue-title"
        className="anim-fade-up mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="overdue-title" className="font-heading text-2xl font-bold">
            Hitos vencidos
          </h2>
          <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${overdue.length > 0 ? "bg-ink text-background" : "bg-white"}`}>
            {overdue.length}
          </span>
        </div>
        {overdue.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-white px-5 py-6 text-center font-semibold text-ink/70">
            No hay hitos vencidos. Los seguimientos van al corriente.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {overdue.map(({ adoption, milestone }) => (
              <li
                key={`${adoption.request.id}-${milestone.days}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5"
              >
                <div>
                  <p className="font-extrabold">
                    Hito de {milestone.days} días · {adoption.request.pet}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">
                    {adoption.request.adopter} no lo registró. Debía hacerlo el {fmt(milestone.dueDate)}.
                  </p>
                </div>
                <Link
                  to={`/refugio/adopciones/${adoption.request.id}`}
                  className="rounded-full border-2 border-ink/80 px-4 py-2 text-sm font-extrabold transition hover:bg-cards-2/40"
                >
                  Ver adopción<span className="sr-only"> de {adoption.request.pet}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {adoptions.length === 0 ? (
        <section className="anim-fade-up mt-8 rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft backdrop-blur">
          <h2 className="font-heading text-2xl font-bold">Aún no hay adopciones entregadas</h2>
          <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
            Cuando registres la entrega de una mascota, aquí aparecerán sus cinco hitos de seguimiento.
          </p>
        </section>
      ) : (
        <ul aria-label="Adopciones entregadas" className="mt-8 space-y-6">
          {adoptions.map(({ request, deliveryDate, milestones }) => {
            const done = milestones.filter((m) => m.record).length;
            return (
              <li
                key={request.id}
                className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-2xl font-bold">{request.pet}</h2>
                    <p className="mt-1 text-sm text-ink/70">
                      Adoptado por {request.adopter} · Entregado el {fmt(deliveryDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-extrabold">
                    {done} de 5 registrados
                  </span>
                </div>

                <ol className="mt-5 space-y-3">
                  {milestones.map((m) => {
                    const interview = findActiveInterview(interviews, request.id, "seguimiento", m.days);
                    return (
                      <li key={m.days} className="rounded-2xl bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-extrabold">Hito de {m.days} días</p>
                            <p className="text-sm text-ink/65">{fmt(m.dueDate)}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${STATE_BADGE[m.display]}`}>
                            {STATE_LABEL[m.display]}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ink/70">
                          <span>
                            Entrevista de seguimiento:{" "}
                            <strong className="font-semibold text-ink">
                              {interview
                                ? interview.status === "realizada"
                                  ? "Realizada"
                                  : "Programada"
                                : "Sin programar"}
                            </strong>
                          </span>
                          <Link
                            to={interview ? "/refugio/entrevistas/agenda" : "/refugio/entrevistas?tipo=despues"}
                            className="font-extrabold underline-offset-4 hover:underline"
                          >
                            {interview ? "Ver en agenda" : "Programar entrevista"}
                          </Link>
                        </div>

                        {m.record && (
                          <details className="group mt-3 border-t border-ink/10 pt-3">
                            <summary className="cursor-pointer text-sm font-extrabold underline-offset-4 hover:underline">
                              Ver lo que registró el adoptante
                              <span className="sr-only"> del hito de {m.days} días de {request.pet}</span>
                            </summary>
                            <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,12rem)_1fr]">
                              <img
                                src={m.record.photo}
                                alt={`Foto de ${request.pet} en el hito de ${m.days} días`}
                                loading="lazy"
                                className="aspect-4/3 w-full rounded-2xl object-cover"
                              />
                              <dl className="space-y-3 text-sm">
                                <div>
                                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                                    Registrado el
                                  </dt>
                                  <dd className="mt-0.5 font-semibold">{fmt(m.record.registeredAt)}</dd>
                                </div>
                                <div>
                                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                                    Estado de salud
                                  </dt>
                                  <dd className="mt-0.5 leading-6">{m.record.health}</dd>
                                </div>
                                <div>
                                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                                    Adaptación
                                  </dt>
                                  <dd className="mt-0.5 leading-6">{m.record.adaptation}</dd>
                                </div>
                                <div>
                                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                                    Comentarios
                                  </dt>
                                  <dd className="mt-0.5 leading-6">{m.record.comments}</dd>
                                </div>
                              </dl>
                            </div>
                          </details>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ul>
      )}
    </ShelterAdminLayout>
  );
}