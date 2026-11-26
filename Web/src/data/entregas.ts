/* Entregas registradas (RF-39) y hitos de seguimiento ya registrados por los adoptantes (RF-43).
   Con backend se guardan en la base de datos; aquí se simulan en memoria mientras la página esté abierta.
   La fecha de entrega es la base de los cinco hitos (RF-41). */

// Entregas de los datos de ejemplo: Toby (sol-080) y Nala (sol-081), que ya están adoptadas.
const deliveries = new Map<string, string>([
  ["sol-080", "2026-10-11"],
  ["sol-081", "2026-11-10"],
]);

/** Lo que el adoptante registra en un hito desde la app: formulario y foto obligatoria (RF-43). */
export type MilestoneRecord = {
  /** Día en que lo registró, "AAAA-MM-DD". */
  registeredAt: string;
  health: string;
  adaptation: string;
  comments: string;
  /** Foto tomada con la cámara o elegida de la galería. En el ejemplo es una imagen de /public/ejemplo. */
  photo: string;
};

/* Hitos ya registrados, por solicitud y por días del hito. Los registra la app móvil. */
export const milestoneRecords: Record<string, Partial<Record<number, MilestoneRecord>>> = {
  "sol-080": {
    7: {
      registeredAt: "2026-10-22",
      health: "Come bien, está activo y sin molestias. Ya se le aplicó su desparasitación.",
      adaptation: "Se adaptó rápido a la casa y duerme en su cama.",
      comments: "Sale a pasear dos veces al día y se lleva bien con la familia.",
      photo: "/ejemplo/foto-4.svg",
    },
  },
};

/* Días de los hitos ya registrados, por solicitud. Lo usa la tarjeta de entrega para calcular estados. */
export const completedMilestones: Record<string, number[]> = Object.fromEntries(
  Object.entries(milestoneRecords).map(([requestId, records]) => [requestId, Object.keys(records).map(Number)]),
);

export function getDeliveryDate(requestId: string): string | undefined {
  return deliveries.get(requestId);
}

export function registerDelivery(requestId: string, date: string) {
  deliveries.set(requestId, date);
}