/* Datos de ejemplo del Inicio del Admin de Refugio (RF-45, RF-59). Con backend se reemplazan por la
   consulta real y por avisos en tiempo real (RF-60). */
export type OverdueMilestone = {
  id: string;
  pet: string;
  adopter: string;
  /** Hito fijo: 7, 30, 90, 180 o 365 días desde la entrega (RN-12). */
  days: 7 | 30 | 90 | 180 | 365;
  /** Fecha en que debía registrarse, en formato ISO. */
  dueDate: string;
};

export type NewAdoptionRequest = {
  id: string;
  adopter: string;
  pet: string;
  /** Fecha y hora de envío, en formato ISO. */
  sentAt: string;
};

export type ReceivedDonation = {
  id: string;
  donor: string;
  amount: number;
  type: "unica" | "mensual" | "post-adopcion";
  /** Fecha y hora, en formato ISO. */
  date: string;
};

export const shelterInfo = { name: "Patitas Felices" };

export const overdueMilestones: OverdueMilestone[] = [
  { id: "hit-001", pet: "Toby", adopter: "Valeria Ochoa", days: 30, dueDate: "2026-11-10" },
  { id: "hit-002", pet: "Nala", adopter: "Héctor Salas", days: 7, dueDate: "2026-11-17" },
];

export const newAdoptionRequests: NewAdoptionRequest[] = [
  { id: "sol-101", adopter: "Camila Reyes", pet: "Max", sentAt: "2026-11-22T20:10:00" },
  { id: "sol-102", adopter: "Diego Armenta", pet: "Luna", sentAt: "2026-11-22T09:45:00" },
  { id: "sol-103", adopter: "Mariana Cruz", pet: "Bruno", sentAt: "2026-11-21T17:30:00" },
];

export const receivedDonations: ReceivedDonation[] = [
  { id: "don-201", donor: "Andrea Morales", amount: 250, type: "unica", date: "2026-11-22T18:40:00" },
  { id: "don-202", donor: "Luis Fernández", amount: 100, type: "mensual", date: "2026-11-20T11:05:00" },
];