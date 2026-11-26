import { useState } from "react";
import { Link } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import InterviewTabs from "@/components/panel/InterviewTabs";
import ReasonDialog from "@/components/panel/ReasonDialog";
import ScheduleInterviewDialog, { type ScheduleFormValues } from "@/components/panel/ScheduleInterviewDialog";
import {
  cancelInterview,
  completeInterview,
  CURRENT_SHELTER,
  rescheduleInterview,
  useInterviews,
} from "@/data/entrevistas";
import {
  formatDay,
  formatMoment,
  formatTime,
  interviewReminders,
  interviewTitle,
  KIND_LABEL,
  needsResult,
  relativeDay,
  STATUS_BADGE,
  STATUS_LABEL,
  type Interview,
} from "@/lib/entrevistas";

const TABS = [
  { key: "proximas", label: "Próximas" },
  { key: "realizadas", label: "Realizadas" },
  { key: "canceladas", label: "Canceladas" },
] as const;
type Tab = (typeof TABS)[number]["key"];

const stamp = (i: Interview) => `${i.date}T${i.time}`;
const byMomentAsc = (a: Interview, b: Interview) => stamp(a).localeCompare(stamp(b));
const byMomentDesc = (a: Interview, b: Interview) => stamp(b).localeCompare(stamp(a));

const actionBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-[0.98]";
const actionPrimary = `${actionBase} bg-ink text-background hover:bg-ink/85`;
const actionSecondary = `${actionBase} border-2 border-ink/80 hover:bg-cards-2/40`;

type Notice = { text: string; link?: { to: string; label: string } };

function InterviewItem({
  interview,
  now,
  onComplete,
  onReschedule,
  onCancel,
}: {
  interview: Interview;
  now: Date;
  onComplete: (i: Interview) => void;
  onReschedule: (i: Interview) => void;
  onCancel: (i: Interview) => void;
}) {
  const overdue = needsResult(interview, now);
  const scheduled = interview.status === "programada";

  return (
    <li className="rounded-2xl bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-xl font-bold">
            {formatTime(interview.time)} · {interview.adopter}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink/75">
            {interviewTitle(interview)} · {interview.pet}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-cards-2/60 px-3 py-1 text-xs font-extrabold">
            {KIND_LABEL[interview.kind]}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[interview.status]}`}>
            {STATUS_LABEL[interview.status]}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Domicilio</dt>
          <dd className="mt-0.5 break-words font-semibold">{interview.address}</dd>
        </div>
        {!scheduled && (
          <div>
            <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Fecha</dt>
            <dd className="mt-0.5 font-semibold">
              {formatDay(interview.date)}, {formatTime(interview.time)}
            </dd>
          </div>
        )}
        {interview.message && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
              Mensaje al adoptante
            </dt>
            <dd className="mt-0.5 leading-6 text-ink/85">{interview.message}</dd>
          </div>
        )}
        {interview.notes && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Observaciones</dt>
            <dd className="mt-0.5 leading-6 text-ink/85">{interview.notes}</dd>
          </div>
        )}
        {interview.cancelReason && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
              Motivo de la cancelación
            </dt>
            <dd className="mt-0.5 leading-6 text-ink/85">{interview.cancelReason}</dd>
          </div>
        )}
      </dl>

      {scheduled && overdue && (
        <p className="mt-4 rounded-2xl bg-accent p-3 text-sm font-bold leading-6">
          ! La hora de esta entrevista ya pasó. Registra cómo te fue para poder continuar con la solicitud.
        </p>
      )}

      {scheduled && !overdue && (
        <div className="mt-4 rounded-2xl bg-cards-2/40 p-4 text-sm leading-6">
          <p className="font-extrabold">Avisos push al adoptante</p>
          <ul className="mt-1.5 space-y-1">
            {interviewReminders(interview.date, interview.time).map((r) => {
              const sent = r.at.getTime() <= now.getTime();
              return (
                <li key={r.key}>
                  {sent ? "✓ Enviado" : "Se enviará"} · {r.label.toLowerCase()} ({formatMoment(r.at)})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {scheduled && (
          <>
            <button type="button" onClick={() => onComplete(interview)} className={actionPrimary}>
              Registrar resultado<span className="sr-only"> de {interview.adopter}</span>
            </button>
            <button type="button" onClick={() => onReschedule(interview)} className={actionSecondary}>
              Reprogramar<span className="sr-only"> la entrevista de {interview.adopter}</span>
            </button>
            <button type="button" onClick={() => onCancel(interview)} className={actionSecondary}>
              Cancelar<span className="sr-only"> la entrevista de {interview.adopter}</span>
            </button>
          </>
        )}
        <Link to={`/refugio/adopciones/${interview.requestId}`} className={actionSecondary}>
          Ver solicitud<span className="sr-only"> de {interview.adopter}</span>
        </Link>
      </div>
    </li>
  );
}

export default function AgendaPage() {
  const all = useInterviews();
  const mine = all.filter((i) => i.shelterId === CURRENT_SHELTER.id);
  const now = new Date();

  const [tab, setTab] = useState<Tab>("proximas");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [completing, setCompleting] = useState<Interview | null>(null);
  const [rescheduling, setRescheduling] = useState<Interview | null>(null);
  const [cancelling, setCancelling] = useState<Interview | null>(null);

  const scheduled = mine.filter((i) => i.status === "programada").sort(byMomentAsc);
  const done = mine.filter((i) => i.status === "realizada").sort(byMomentDesc);
  const cancelled = mine.filter((i) => i.status === "cancelada").sort(byMomentDesc);
  const counts: Record<Tab, number> = {
    proximas: scheduled.length,
    realizadas: done.length,
    canceladas: cancelled.length,
  };

  const overdue = scheduled.filter((i) => needsResult(i, now));
  const groups: { date: string; items: Interview[] }[] = [];
  scheduled
    .filter((i) => !needsResult(i, now))
    .forEach((i) => {
      const group = groups.find((g) => g.date === i.date);
      if (group) group.items.push(i);
      else groups.push({ date: i.date, items: [i] });
    });

  function handleComplete(notes: string) {
    if (!completing) return;
    const target = completing;
    completeInterview(target.id, notes);
    setNotice({
      text:
        target.kind === "adopcion"
          ? `Registraste la entrevista con ${target.adopter}. Ya puedes aprobar o rechazar su solicitud.`
          : `Registraste la entrevista del hito de ${target.milestoneDays} días de ${target.pet}.`,
      link: { to: `/refugio/adopciones/${target.requestId}`, label: "Ver solicitud" },
    });
    setCompleting(null);
  }

  function handleReschedule(values: ScheduleFormValues) {
    if (!rescheduling) return;
    const target = rescheduling;
    rescheduleInterview(target.id, values);
    setNotice({ text: `La entrevista con ${target.adopter} se movió. Se le avisó del cambio y se reprogramaron sus avisos.` });
    setRescheduling(null);
  }

  function handleCancel(reason: string) {
    if (!cancelling) return;
    const target = cancelling;
    cancelInterview(target.id, reason);
    setNotice({
      text: `Cancelaste la entrevista con ${target.adopter}. Se le avisó y puedes agendar otra cuando quieras.`,
      link: { to: "/refugio/entrevistas", label: "Agendar entrevistas" },
    });
    setCancelling(null);
  }

  const itemProps = { now, onComplete: setCompleting, onReschedule: setRescheduling, onCancel: setCancelling };

  return (
    <ShelterAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">{CURRENT_SHELTER.name}</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Mi agenda
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Tus entrevistas con adoptantes, por día. Después de cada una registra el resultado para seguir con
        la solicitud.
      </p>

      <InterviewTabs />

      {notice && (
        <div
          role="status"
          className="anim-fade-up mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent p-4 text-sm font-bold leading-6"
        >
          <p>{notice.text}</p>
          {notice.link && (
            <Link to={notice.link.to} className="underline underline-offset-4 hover:text-ink/70">
              {notice.link.label}
            </Link>
          )}
        </div>
      )}

      <div role="group" aria-label="Filtrar entrevistas" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={tab === item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              tab === item.key ? "bg-ink text-background" : "bg-white/60 hover:bg-white"
            }`}
          >
            {item.label} <span className="opacity-70">({counts[item.key]})</span>
          </button>
        ))}
      </div>

      {tab === "proximas" && (
        <div className="mt-6 space-y-6">
          {scheduled.length === 0 && (
            <section className="anim-fade-up rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft backdrop-blur">
              <h2 className="font-heading text-2xl font-bold">No tienes entrevistas próximas</h2>
              <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
                Agenda una desde una solicitud pendiente o desde el seguimiento de una adopción.
              </p>
              <Link to="/refugio/entrevistas" className={`${actionPrimary} mt-6`}>
                Agendar una entrevista
              </Link>
            </section>
          )}

          {overdue.length > 0 && (
            <section
              aria-labelledby="overdue-interviews-title"
              className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
            >
              <h2 id="overdue-interviews-title" className="font-heading text-2xl font-bold">
                Falta registrar el resultado
              </h2>
              <ul className="mt-4 space-y-3">
                {overdue.map((i) => (
                  <InterviewItem key={i.id} interview={i} {...itemProps} />
                ))}
              </ul>
            </section>
          )}

          {groups.map((group) => {
            const relative = relativeDay(group.date);
            const headingId = `day-${group.date}`;
            return (
              <section
                key={group.date}
                aria-labelledby={headingId}
                className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
              >
                <h2 id={headingId} className="font-heading text-2xl font-bold">
                  {relative && <span className="mr-2 rounded-full bg-accent px-3 py-1 text-base">{relative}</span>}
                  <span className="inline-block first-letter:uppercase">{formatDay(group.date)}</span>
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.items.map((i) => (
                    <InterviewItem key={i.id} interview={i} {...itemProps} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {tab !== "proximas" && (
        <section
          aria-label={tab === "realizadas" ? "Entrevistas realizadas" : "Entrevistas canceladas"}
          className="anim-fade-up mt-6 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
        >
          {(tab === "realizadas" ? done : cancelled).length === 0 ? (
            <p className="rounded-2xl bg-white px-5 py-8 text-center font-semibold text-ink/70">
              {tab === "realizadas" ? "Aún no hay entrevistas realizadas." : "No hay entrevistas canceladas."}
            </p>
          ) : (
            <ul className="space-y-3">
              {(tab === "realizadas" ? done : cancelled).map((i) => (
                <InterviewItem key={i.id} interview={i} {...itemProps} />
              ))}
            </ul>
          )}
        </section>
      )}

      <ReasonDialog
        open={completing !== null}
        title="Registrar resultado de la entrevista"
        description={
          completing?.kind === "adopcion"
            ? `Anota lo que viste en el domicilio de ${completing.adopter}. Con esto podrás aprobar o rechazar su solicitud.`
            : `Anota cómo está ${completing?.pet} y cómo va su adaptación.`
        }
        label="Observaciones de la entrevista"
        hint="Las ven tu refugio y el Super Admin."
        submitLabel="Guardar resultado"
        requiredMessage="Escribe las observaciones de la entrevista."
        audience="tu equipo"
        onSubmit={handleComplete}
        onCancel={() => setCompleting(null)}
      />

      <ReasonDialog
        open={cancelling !== null}
        title="Cancelar la entrevista"
        description={
          cancelling
            ? `Se cancelarán los avisos y ${cancelling.adopter} recibirá este motivo en su teléfono.`
            : ""
        }
        label="Motivo de la cancelación"
        hint="El adoptante lo verá en la app."
        submitLabel="Cancelar entrevista"
        requiredMessage="Escribe el motivo de la cancelación."
        audience="el adoptante"
        onSubmit={handleCancel}
        onCancel={() => setCancelling(null)}
      />

      {rescheduling && (
        <ScheduleInterviewDialog
          open
          mode="reprogramar"
          adopter={rescheduling.adopter}
          pet={rescheduling.pet}
          kind={rescheduling.kind}
          milestoneDays={rescheduling.milestoneDays}
          initial={{
            date: rescheduling.date,
            time: rescheduling.time,
            address: rescheduling.address,
            message: rescheduling.message,
          }}
          others={mine.filter((i) => i.id !== rescheduling.id)}
          onSubmit={handleReschedule}
          onCancel={() => setRescheduling(null)}
        />
      )}
    </ShelterAdminLayout>
  );
}