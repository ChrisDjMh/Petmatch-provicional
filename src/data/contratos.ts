/* Contrato de adopción digital (RF-38). Es un registro dentro del sistema: no tiene validez legal ni
   requiere firma (RN-15). Con backend, el contrato se guarda en la base de datos y el adoptante lo
   consulta desde la app; aquí se simula en memoria mientras la página esté abierta. */
import { getAdoptionDetail } from "@/data/adopciones";
import { initialPets } from "@/data/mascotas";

/* Datos del refugio que inició sesión. Con backend salen de su cuenta. */
export const shelterProfile = {
  name: "Patitas Felices",
  responsible: "Jorge Ramírez",
  city: "San Luis Río Colorado",
  address: "Calle 12 y Av. Obregón 320, col. Centro",
};

/* Condiciones de adopción. Son un texto base de ejemplo: el equipo y los refugios deben confirmar su
   redacción final. La del seguimiento sí es la regla del SRS (RF-38, RN-12). */
export const ADOPTION_CONDITIONS = [
  "El adoptante se compromete a darle a la mascota alimento, agua, atención veterinaria y un lugar seguro donde vivir.",
  "El adoptante no podrá vender, regalar, ceder ni abandonar a la mascota. Si ya no puede conservarla, deberá avisar al refugio.",
  "El adoptante acepta el seguimiento post-adopción: registrar en la app cinco hitos, a los 7, 30, 90, 180 y 365 días contados desde la fecha de entrega, con un formulario y una foto en cada uno.",
] as const;

// Contratos ya generados en los datos de ejemplo (las adopciones de Toby y Nala, que ya se entregaron).
const generated = new Map<string, string>([
  ["sol-080", "2026-10-05T12:00:00"],
  ["sol-081", "2026-11-04T09:30:00"],
]);

export function getContractDate(requestId: string): string | undefined {
  return generated.get(requestId);
}

/** Genera el contrato de una solicitud aprobada. Si ya existe, conserva el original. */
export function generateContract(requestId: string): string {
  const existing = generated.get(requestId);
  if (existing) return existing;
  const now = new Date().toISOString();
  generated.set(requestId, now);
  return now;
}

export function ageLabel(years: number, months: number) {
  const y = years > 0 ? `${years} ${years === 1 ? "año" : "años"}` : "";
  const m = months > 0 ? `${months} ${months === 1 ? "mes" : "meses"}` : "";
  return [y, m].filter(Boolean).join(" y ") || "Recién nacida";
}

/** Datos completos del contrato, o undefined si la solicitud no existe o aún no se genera. */
export function getContract(requestId: string) {
  const generatedAt = generated.get(requestId);
  const request = getAdoptionDetail(requestId);
  if (!generatedAt || !request) return undefined;
  const pet = initialPets.find((p) => p.name === request.pet);
  return {
    number: `CT-${requestId.replace("sol-", "")}`,
    generatedAt,
    shelter: shelterProfile,
    adopter: {
      name: request.adopter,
      email: request.email,
      housingType: request.housingType,
      householdSize: request.householdSize,
    },
    pet: {
      name: request.pet,
      species: pet?.species ?? "—",
      size: pet?.size ?? "—",
      sex: pet?.sex ?? "—",
      age: pet ? ageLabel(pet.ageYears, pet.ageMonths) : "—",
    },
    acceptsFollowUp: request.acceptsFollowUp,
    conditions: ADOPTION_CONDITIONS,
  };
}