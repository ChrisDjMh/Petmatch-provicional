/* Datos de ejemplo de las donaciones registradas (RF-19). Con backend se reemplazan por la consulta real.
   Solo lectura: PetMatch no mueve, retiene ni devuelve dinero (RN-13). */
export type DonationType = "unica" | "mensual" | "post-adopcion";
export type DonationStatus = "pendiente" | "exitosa" | "fallida";

export type Donation = {
  id: string;
  shelterName: string;
  donor: string;
  /** Fecha y hora, en formato ISO. */
  date: string;
  /** Monto en pesos mexicanos (de $20 a $10,000 por pago, RN-13). */
  amount: number;
  type: DonationType;
  status: DonationStatus;
};

export const donations: Donation[] = [
  { id: "don-001", shelterName: "Patitas Felices", donor: "Andrea Morales", date: "2026-11-22T18:40:00", amount: 250, type: "unica", status: "exitosa" },
  { id: "don-002", shelterName: "Huellas de Esperanza", donor: "Luis Fernández", date: "2026-11-22T11:05:00", amount: 100, type: "mensual", status: "exitosa" },
  { id: "don-003", shelterName: "Colita Alegre", donor: "Camila Reyes", date: "2026-11-21T20:15:00", amount: 1500, type: "post-adopcion", status: "exitosa" },
  { id: "don-004", shelterName: "Patitas Felices", donor: "Diego Armenta", date: "2026-11-21T09:30:00", amount: 50, type: "unica", status: "fallida" },
  { id: "don-005", shelterName: "Rescate Norteño", donor: "Valeria Ochoa", date: "2026-11-20T16:00:00", amount: 500, type: "unica", status: "pendiente" },
  { id: "don-006", shelterName: "Huellas de Esperanza", donor: "Mariana Cruz", date: "2026-11-19T13:20:00", amount: 10000, type: "unica", status: "exitosa" },
  { id: "don-007", shelterName: "Colita Alegre", donor: "Luis Fernández", date: "2026-11-15T12:00:00", amount: 100, type: "mensual", status: "exitosa" },
  { id: "don-008", shelterName: "Patitas Felices", donor: "Andrea Morales", date: "2026-11-12T19:45:00", amount: 20, type: "unica", status: "exitosa" },
  { id: "don-009", shelterName: "Rescate Norteño", donor: "Héctor Salas", date: "2026-11-10T10:10:00", amount: 300, type: "post-adopcion", status: "fallida" },
  { id: "don-010", shelterName: "Huellas de Esperanza", donor: "Mariana Cruz", date: "2026-11-05T15:30:00", amount: 750, type: "unica", status: "exitosa" },
];