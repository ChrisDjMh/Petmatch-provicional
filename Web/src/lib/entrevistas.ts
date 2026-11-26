/* Entrevistas de adopción: tipos, textos y reglas de fechas y avisos.
   Hay dos clases de entrevista:
   - "adopcion": antes de adoptar. El refugio revisa la solicitud, agenda una entrevista con el adoptante en
     su domicilio y, después de hacerla, decide si acepta o no la solicitud.
   - "seguimiento": después de adoptar, una por cada hito (7, 30, 90, 180 y 365 días).
   Avisos push al adoptante: uno el día anterior a las 12:00 p. m. y otro 3 horas antes de la entrevista.
   Las fechas y horas se manejan como texto "AAAA-MM-DD" y "HH:MM", igual que los hitos. */
import { addDays, todayStr } from "@/lib/hitos";

export type InterviewKind = "adopcion" | "seguimiento";
export type InterviewStatus = "programada" | "realizada" | "cancelada";

export type Interview = {
  id: string;
  shelterId: string;
  shelterName: string;
  /** Solicitud de adopción a la que pertenece. */
  requestId: string;
  adopter: string;
  pet: string;
  kind: InterviewKind;
  /** Solo en seguimiento: días del hito al que corresponde. */
  milestoneDays?: number;
  /** "AAAA-MM-DD". */
  date: string;
  /** "HH:MM", 24 horas. */
  time: string;
  /** Domicilio del adoptante, donde se hace la entrevista. */
  address: string;
  /** Mensaje opcional que el adoptante lee en su aviso. */
  message?: string;
  status: InterviewStatus;
  /** Solo si se realizó: observaciones del refugio. */
  notes?: string;
  /** Solo si se canceló: motivo que se le envió al adoptante. */
  cancelReason?: string;
};

export const KIND_LABEL: Record<InterviewKind, string> = {
  adopcion: "Antes de adoptar",
  seguimiento: "Seguimiento",
};

export const STATUS_LABEL: Record<InterviewStatus, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

export const STATUS_BADGE: Record<InterviewStatus, string> = {
  programada: "bg-accent",
  realizada: "bg-ink text-background",
  cancelada: "bg-white/60 text-ink/70",
};

/** Nombre de la entrevista para mostrar: "Entrevista a domicilio" o "Entrevista del hito de 30 días". */
export function interviewTitle(i: Pick<Interview, "kind" | "milestoneDays">): string {
  return i.kind === "seguimiento" && i.milestoneDays
    ? `Entrevista del hito de ${i.milestoneDays} días`
    : "Entrevista a domicilio";
}

/* ---------- Fechas y horas ---------- */

export function toDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

const dayFormat = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" });
const shortDayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
const timeFormat = new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit", hour12: true });

/** "miércoles 25 de noviembre". */
export const formatDay = (date: string) => dayFormat.format(toDate(date, "12:00"));
/** "25 nov". */
export const formatShortDay = (date: string) => shortDayFormat.format(toDate(date, "12:00"));
/** "10:00 a.m.". */
export const formatTime = (time: string) => timeFormat.format(toDate("2000-01-01", time));
/** "25 nov, 12:00 p.m.". */
export const formatMoment = (moment: Date) => `${shortDayFormat.format(moment)}, ${timeFormat.format(moment)}`;

/** "Hoy" o "Mañana" cuando aplica; si no, texto vacío. */
export function relativeDay(date: string, today: string = todayStr()): string {
  if (date === today) return "Hoy";
  if (date === addDays(today, 1)) return "Mañana";
  return "";
}

/* ---------- Avisos push al adoptante ---------- */

/** Hora del aviso del día anterior. */
export const REMINDER_DAY_BEFORE_TIME = "12:00";
/** Horas antes de la entrevista para el aviso del mismo día. */
export const REMINDER_HOURS_BEFORE = 3;

export type Reminder = {
  key: "dia-antes" | "mismo-dia";
  label: string;
  /** Momento exacto en que se envía. */
  at: Date;
};

export function interviewReminders(date: string, time: string): Reminder[] {
  const start = toDate(date, time);
  return [
    {
      key: "dia-antes",
      label: "Un día antes, a las 12:00 p. m.",
      at: toDate(addDays(date, -1), REMINDER_DAY_BEFORE_TIME),
    },
    {
      key: "mismo-dia",
      label: `El mismo día, ${REMINDER_HOURS_BEFORE} horas antes`,
      at: new Date(start.getTime() - REMINDER_HOURS_BEFORE * 60 * 60 * 1000),
    },
  ];
}

/** Una entrevista programada cuya hora ya pasó y sigue sin resultado registrado. */
export function needsResult(i: Pick<Interview, "status" | "date" | "time">, now: Date = new Date()): boolean {
  return i.status === "programada" && toDate(i.date, i.time).getTime() < now.getTime();
}

/* ---------- Validación al agendar o reprogramar ---------- */

/** Tiempo mínimo entre dos entrevistas del mismo refugio. */
export const MIN_GAP_MINUTES = 60;

export type ScheduleValues = { date: string; time: string; address: string };
export type ScheduleErrors = Partial<Record<keyof ScheduleValues, string>>;

export function validateSchedule(
  values: ScheduleValues,
  others: Interview[],
  now: Date = new Date(),
): ScheduleErrors {
  const errors: ScheduleErrors = {};

  if (!values.date) errors.date = "Elige la fecha de la entrevista.";
  if (!values.time) errors.time = "Elige la hora de la entrevista.";

  if (values.date && values.time) {
    const start = toDate(values.date, values.time);
    if (start.getTime() <= now.getTime()) {
      if (values.date < todayStr(now)) errors.date = "Esa fecha ya pasó. Elige hoy o una fecha posterior.";
      else errors.time = "Esa hora ya pasó. Elige una hora posterior a la actual.";
    } else {
      // Otra entrevista programada del mismo refugio muy cerca de esa hora.
      const clash = others.find(
        (o) =>
          o.status === "programada" &&
          o.date === values.date &&
          Math.abs(toDate(o.date, o.time).getTime() - start.getTime()) < MIN_GAP_MINUTES * 60 * 1000,
      );
      if (clash) {
        errors.time = `Ya tienes una entrevista a las ${formatTime(clash.time)} ese día. Deja al menos una hora entre entrevistas.`;
      }
    }
  }

  if (values.address.trim().length < 10) {
    errors.address = "Escribe el domicilio completo del adoptante para llegar a la entrevista.";
  }

  return errors;
}