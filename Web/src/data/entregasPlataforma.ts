/* Adopciones aprobadas de todos los refugios, para que el Super Admin vea cuáles ya se entregaron y cuáles
   siguen pendientes de entrega (RF-39). Con backend se reemplaza por la consulta real. La fecha de entrega y
   los hitos viven en data/entregas.ts. */
import { adoptionRequests } from "@/data/adopciones";
import { CURRENT_SHELTER } from "@/data/entrevistas";

export type PlatformAdoption = {
  requestId: string;
  shelterId: string;
  shelterName: string;
  adopter: string;
  pet: string;
};

// Las del refugio de la sesión salen de sus solicitudes; las demás son de ejemplo.
const ownShelter: PlatformAdoption[] = adoptionRequests
  .filter((r) => r.status === "aprobada")
  .map((r) => ({
    requestId: r.id,
    shelterId: CURRENT_SHELTER.id,
    shelterName: CURRENT_SHELTER.name,
    adopter: r.adopter,
    pet: r.pet,
  }));

const otherShelters: PlatformAdoption[] = [
  { requestId: "ext-188", shelterId: "ref-002", shelterName: "Huellas de Esperanza", adopter: "Iván Medina", pet: "Pelusa" },
  { requestId: "ext-205", shelterId: "ref-002", shelterName: "Huellas de Esperanza", adopter: "Marta Duarte", pet: "Tizón" },
  { requestId: "ext-402", shelterId: "ref-005", shelterName: "Rescate Norteño", adopter: "Eduardo Navarro", pet: "Chispa" },
  { requestId: "ext-410", shelterId: "ref-005", shelterName: "Rescate Norteño", adopter: "Paola Gastélum", pet: "Simón" },
];

export const approvedAdoptions: PlatformAdoption[] = [...ownShelter, ...otherShelters];
