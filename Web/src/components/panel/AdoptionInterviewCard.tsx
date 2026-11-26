import { useState } from "react";
import { Link } from "react-router-dom";
import ReasonDialog from "@/components/panel/ReasonDialog";
import ScheduleInterviewDialog, { type ScheduleFormValues } from "@/components/panel/ScheduleInterviewDialog";
import {
  completeInterview,
  CURRENT_SHELTER,
  findActiveInterview,
  getHomeAddress,
  scheduleInterview,
  useInterviews,
} from "@/data/entrevistas";
import {
  formatDay,
  formatTime,
  interviewTitle,
  needsResult,
  STATUS_BADGE,
  STATUS_LABEL,
} from "@/lib/entrevistas";

const primary =
  "flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";
const secondary =
  "flex w-full items-center justify-center rounded-full border-2 border-ink/80 px-6 py-3.5 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]";

/* Paso previo a la decisión: la entrevista a domicilio con el adoptante. Solo se muestra en solicitudes
   pendientes. Mientras no esté realizada, el refugio no puede aprobar la solicitud. */
export default function AdoptionInterviewCard({
  requestId,
  adopter,
  pet,
}: {
  requestId: string;
  adopter: string;
  pet: string;
}) {
  const all = useInterviews();
  const mine = all.filter((i) => i.shelterId === CURRENT_SHELTER.id);
  const interview = findActiveInterview(mine, requestId, "adopcion");
  const [scheduling, setScheduling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const overdue = interview ? needsResult(interview) : false;

  function schedule(values: ScheduleFormValues) {
    scheduleInterview({ requestId, adopter, pet, kind: "adopcion", ...values });
    setScheduling(false);
  }

  function complete(notes: string) {
    if (interview) completeInterview(interview.id, notes);
    setCompleting(false);
  }

  return (
    <section
      aria-labelledby="adoption-interview-title"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="adoption-interview-title" className="font-heading text-2xl font-bold">
          Entrevista
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            interview ? STATUS_BADGE[interview.status] : "bg-white"
          }`}
        >
          {interview ? (overdue ? "Falta registrar" : STATUS_LABEL[interview.status]) : "Sin agendar"}
        </span>
      </div>

      {!interview && (
        <>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            Antes de decidir, visita a {adopter} en su domicilio para conocerlo y ver dónde viviría {pet}. Al
            agendarla se le envía una notificación.
          </p>
          <button type="button" onClick={() => setScheduling(true)} className={`${primary} mt-5`}>
            Agendar entrevista
          </button>
        </>
      )}

      {interview?.status === "programada" && (
        <>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            {overdue
              ? "La hora de la entrevista ya pasó. Registra cómo te fue para poder decidir."
              : "Ya está agendada. Cuando la hagas, registra el resultado para poder decidir."}
          </p>
          <dl className="mt-4 space-y-3 rounded-2xl bg-white p-4 text-sm">
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Cuándo</dt>
              <dd className="mt-0.5 font-semibold">
                <span className="inline-block first-letter:uppercase">{formatDay(interview.date)}</span>,{" "}
                {formatTime(interview.time)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Dónde</dt>
              <dd className="mt-0.5 break-words font-semibold">{interview.address}</dd>
            </div>
          </dl>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => setCompleting(true)} className={primary}>
              Registrar resultado
            </button>
            <Link to="/refugio/entrevistas/agenda" className={secondary}>
              Reprogramar o cancelar
            </Link>
          </div>
        </>
      )}

      {interview?.status === "realizada" && (
        <>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            Se hizo el {formatDay(interview.date)}, {formatTime(interview.time)}. Ya puedes decidir.
          </p>
          {interview.notes && (
            <blockquote className="mt-4 rounded-2xl bg-cards-2/40 p-4 text-sm leading-6">{interview.notes}</blockquote>
          )}
        </>
      )}

      {scheduling && (
        <ScheduleInterviewDialog
          open
          mode="agendar"
          adopter={adopter}
          pet={pet}
          kind="adopcion"
          initial={{ address: getHomeAddress(requestId) }}
          others={mine}
          onSubmit={schedule}
          onCancel={() => setScheduling(false)}
        />
      )}

      <ReasonDialog
        open={completing}
        title="Registrar resultado de la entrevista"
        description={`Anota lo que viste en el domicilio de ${adopter}. Con esto podrás aprobar o rechazar su solicitud.`}
        label="Observaciones de la entrevista"
        hint="Las ven tu refugio y el Super Admin."
        submitLabel="Guardar resultado"
        requiredMessage="Escribe las observaciones de la entrevista."
        audience="tu equipo"
        onSubmit={complete}
        onCancel={() => setCompleting(false)}
      />
    </section>
  );
}

/* Historial de entrevistas de una solicitud: la de antes de adoptar y las de cada hito. Solo lectura. */
export function InterviewHistory({ requestId }: { requestId: string }) {
  const all = useInterviews();
  const list = all
    .filter((i) => i.shelterId === CURRENT_SHELTER.id && i.requestId === requestId)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  if (list.length === 0) return null;

  return (
    <section aria-labelledby="interview-history-title">
      <h2 id="interview-history-title" className="font-heading text-2xl font-bold">
        Entrevistas
      </h2>
      <ul className="mt-4 space-y-3">
        {list.map((i) => (
          <li key={i.id} className="rounded-2xl bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold">{interviewTitle(i)}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[i.status]}`}>
                {STATUS_LABEL[i.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/70">
              {formatDay(i.date)}, {formatTime(i.time)}
            </p>
            {i.notes && <p className="mt-2 text-sm leading-6 text-ink/85">{i.notes}</p>}
            {i.cancelReason && <p className="mt-2 text-sm leading-6 text-ink/85">Cancelada: {i.cancelReason}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}