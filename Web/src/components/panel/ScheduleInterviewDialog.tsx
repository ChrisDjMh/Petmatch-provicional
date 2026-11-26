import { useEffect, useRef, useState, type FormEvent } from "react";
import { TextAreaField, TextField } from "@/components/auth/TextField";
import { todayStr } from "@/lib/hitos";
import {
  formatMoment,
  interviewReminders,
  interviewTitle,
  toDate,
  validateSchedule,
  type Interview,
  type InterviewKind,
  type ScheduleErrors,
} from "@/lib/entrevistas";

export type ScheduleFormValues = { date: string; time: string; address: string; message: string };

const MESSAGE_MAX = 300;

type Props = {
  open: boolean;
  mode: "agendar" | "reprogramar";
  adopter: string;
  pet: string;
  kind: InterviewKind;
  milestoneDays?: number;
  /** Valores con los que arranca el formulario (el domicilio, o los datos de la entrevista al reprogramar). */
  initial: { date?: string; time?: string; address?: string; message?: string };
  /** Otras entrevistas programadas del refugio, para no empalmar horarios. */
  others: Interview[];
  onSubmit: (values: ScheduleFormValues) => void;
  onCancel: () => void;
};

function ScheduleForm({
  mode,
  kind,
  milestoneDays,
  initial,
  others,
  onSubmit,
  onCancel,
}: Omit<Props, "open" | "adopter" | "pet">) {
  const [date, setDate] = useState(initial.date ?? "");
  const [time, setTime] = useState(initial.time ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [message, setMessage] = useState(initial.message ?? "");
  const [errors, setErrors] = useState<ScheduleErrors & { message?: string }>({});

  const now = new Date();
  const hasMoment = date !== "" && time !== "" && toDate(date, time).getTime() > now.getTime();
  const reminders = hasMoment ? interviewReminders(date, time) : [];
  const title = interviewTitle({ kind, milestoneDays }).toLowerCase();

  function submit(event: FormEvent) {
    event.preventDefault();
    const found: ScheduleErrors & { message?: string } = validateSchedule({ date, time, address }, others);
    if (message.length > MESSAGE_MAX) found.message = `Máximo ${MESSAGE_MAX} caracteres.`;
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit({ date, time, address, message });
  }

  return (
    <form onSubmit={submit} noValidate className="mt-5 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="interview-date"
          label="Fecha"
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <TextField
          id="interview-time"
          label="Hora"
          type="time"
          step={900}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          error={errors.time}
        />
      </div>

      <TextField
        id="interview-address"
        label="Domicilio del adoptante"
        autoComplete="off"
        placeholder="Calle, número, colonia y ciudad"
        hint="Ahí se hará la entrevista. Revísalo con el adoptante si no estás seguro."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={errors.address}
      />

      <TextAreaField
        id="interview-message"
        label="Mensaje para el adoptante (opcional)"
        rows={3}
        maxLength={MESSAGE_MAX + 50}
        placeholder="Por ejemplo: qué documentos tener a la mano."
        hint={`${message.length}/${MESSAGE_MAX} · Lo verá en la notificación.`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={errors.message}
      />

      <div className="rounded-2xl bg-cards-2/40 p-4 text-sm leading-6">
        <p className="font-extrabold">Avisos al adoptante</p>
        <ul className="mt-2 space-y-1.5">
          <li>
            <strong>Al guardar:</strong> recibe la notificación de la {title}.
          </li>
          {hasMoment ? (
            reminders.map((r) => (
              <li key={r.key}>
                <strong>{r.label}:</strong> {formatMoment(r.at)}
                {r.at.getTime() <= now.getTime() && (
                  <span className="text-ink/70"> · ya pasó, este aviso no se enviará</span>
                )}
              </li>
            ))
          ) : (
            <>
              <li>
                <strong>Un día antes:</strong> a las 12:00 p. m.
              </li>
              <li>
                <strong>El mismo día:</strong> 3 horas antes de la entrevista.
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border-2 border-ink/80 px-6 py-3 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]"
        >
          Volver
        </button>
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85 active:scale-[0.98]"
        >
          {mode === "agendar" ? "Agendar y avisar" : "Guardar y avisar"}
        </button>
      </div>
    </form>
  );
}

/* Ventana para agendar una entrevista o cambiar su fecha. El formulario se monta solo al abrir, así cada
   vez empieza limpio (o con los datos de la entrevista que se reprograma). */
export default function ScheduleInterviewDialog(props: Props) {
  const { open, mode, adopter, pet, kind, milestoneDays, onCancel } = props;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const heading =
    mode === "reprogramar"
      ? "Reprogramar entrevista"
      : kind === "seguimiento"
        ? `Agendar entrevista del hito de ${milestoneDays} días`
        : "Agendar entrevista a domicilio";

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby="schedule-title"
      className="m-auto max-h-[90vh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] bg-white p-8 text-ink shadow-soft backdrop:bg-ink/60"
    >
      {open && (
        <>
          <h2 id="schedule-title" className="font-heading text-2xl font-bold">
            {heading}
          </h2>
          <p className="mt-3 leading-7 text-ink/75">
            Con <strong>{adopter}</strong>, por <strong>{pet}</strong>.
            {mode === "reprogramar" && " Se le avisará del cambio."}
          </p>
          <ScheduleForm {...props} />
        </>
      )}
    </dialog>
  );
}