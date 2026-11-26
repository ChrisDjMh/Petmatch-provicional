import type { AdopterProfile, PetRequirements } from "@/lib/compatibilidad";
import type { PetStatus } from "@/data/mascotas";

/* Datos de ejemplo de las solicitudes de adopción del refugio (RF-35). Con backend se reemplazan por la
   consulta real. Estados según RN-06: nace Pendiente; el Admin la pasa a Aprobada o Rechazada; una
   Aprobada puede quedar Cancelada si se cancela antes de la entrega. */
export type AdoptionStatus = "pendiente" | "aprobada" | "rechazada" | "cancelada";

export type AdoptionRequest = {
  id: string;
  adopter: string;
  pet: string;
  /** Fecha y hora de envío, en formato ISO. */
  sentAt: string;
  status: AdoptionStatus;
};

export const adoptionRequests: AdoptionRequest[] = [
  { id: "sol-101", adopter: "Camila Reyes", pet: "Max", sentAt: "2026-11-22T20:10:00", status: "pendiente" },
  { id: "sol-102", adopter: "Diego Armenta", pet: "Luna", sentAt: "2026-11-22T09:45:00", status: "pendiente" },
  { id: "sol-103", adopter: "Mariana Cruz", pet: "Bruno", sentAt: "2026-11-21T17:30:00", status: "pendiente" },
  { id: "sol-090", adopter: "Sofía Lara", pet: "Bruno", sentAt: "2026-11-14T10:00:00", status: "aprobada" },
  { id: "sol-091", adopter: "Camila Reyes", pet: "Max", sentAt: "2026-11-12T16:20:00", status: "cancelada" },
  { id: "sol-092", adopter: "Jorge Beltrán", pet: "Rocky", sentAt: "2026-11-10T12:00:00", status: "rechazada" },
  { id: "sol-081", adopter: "Héctor Salas", pet: "Nala", sentAt: "2026-11-03T14:00:00", status: "aprobada" },
  { id: "sol-080", adopter: "Valeria Ochoa", pet: "Toby", sentAt: "2026-10-02T11:30:00", status: "aprobada" },
];

/* ---------- Detalle de una solicitud (RF-36) ---------- */

export type AdoptionDetail = AdoptionRequest & {
  email: string;
  /** Respuestas del formulario de solicitud (RF-32). */
  motive: string;
  housingType: string;
  householdSize: number;
  acceptsFollowUp: boolean;
  /** Copia del perfil de compatibilidad del momento del envío (RF-32). */
  profile: AdopterProfile;
  petRequirements: PetRequirements;
  petStatus: PetStatus;
  /** Solo si fue rechazada o cancelada: el motivo que se escribió (RN-17). */
  decisionReason?: string;
};

const requirementsByPet: Record<string, { req: PetRequirements; status: PetStatus }> = {
  Max: { req: { minSpace: 2, minHours: 4, experience: 1, commitment: 1, childrenOk: true, petsOk: true }, status: "disponible" },
  Luna: { req: { minSpace: 1, minHours: 3, experience: 0, commitment: 0, childrenOk: false, petsOk: false }, status: "disponible" },
  Bruno: { req: { minSpace: 3, minHours: 6, experience: 2, commitment: 2, childrenOk: true, petsOk: false }, status: "en-proceso" },
  Rocky: { req: { minSpace: 3, minHours: 5, experience: 1, commitment: 2, childrenOk: true, petsOk: true }, status: "disponible" },
  Toby: { req: { minSpace: 1, minHours: 2, experience: 0, commitment: 1, childrenOk: true, petsOk: true }, status: "adoptada" },
  Nala: { req: { minSpace: 2, minHours: 3, experience: 0, commitment: 0, childrenOk: true, petsOk: false }, status: "adoptada" },
};

type Extra = Omit<AdoptionDetail, keyof AdoptionRequest | "petRequirements" | "petStatus">;

const extras: Record<string, Extra> = {
  "sol-101": { email: "camila@correo.mx", motive: "Siempre he querido un perro mediano y cuento con tiempo por las tardes para sacarlo a pasear.", housingType: "Casa sin patio", householdSize: 3, acceptsFollowUp: true, profile: { space: 2, hoursAtHome: 3, experience: 1, commitment: 1, hasChildren: false, hasOtherPets: true } },
  "sol-102": { email: "diego@correo.mx", motive: "Mi hija quiere una gatita y vivimos cerca del refugio, podemos visitarla antes.", housingType: "Departamento", householdSize: 4, acceptsFollowUp: true, profile: { space: 1, hoursAtHome: 5, experience: 0, commitment: 1, hasChildren: true, hasOtherPets: true } },
  "sol-103": { email: "mariana@correo.mx", motive: "Tengo experiencia con perros grandes y un patio amplio donde puede correr.", housingType: "Casa con patio", householdSize: 2, acceptsFollowUp: true, profile: { space: 3, hoursAtHome: 8, experience: 2, commitment: 2, hasChildren: false, hasOtherPets: false } },
  "sol-090": { email: "sofia@correo.mx", motive: "Trabajo desde casa y quiero un compañero para mi familia.", housingType: "Casa con patio", householdSize: 4, acceptsFollowUp: true, profile: { space: 3, hoursAtHome: 7, experience: 2, commitment: 2, hasChildren: true, hasOtherPets: false } },
  "sol-091": { email: "camila@correo.mx", motive: "Quiero darle un hogar a Max.", housingType: "Casa sin patio", householdSize: 3, acceptsFollowUp: true, profile: { space: 2, hoursAtHome: 3, experience: 1, commitment: 1, hasChildren: false, hasOtherPets: true }, decisionReason: "El adoptante cambió de domicilio y ya no puede recibir a la mascota por ahora." },
  "sol-092": { email: "jorge@correo.mx", motive: "Me gustan los perros grandes.", housingType: "Departamento", householdSize: 1, acceptsFollowUp: true, profile: { space: 2, hoursAtHome: 4, experience: 0, commitment: 1, hasChildren: false, hasOtherPets: false }, decisionReason: "Rocky necesita un espacio amplio y más horas de compañía de las que se pueden ofrecer hoy." },
  "sol-081": { email: "hector@correo.mx", motive: "Busco una gata tranquila para mi casa.", housingType: "Casa sin patio", householdSize: 2, acceptsFollowUp: true, profile: { space: 2, hoursAtHome: 6, experience: 1, commitment: 1, hasChildren: false, hasOtherPets: false } },
  "sol-080": { email: "valeria@correo.mx", motive: "Quiero adoptar un perro pequeño para acompañarme.", housingType: "Departamento", householdSize: 1, acceptsFollowUp: true, profile: { space: 1, hoursAtHome: 3, experience: 0, commitment: 1, hasChildren: false, hasOtherPets: false } },
};

export function getAdoptionDetail(id: string): AdoptionDetail | undefined {
  const base = adoptionRequests.find((r) => r.id === id);
  const extra = extras[id];
  const pet = base ? requirementsByPet[base.pet] : undefined;
  if (!base || !extra || !pet) return undefined;
  return { ...base, ...extra, petRequirements: pet.req, petStatus: pet.status };
}