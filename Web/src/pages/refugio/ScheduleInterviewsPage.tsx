import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import InterviewTabs from "@/components/panel/InterviewTabs";
import ScheduleInterviewDialog, { type ScheduleFormValues } from "@/components/panel/ScheduleInterviewDialog";
import { adoptionRequests } from "@/data/adopciones";
import { completedMilestones, getDeliveryDate } from "@/data/entregas";
import {
  CURRENT_SHELTER,
  findActiveInterview,
  getHomeAddress,
  scheduleInterview,
  useInterviews,
} from "@/data/entrevistas";
import { buildMilestones, MILESTONE_STATE_LABEL } from "@/lib/hitos";
import { formatDay, formatTime, type InterviewKind } from "@/lib/entrevistas";

const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });
const fmt = (date: string) => dayFormat.format(new Date(`${date}T12:00:00`));

type Tipo = "antes" | "despues";

/* Lo que se puede agendar: una solicitud pendiente (antes de adoptar) o un hito de una adopción entregada. */
type Candidate = {
  key: string;
  requestId: string;
  adopter: string;
  pet: string;
  kind: InterviewKind;
  milestoneDays?: number;
};

const actionBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-[0.98]";
const actionPrimary = `${actionBase} bg-ink text-background hover:bg-ink/85`;
const actionSecondary = `${actionBase} border-2 border-ink/80 hover:bg-cards-2/40`;

export default function ScheduleInterviewsPage() {
  const all = useInterviews();
  const mine = all.filter((i) => i.shelterId === CURRENT_SHELTER.id);

  const [params, setParams] = useSearchParams();
  const tipo: Tipo = params.get("tipo") === "despues" ? "despues" : "antes";
  const [scheduling, setScheduling] = useState<Candidate | null>(null);
  const [notice, setNotice] = useState("");

  /* Antes de adoptar: solicitudes pendientes, según tengan o no su entrevista (RN-06: siguen Pendientes
     hasta que el refugio decide). */
  const pending = adoptionRequests
    .filter((r) => r.status === "pendiente")
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  const toSchedule = pending.filter((r) => !findActiveInterview(mine, r.id, "adopcion"));
  const toDecide = pending.flatMap((r) => {
    const interview = findActiveInterview(mine, r.id, "adopcion");
    return interview?.status === "realizada" ? [{ request: r, interview }] : [];
  });
  const waiting = pending.filter((r) => findActiveInterview(mine, r.id, "adopcion")?.status === "programada");

  /* Después de adoptar: los hitos de cada adopción entregada que aún no tienen entrevista. */
  const adoptions = adoptionRequests
    .filter((r) => r.status === "aprobada")
    .flatMap((request) => {
      const deliveryDate = getDeliveryDate(request.id);
      if (!deliveryDate) return [];
      const rows = buildMilestones(deliveryDate, completedMilestones[request.id] ?? []).filter(
        (m) => !findActiveInterview(mine, request.id, "seguimiento", m.days),
      );
      return [{ request, rows }];
    });
  const postCount = adoptions.reduce((sum, a) => sum + a.rows.length, 0);

  function chooseTipo(next: Tipo) {
    setParams(next === "antes" ? {} : { tipo: next }, { replace: true });
  }

  function handleSchedule(values: ScheduleFormValues) {
    if (!scheduling) return;
    const target = scheduling;
    scheduleInterview({
      requestId: target.requestId,
      adopter: target.adopter,
      pet: target.pet,
      kind: target.kind,
      milestoneDays: target.milestoneDays,
      date: values.date,
      time: values.time,
      address: values.address,
      message: values.message,
    });
    setNotice(
      `Entrevista agendada con ${target.adopter} el ${formatDay(values.date)} a las ${formatTime(values.time)}. ` +
        "Se le envió la notificación y quedaron programados sus avisos.",
    );
    setScheduling(null);
  }

  const TIPOS: { key: Tipo; label: string; count: number }[] = [
    { key: "antes", label: "Antes de adoptar", count: toSchedule.length },
    { key: "despues", label: "Después de adoptar", count: postCount },
  ];

  return (
    <ShelterAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">{CURRENT_SHELTER.name}</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Agendar entrevistas
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Antes de adoptar, visitas al adoptante en su domicilio para conocerlo y decidir si aceptas su
        solicitud. Después de adoptar, una entrevista por cada hito de seguimiento.
      </p>

      <InterviewTabs />

      {notice && (
        <div
          role="status"
          className="anim-fade-up mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent p-4 text-sm font-bold leading-6"
        >
          <p>{notice}</p>
          <Link to="/refugio/entrevistas/agenda" className="underline underline-offset-4 hover:text-ink/70">
            Ver mi agenda
          </Link>
        </div>
      )}

      <div role="group" aria-label="Tipo de entrevista" className="mt-6 flex flex-wrap gap-2">
        {TIPOS.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={tipo === item.key}
            onClick={() => chooseTipo(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              tipo === item.key ? "bg-ink text-background" : "bg-white/60 hover:bg-white"
            }`}
          >
            {item.label} <span className="opacity-70">({item.count})</span>
          </button>
        ))}
      </div>

      {tipo === "antes" && (
        <div className="mt-6 space-y-6">
          <section
            aria-labelledby="to-schedule-title"
            className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="to-schedule-title" className="font-heading text-2xl font-bold">
                Solicitudes por agendar
              </h2>
              <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${toSchedule.length > 0 ? "bg-accent" : "bg-white"}`}>
                {toSchedule.length}
              </span>
            </div>
            {toSchedule.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-white px-5 py-6 text-center font-semibold text-ink/70">
                No hay solicitudes sin entrevista. Todo está agendado.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {toSchedule.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5">
                    <div className="min-w-0">
                      <p className="font-heading text-lg font-bold">{r.adopter}</p>
                      <p className="mt-1 text-sm font-semibold text-ink/75">Quiere adoptar a {r.pet}</p>
                      <p className="mt-0.5 text-sm text-ink/60">Solicitud del {fmt(r.sentAt.slice(0, 10))}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/refugio/adopciones/${r.id}`} className={actionSecondary}>
                        Ver solicitud<span className="sr-only"> de {r.adopter}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setScheduling({
                            key: r.id,
                            requestId: r.id,
                            adopter: r.adopter,
                            pet: r.pet,
                            kind: "adopcion",
                          })
                        }
                        className={actionPrimary}
                      >
                        Agendar<span className="sr-only"> entrevista con {r.adopter}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {toDecide.length > 0 && (
            <section
              aria-labelledby="to-decide-title"
              className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id="to-decide-title" className="font-heading text-2xl font-bold">
                  Entrevista hecha, falta decidir
                </h2>
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold">{toDecide.length}</span>
              </div>
              <ul className="mt-4 space-y-3">
                {toDecide.map(({ request, interview }) => (
                  <li key={request.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5">
                    <div className="min-w-0">
                      <p className="font-heading text-lg font-bold">{request.adopter}</p>
                      <p className="mt-1 text-sm font-semibold text-ink/75">Quiere adoptar a {request.pet}</p>
                      <p className="mt-0.5 text-sm text-ink/60">Entrevista del {fmt(interview.date)}</p>
                    </div>
                    <Link to={`/refugio/adopciones/${request.id}`} className={actionPrimary}>
                      Decidir<span className="sr-only"> la solicitud de {request.adopter}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {waiting.length > 0 && (
            <p className="rounded-2xl bg-white/60 px-5 py-4 text-sm font-semibold text-ink/75">
              {waiting.length === 1 ? "Otra solicitud ya tiene" : `Otras ${waiting.length} solicitudes ya tienen`} su
              entrevista agendada.{" "}
              <Link to="/refugio/entrevistas/agenda" className="font-extrabold underline underline-offset-4">
                Ver mi agenda
              </Link>
            </p>
          )}
        </div>
      )}

      {tipo === "despues" && (
        <div className="mt-6 space-y-6">
          {postCount === 0 ? (
            <section className="anim-fade-up rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft backdrop-blur">
              <h2 className="font-heading text-2xl font-bold">No hay hitos por agendar</h2>
              <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
                Cuando registres la entrega de una mascota, sus cinco hitos aparecerán aquí para agendar la
                entrevista de cada uno.
              </p>
            </section>
          ) : (
            adoptions
              .filter((a) => a.rows.length > 0)
              .map(({ request, rows }) => (
                <section
                  key={request.id}
                  aria-label={`Hitos de ${request.pet}`}
                  className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
                >
                  <h2 className="font-heading text-2xl font-bold">{request.pet}</h2>
                  <p className="mt-1 text-sm text-ink/70">
                    Adoptado por {request.adopter} · Entregado el {fmt(getDeliveryDate(request.id) ?? "")}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {rows.map((m) => (
                      <li key={m.days} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5">
                        <div>
                          <p className="font-extrabold">Hito de {m.days} días</p>
                          <p className="mt-0.5 text-sm text-ink/65">
                            {fmt(m.dueDate)} · {MILESTONE_STATE_LABEL[m.state]}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setScheduling({
                              key: `${request.id}-${m.days}`,
                              requestId: request.id,
                              adopter: request.adopter,
                              pet: request.pet,
                              kind: "seguimiento",
                              milestoneDays: m.days,
                            })
                          }
                          className={actionPrimary}
                        >
                          Agendar<span className="sr-only"> entrevista del hito de {m.days} días de {request.pet}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
          )}
        </div>
      )}

      {scheduling && (
        <ScheduleInterviewDialog
          key={scheduling.key}
          open
          mode="agendar"
          adopter={scheduling.adopter}
          pet={scheduling.pet}
          kind={scheduling.kind}
          milestoneDays={scheduling.milestoneDays}
          initial={{ address: getHomeAddress(scheduling.requestId) }}
          others={mine}
          onSubmit={handleSchedule}
          onCancel={() => setScheduling(null)}
        />
      )}
    </ShelterAdminLayout>
  );
}