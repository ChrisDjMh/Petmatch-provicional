import { approvedAdoptions } from "@/data/entregasPlataforma";
import { getHomeAddress } from "@/data/entrevistas";

export type DeliveryStatus = "pendiente" | "entregado" | "cancelado";
export type AdminDelivery = {
  id: string;
  shelterId: string;
  shelterName: string;
  recipient: string;
  date: string;
  address: string;
  status: DeliveryStatus;
};

const externalAddresses: Record<string, string> = {
  "ext-188": "Av. Reforma 2210, Col. Pueblo Nuevo, Mexicali",
  "ext-205": "Calle Río Nuevo 330, Col. Nueva, Mexicali",
  "ext-402": "Av. Náinari 920, Ciudad Obregón",
  "ext-410": "Calle Sinaloa 77, Col. Cajeme, Ciudad Obregón",
};

const seed: AdminDelivery[] = approvedAdoptions.map((adoption, index) => ({
  id: `ENT-${String(index + 1).padStart(3, "0")}`,
  shelterId: adoption.shelterId,
  shelterName: adoption.shelterName,
  recipient: adoption.adopter,
  date: [
    "2026-11-20T10:00:00",
    "2026-11-18T12:30:00",
    "2026-11-15T09:00:00",
    "2026-11-12T16:00:00",
    "2026-11-10T11:00:00",
    "2026-11-08T13:00:00",
    "2026-11-05T10:30:00",
  ][index] ?? "2026-11-01T10:00:00",
  address: getHomeAddress(adoption.requestId) || externalAddresses[adoption.requestId] || "Domicilio registrado por el refugio",
  status: index === 0 || index === 4 ? "pendiente" : index === 2 ? "cancelado" : "entregado",
}));

export const adminDeliveries: AdminDelivery[] = seed;

/** Actualiza el estado local de una entrega. Se reinicia al recargar la aplicación. */
export function updateAdminDeliveryStatus(id: string, status: DeliveryStatus): void {
  const delivery = adminDeliveries.find((item) => item.id === id);
  if (delivery) delivery.status = status;
}
