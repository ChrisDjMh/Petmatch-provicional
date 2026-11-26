/* Datos de ejemplo de la bitácora (RF-61). Con backend se reemplazan por la consulta real.
   La bitácora es solo de lectura: ningún rol puede editar ni borrar sus registros (RNF-31). */
export type LogType = "refugio" | "mascota" | "solicitud" | "hito" | "donacion";

export type LogEntry = {
  id: string;
  /** Fecha y hora del cambio, en formato ISO. */
  date: string;
  type: LogType;
  /** Qué registro cambió (por ejemplo, el refugio o la mascota). */
  subject: string;
  from: string;
  to: string;
  /** Una persona (nombre y rol) o "Sistema". */
  author: string;
};

export const logEntries: LogEntry[] = [
  { id: "log-001", date: "2026-11-22T18:40:20", type: "donacion", subject: "Donación de $250 a Patitas Felices", from: "Pendiente", to: "Exitosa", author: "Sistema" },
  { id: "log-002", date: "2026-11-22T18:39:50", type: "donacion", subject: "Donación de $250 a Patitas Felices", from: "—", to: "Pendiente", author: "Sistema" },
  { id: "log-003", date: "2026-11-21T10:05:00", type: "hito", subject: "Hito de 7 días de Luna", from: "Pendiente", to: "Disponible", author: "Sistema" },
  { id: "log-004", date: "2026-11-20T09:15:00", type: "solicitud", subject: "Adopción de Max por Camila Reyes", from: "Aprobada", to: "Cancelada", author: "Jorge Ramírez (Admin de Refugio)" },
  { id: "log-005", date: "2026-11-19T17:30:00", type: "mascota", subject: "Max (Patitas Felices)", from: "En proceso de adopción", to: "Disponible", author: "Jorge Ramírez (Admin de Refugio)" },
  { id: "log-006", date: "2026-11-18T13:20:00", type: "refugio", subject: "Hogar Peludo", from: "Suspendido", to: "Activo", author: "Super Admin" },
  { id: "log-007", date: "2026-11-17T11:00:00", type: "solicitud", subject: "Adopción de Luna por Andrea Morales", from: "Pendiente", to: "Aprobada", author: "Ana Cota (Admin de Refugio)" },
  { id: "log-008", date: "2026-11-16T15:45:00", type: "refugio", subject: "Rescate Norteño", from: "Pendiente de verificación", to: "Activo", author: "Super Admin" },
  { id: "log-009", date: "2026-11-15T10:30:00", type: "mascota", subject: "Luna (Huellas de Esperanza)", from: "En proceso de adopción", to: "Adoptada", author: "Ana Cota (Admin de Refugio)" },
  { id: "log-010", date: "2026-11-12T10:00:00", type: "refugio", subject: "Hogar Peludo", from: "Activo", to: "Suspendido", author: "Super Admin" },
  { id: "log-011", date: "2026-11-10T08:00:00", type: "hito", subject: "Hito de 30 días de Toby", from: "Disponible", to: "Vencido", author: "Sistema" },
  { id: "log-012", date: "2026-11-09T12:45:00", type: "refugio", subject: "Colita Alegre", from: "Información adicional requerida", to: "Pendiente de verificación", author: "Pedro Ibarra (Representante)" },
  { id: "log-013", date: "2026-11-05T09:10:00", type: "refugio", subject: "Colita Alegre", from: "Pendiente de verificación", to: "Información adicional requerida", author: "Super Admin" },
  { id: "log-014", date: "2026-11-03T14:20:00", type: "hito", subject: "Hito de 7 días de Toby", from: "Disponible", to: "Completado", author: "Valeria Ochoa (Adoptante)" },
];