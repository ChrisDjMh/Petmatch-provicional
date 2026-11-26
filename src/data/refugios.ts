/* Datos de ejemplo de los refugios aprobados (RF-17, RF-18). Con backend se reemplazan por la consulta real.
   Solo hay dos estados aquí: un refugio Activo puede pasar a Suspendido y volver a Activo (RN-01). */
export type ShelterStatus = "activo" | "suspendido";

export type Shelter = {
  id: string;
  shelterName: string;
  city: string;
  responsible: string;
  email: string;
  status: ShelterStatus;
  /** Fecha de aprobación, en formato ISO. */
  approvedAt: string;
  /** Solo si está suspendido: motivo que el refugio puede leer (RN-17). */
  suspensionReason?: string;
  suspendedAt?: string;
};

export const initialShelters: Shelter[] = [
  { id: "ref-001", shelterName: "Patitas Felices", city: "San Luis Río Colorado", responsible: "Jorge Ramírez", email: "jorge@patitasfelices.mx", status: "activo", approvedAt: "2026-10-02T11:00:00" },
  { id: "ref-002", shelterName: "Huellas de Esperanza", city: "Mexicali", responsible: "Ana Cota", email: "ana@huellasdeesperanza.mx", status: "activo", approvedAt: "2026-10-15T09:30:00" },
  {
    id: "ref-003",
    shelterName: "Hogar Peludo",
    city: "Hermosillo",
    responsible: "Laura Soto",
    email: "laura@hogarpeludo.mx",
    status: "suspendido",
    approvedAt: "2026-09-20T16:10:00",
    suspensionReason: "La dirección y el teléfono del refugio ya no son correctos. Actualízalos para reactivar tu cuenta.",
    suspendedAt: "2026-11-12T10:00:00",
  },
  { id: "ref-004", shelterName: "Colita Alegre", city: "Nogales", responsible: "Pedro Ibarra", email: "pedro@colitaalegre.mx", status: "activo", approvedAt: "2026-11-03T14:20:00" },
  { id: "ref-005", shelterName: "Rescate Norteño", city: "Ciudad Obregón", responsible: "Marisol Treviño", email: "marisol@rescatenorteno.mx", status: "activo", approvedAt: "2026-11-09T12:45:00" },
];