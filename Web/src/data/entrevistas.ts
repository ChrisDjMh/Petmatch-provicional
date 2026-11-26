/* Entrevistas de adopción (ver lib/entrevistas.ts). Con backend se guardan en la base de datos y los avisos
   push los envía el servidor; aquí se simulan en memoria mientras la página esté abierta, igual que las
   entregas y las mascotas. Al recargar la página vuelven los datos de ejemplo.
   Las fechas de las entrevistas próximas se calculan a partir de hoy para que siempre haya algo que ver. */
import { useSyncExternalStore } from "react";
import { addDays, todayStr } from "@/lib/hitos";
import type { Interview, InterviewKind } from "@/lib/entrevistas";

/** Refugio con la sesión iniciada en el panel (dato de ejemplo). */
export const CURRENT_SHELTER = { id: "ref-001", name: "Patitas Felices" };

/* Domicilios de los adoptantes de ejemplo, que en la app salen del perfil del adoptante. */
const homeAddresses: Record<string, string> = {
  "sol-101": "Calle 5 de Mayo 412, Col. Centro, San Luis Río Colorado",
  "sol-102": "Av. Obregón 1180, Col. Bella Vista, San Luis Río Colorado",
  "sol-103": "Calle 24 y Av. Juárez 305, Col. Hidalgo, San Luis Río Colorado",
  "sol-090": "Blvd. Constitución 720, Col. Los Naranjos, San Luis Río Colorado",
  "sol-091": "Calle 12 y Av. Madero 98, Col. Centro, San Luis Río Colorado",
  "sol-092": "Calle Sonora 255, Col. Lomas del Valle, San Luis Río Colorado",
  "sol-081": "Av. Tecnológico 540, Col. Industrial, San Luis Río Colorado",
  "sol-080": "Calle 30 y Av. Hidalgo 67, Col. Jardines, San Luis Río Colorado",
};

export function getHomeAddress(requestId: string): string {
  return homeAddresses[requestId] ?? "";
}

const today = todayStr();

const seed: Interview[] = [
  /* ---------- Patitas Felices (el refugio de la sesión) ---------- */
  {
    id: "ent-001", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-101",
    adopter: "Camila Reyes", pet: "Max", kind: "adopcion",
    date: addDays(today, -1), time: "10:00", address: homeAddresses["sol-101"], status: "realizada",
    notes: "La casa no tiene patio, pero hay espacio interior suficiente y un parque cerca. Camila conoce las necesidades de un perro mediano. Su otra mascota convivió bien con Max en la visita previa.",
  },
  {
    id: "ent-002", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-102",
    adopter: "Diego Armenta", pet: "Luna", kind: "adopcion",
    date: addDays(today, 1), time: "11:00", address: homeAddresses["sol-102"], status: "programada",
    message: "Por favor, que estén en casa las personas que vivirán con la mascota.",
  },
  {
    id: "ent-003", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-090",
    adopter: "Sofía Lara", pet: "Bruno", kind: "adopcion",
    date: "2026-11-16", time: "10:30", address: homeAddresses["sol-090"], status: "realizada",
    notes: "Casa con patio amplio y bardeado. Trabaja desde casa y tiene rutina de paseos. Buen ambiente para un perro grande.",
  },
  {
    id: "ent-004", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-092",
    adopter: "Jorge Beltrán", pet: "Rocky", kind: "adopcion",
    date: "2026-11-11", time: "17:00", address: homeAddresses["sol-092"], status: "realizada",
    notes: "Departamento pequeño y sin área para que el perro se mueva. Pasa muchas horas fuera de casa. No se recomienda la adopción de Rocky.",
  },
  {
    id: "ent-005", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-091",
    adopter: "Camila Reyes", pet: "Max", kind: "adopcion",
    date: "2026-11-13", time: "12:00", address: homeAddresses["sol-091"], status: "cancelada",
    cancelReason: "La solicitud se canceló porque el adoptante cambió de domicilio.",
  },
  {
    id: "ent-006", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-080",
    adopter: "Valeria Ochoa", pet: "Toby", kind: "adopcion",
    date: "2026-10-05", time: "16:00", address: homeAddresses["sol-080"], status: "realizada",
    notes: "Departamento pequeño y ordenado. Toby se adaptaría bien por su tamaño.",
  },
  {
    id: "ent-007", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-080",
    adopter: "Valeria Ochoa", pet: "Toby", kind: "seguimiento", milestoneDays: 30,
    date: "2026-11-12", time: "16:00", address: homeAddresses["sol-080"], status: "realizada",
    notes: "Toby está sano, con buen peso y ya conoce su rutina. Valeria mostró su cartilla de vacunación al día.",
  },
  {
    id: "ent-008", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-081",
    adopter: "Héctor Salas", pet: "Nala", kind: "adopcion",
    date: "2026-11-05", time: "11:00", address: homeAddresses["sol-081"], status: "realizada",
    notes: "Casa tranquila, sin niños pequeños. Espacio ideal para una gata serena.",
  },
  {
    id: "ent-009", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-081",
    adopter: "Héctor Salas", pet: "Nala", kind: "seguimiento", milestoneDays: 7,
    date: "2026-11-18", time: "11:00", address: homeAddresses["sol-081"], status: "realizada",
    notes: "Nala come bien y ya usa su rascador. Sin problemas de adaptación.",
  },
  {
    id: "ent-010", shelterId: "ref-001", shelterName: "Patitas Felices", requestId: "sol-081",
    adopter: "Héctor Salas", pet: "Nala", kind: "seguimiento", milestoneDays: 30,
    date: addDays(today, 3), time: "17:00", address: homeAddresses["sol-081"], status: "programada",
  },

  /* ---------- Otros refugios (solo los ve el Super Admin) ---------- */
  {
    id: "ent-101", shelterId: "ref-002", shelterName: "Huellas de Esperanza", requestId: "ext-201",
    adopter: "Rosa Villalobos", pet: "Canela", kind: "adopcion",
    date: addDays(today, 2), time: "09:30", address: "Calle Río Nuevo 330, Col. Nueva, Mexicali", status: "programada",
  },
  {
    id: "ent-102", shelterId: "ref-002", shelterName: "Huellas de Esperanza", requestId: "ext-188",
    adopter: "Iván Medina", pet: "Pelusa", kind: "seguimiento", milestoneDays: 90,
    date: "2026-11-19", time: "18:00", address: "Av. Reforma 2210, Col. Pueblo Nuevo, Mexicali", status: "realizada",
    notes: "Pelusa se ve saludable y cómoda. La familia cumple con las visitas al veterinario.",
  },
  {
    id: "ent-103", shelterId: "ref-004", shelterName: "Colita Alegre", requestId: "ext-305",
    adopter: "Fernanda Quiroz", pet: "Thor", kind: "adopcion",
    date: addDays(today, 1), time: "16:00", address: "Calle Internacional 85, Col. Centro, Nogales", status: "programada",
    message: "Llevaremos el contrato para revisarlo con usted.",
  },
  {
    id: "ent-104", shelterId: "ref-004", shelterName: "Colita Alegre", requestId: "ext-301",
    adopter: "Luis Armendáriz", pet: "Mora", kind: "adopcion",
    date: "2026-11-17", time: "13:00", address: "Blvd. Luis Donaldo Colosio 410, Nogales", status: "cancelada",
    cancelReason: "El adoptante pidió cambiar la fecha y ya no pudo reprogramar. La solicitud sigue pendiente.",
  },
  {
    id: "ent-105", shelterId: "ref-005", shelterName: "Rescate Norteño", requestId: "ext-410",
    adopter: "Paola Gastélum", pet: "Simón", kind: "adopcion",
    date: "2026-11-20", time: "10:00", address: "Calle Sinaloa 77, Col. Cajeme, Ciudad Obregón", status: "realizada",
    notes: "Hogar adecuado, con patio y sin otras mascotas. Se recomienda aprobar.",
  },
  {
    id: "ent-106", shelterId: "ref-005", shelterName: "Rescate Norteño", requestId: "ext-402",
    adopter: "Eduardo Navarro", pet: "Chispa", kind: "seguimiento", milestoneDays: 7,
    date: addDays(today, 4), time: "12:30", address: "Av. Náinari 920, Ciudad Obregón", status: "programada",
  },
];

/* ---------- Almacén en memoria ---------- */

let interviews: Interview[] = seed;
const listeners = new Set<() => void>();

function commit(next: Interview[]) {
  // Siempre una lista nueva, para que las pantallas abiertas se actualicen.
  interviews = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getInterviews(): Interview[] {
  return interviews;
}

/** Todas las entrevistas, y la pantalla se actualiza sola cuando cambian. */
export function useInterviews(): Interview[] {
  return useSyncExternalStore(subscribe, getInterviews, getInterviews);
}

/** La entrevista vigente de una solicitud: la programada, o si no hay, la última realizada. */
export function findActiveInterview(
  list: Interview[],
  requestId: string,
  kind: InterviewKind,
  milestoneDays?: number,
): Interview | undefined {
  const matches = list.filter(
    (i) =>
      i.requestId === requestId &&
      i.kind === kind &&
      (kind === "adopcion" || i.milestoneDays === milestoneDays) &&
      i.status !== "cancelada",
  );
  return matches.find((i) => i.status === "programada") ?? matches[matches.length - 1];
}

/* Lo que el refugio escribe al agendar. El aviso al adoptante lo envía el servidor. */
export type NewInterview = {
  requestId: string;
  adopter: string;
  pet: string;
  kind: InterviewKind;
  milestoneDays?: number;
  date: string;
  time: string;
  address: string;
  message?: string;
};

function nextId() {
  const highest = interviews.reduce((max, i) => Math.max(max, Number(i.id.replace(/\D/g, "")) || 0), 0);
  return `ent-${String(highest + 1).padStart(3, "0")}`;
}

export function scheduleInterview(input: NewInterview): Interview {
  // Aquí se guardará la entrevista y se programarán los avisos push con el backend.
  const created: Interview = {
    ...input,
    id: nextId(),
    shelterId: CURRENT_SHELTER.id,
    shelterName: CURRENT_SHELTER.name,
    message: input.message?.trim() || undefined,
    address: input.address.trim(),
    status: "programada",
  };
  commit([...interviews, created]);
  return created;
}

export function rescheduleInterview(
  id: string,
  changes: { date: string; time: string; address: string; message?: string },
) {
  // Aquí se reprogramarán los avisos push y se avisará de nuevo al adoptante.
  commit(
    interviews.map((i): Interview =>
      i.id === id
        ? { ...i, ...changes, address: changes.address.trim(), message: changes.message?.trim() || undefined }
        : i,
    ),
  );
}

export function completeInterview(id: string, notes: string) {
  commit(interviews.map((i): Interview => (i.id === id ? { ...i, status: "realizada", notes: notes.trim() } : i)));
}

export function cancelInterview(id: string, reason: string) {
  // Aquí se cancelarán los avisos push pendientes y se avisará al adoptante.
  commit(interviews.map((i): Interview => (i.id === id ? { ...i, status: "cancelada", cancelReason: reason.trim() } : i)));
}