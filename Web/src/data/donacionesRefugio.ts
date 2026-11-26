/* Donaciones recibidas por el refugio y estado de su cuenta de Stripe (RF-47, RF-48, RF-56).
   Con backend vienen de la base de datos (las registra el webhook de Stripe, RF-53) y el estado de la cuenta
   lo da Stripe Connect. Aquí es solo de ejemplo y el estado se guarda en memoria mientras la página esté abierta.
   Las dos más recientes son las mismas que muestra el Inicio del refugio. */
import type { DonationType } from "@/data/donaciones";

export type ShelterDonation = {
  id: string;
  donor: string;
  /** Fecha y hora, en formato ISO. */
  date: string;
  /** Monto en pesos mexicanos (de $20 a $10,000 por pago, RN-13). */
  amount: number;
  type: DonationType;
};

/* Solo las exitosas: son las que el refugio recibió. Las pendientes y fallidas no cuentan en los totales. */
export const shelterDonations: ShelterDonation[] = [
  { id: "don-201", donor: "Andrea Morales", date: "2026-11-22T18:40:00", amount: 250, type: "unica" },
  { id: "don-202", donor: "Luis Fernández", date: "2026-11-20T11:05:00", amount: 100, type: "mensual" },
  { id: "don-203", donor: "Andrea Morales", date: "2026-11-12T19:45:00", amount: 20, type: "unica" },
  { id: "don-204", donor: "Sofía Valenzuela", date: "2026-11-03T09:15:00", amount: 100, type: "mensual" },
  { id: "don-205", donor: "Camila Reyes", date: "2026-10-27T16:20:00", amount: 1500, type: "post-adopcion" },
  { id: "don-206", donor: "Luis Fernández", date: "2026-10-20T11:05:00", amount: 100, type: "mensual" },
  { id: "don-207", donor: "Sofía Valenzuela", date: "2026-10-03T09:15:00", amount: 100, type: "mensual" },
  { id: "don-208", donor: "Héctor Salas", date: "2026-10-01T13:00:00", amount: 400, type: "unica" },
  { id: "don-209", donor: "Luis Fernández", date: "2026-09-20T11:05:00", amount: 100, type: "mensual" },
  { id: "don-210", donor: "Valeria Ochoa", date: "2026-09-14T18:30:00", amount: 800, type: "post-adopcion" },
  { id: "don-211", donor: "Mariana Cruz", date: "2026-09-08T12:10:00", amount: 300, type: "unica" },
  { id: "don-212", donor: "Luis Fernández", date: "2026-08-20T11:05:00", amount: 100, type: "mensual" },
  { id: "don-213", donor: "Diego Armenta", date: "2026-08-11T20:00:00", amount: 50, type: "unica" },
  { id: "don-214", donor: "Luis Fernández", date: "2026-07-20T11:05:00", amount: 100, type: "mensual" },
  { id: "don-215", donor: "Mariana Cruz", date: "2026-07-05T15:45:00", amount: 1200, type: "unica" },
  { id: "don-216", donor: "Andrea Morales", date: "2026-06-18T10:25:00", amount: 150, type: "unica" },
];

/** Apadrinamientos mensuales que siguen activos: los donantes con un cargo mensual en el último mes. */
export function activeSponsorships(): number {
  const latest = shelterDonations.reduce((max, d) => (d.date > max ? d.date : max), "").slice(0, 7);
  return new Set(
    shelterDonations.filter((d) => d.type === "mensual" && d.date.startsWith(latest)).map((d) => d.donor),
  ).size;
}

/* Estados de la cuenta de Stripe Connect (RF-47). */
export type StripeStatus = "sin-vincular" | "en-proceso" | "vinculada";

/* Los últimos caracteres del identificador de la cuenta conectada. PetMatch solo guarda ese identificador;
   nunca datos de tarjeta ni credenciales (RF-48, RN-13). */
const DEMO_ACCOUNT_TAIL = "4F2K";

let status: StripeStatus = "vinculada";

export function getStripeStatus(): StripeStatus {
  return status;
}

export function setStripeStatus(next: StripeStatus) {
  status = next;
}

export function getAccountTail(): string {
  return DEMO_ACCOUNT_TAIL;
}