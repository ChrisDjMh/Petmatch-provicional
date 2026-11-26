/* Hitos de seguimiento post-adopción (RN-12, RF-41). Son cinco y fijos: a los 7, 30, 90, 180 y 365 días
   naturales desde la fecha de entrega. Un hito pasa de Pendiente a Disponible cuando llega su fecha, y de
   ahí a Completado, o a Vencido si no se registra dentro de los 3 días naturales siguientes.
   Las fechas se manejan como texto "AAAA-MM-DD" para evitar errores de zona horaria. */
export const MILESTONE_DAYS = [7, 30, 90, 180, 365] as const;
export type MilestoneDays = (typeof MILESTONE_DAYS)[number];

/* Días de gracia después de la fecha del hito antes de marcarlo Vencido. */
export const GRACE_DAYS = 3;

export type MilestoneState = "pendiente" | "disponible" | "completado" | "vencido";

export const MILESTONE_STATE_LABEL: Record<MilestoneState, string> = {
  pendiente: "Pendiente",
  disponible: "Disponible",
  completado: "Completado",
  vencido: "Vencido",
};

/** Fecha de hoy, en la zona horaria de quien usa la pantalla. */
export function todayStr(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function milestoneState(dueDate: string, completed: boolean, today: string): MilestoneState {
  if (completed) return "completado";
  if (today < dueDate) return "pendiente";
  if (today > addDays(dueDate, GRACE_DAYS)) return "vencido";
  return "disponible";
}

export function buildMilestones(
  deliveryDate: string,
  completedDays: readonly number[] = [],
  today: string = todayStr(),
) {
  return MILESTONE_DAYS.map((days) => {
    const dueDate = addDays(deliveryDate, days);
    return { days, dueDate, state: milestoneState(dueDate, completedDays.includes(days), today) };
  });
}