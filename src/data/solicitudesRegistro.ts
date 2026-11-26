/* Datos de ejemplo de las solicitudes de registro de refugios (estado "Pendiente de verificación").
   Cuando haya backend se reemplazan por la consulta real. Van desordenadas a propósito:
   la pantalla las ordena de la más antigua a la más reciente (RF-12). */
export type ShelterRegistrationRequest = {
  id: string;
  shelterName: string;
  city: string;
  /** Fecha y hora de envío, en formato ISO. */
  sentAt: string;
};

export const shelterRegistrationRequests: ShelterRegistrationRequest[] = [
  { id: "sol-004", shelterName: "Casa de los Gatos", city: "Nogales", sentAt: "2026-11-20T16:05:00" },
  { id: "sol-001", shelterName: "Huellitas del Norte", city: "Hermosillo", sentAt: "2026-11-18T10:30:00" },
  { id: "sol-006", shelterName: "Amigos Peludos", city: "Guaymas", sentAt: "2026-11-22T09:12:00" },
  { id: "sol-002", shelterName: "Patitas Felices", city: "San Luis Río Colorado", sentAt: "2026-11-14T13:45:00" },
  { id: "sol-005", shelterName: "Segunda Oportunidad", city: "Ciudad Obregón", sentAt: "2026-11-21T18:20:00" },
  { id: "sol-003", shelterName: "Refugio Esperanza Animal", city: "Mexicali", sentAt: "2026-11-10T08:00:00" },
];

/* ---------- Detalle de una solicitud (RF-13) ---------- */

export type RequestDocument = {
  id: string;
  /** Tipo de documento obligatorio del registro. */
  kind: "Identificación del responsable" | "Comprobante de domicilio" | "Documento de existencia";
  fileName: string;
  sizeKb: number;
  url: string;
};

export type RequestPhoto = {
  id: string;
  fileName: string;
  sizeKb: number;
  url: string;
};

export type ShelterRegistrationDetail = ShelterRegistrationRequest & {
  responsible: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  documents: RequestDocument[];
  photos: RequestPhoto[];
};

/* Los archivos de ejemplo viven en /public/ejemplo. Con backend serán enlaces firmados al almacenamiento. */
function sampleFiles(shelter: string, photoCount = 3) {
  const slug = shelter.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const documents: RequestDocument[] = [
    { id: "d1", kind: "Identificación del responsable", fileName: `identificacion-${slug}.pdf`, sizeKb: 842, url: "/ejemplo/documento-ejemplo.pdf" },
    { id: "d2", kind: "Comprobante de domicilio", fileName: `comprobante-domicilio-${slug}.pdf`, sizeKb: 615, url: "/ejemplo/documento-ejemplo.pdf" },
    { id: "d3", kind: "Documento de existencia", fileName: `acta-constitutiva-${slug}.pdf`, sizeKb: 1290, url: "/ejemplo/documento-ejemplo.pdf" },
  ];
  const photos: RequestPhoto[] = Array.from({ length: photoCount }, (_, i) => ({
    id: `p${i + 1}`,
    fileName: `foto-${slug}-${i + 1}.jpg`,
    sizeKb: 1800 + i * 240,
    url: `/ejemplo/foto-${(i % 4) + 1}.svg`,
  }));
  return { documents, photos };
}

const extra: Record<string, Omit<ShelterRegistrationDetail, keyof ShelterRegistrationRequest | "documents" | "photos">> = {
  "sol-001": { responsible: "María López", email: "maria@huellitasdelnorte.mx", phone: "662 123 4567", address: "Blvd. Colosio 1450, col. Pitic", description: "Rescatamos y rehabilitamos perros y gatos en situación de calle. Contamos con 40 espacios y un veterinario de planta." },
  "sol-002": { responsible: "Jorge Ramírez", email: "jorge@patitasfelices.mx", phone: "653 987 6543", address: "Calle 12 y Av. Obregón 320, col. Centro", description: "Refugio familiar con más de ocho años de trabajo en adopción responsable y esterilización." },
  "sol-003": { responsible: "Ana Cota", email: "ana@esperanzaanimal.mx", phone: "686 555 0102", address: "Calzada Independencia 2200, col. Nueva", description: "Atendemos animales rescatados de maltrato y los preparamos para encontrar un hogar definitivo." },
  "sol-004": { responsible: "Luis Valenzuela", email: "luis@casadelosgatos.mx", phone: "631 444 2288", address: "Av. Obregón 87, col. Kennedy", description: "Refugio especializado en gatos, con área de cuarentena y adopciones los fines de semana." },
  "sol-005": { responsible: "Daniela Ruiz", email: "daniela@segundaoportunidad.mx", phone: "644 210 7788", address: "Calle Sonora 640, col. Centro", description: "Damos una segunda oportunidad a perros adultos y de edad avanzada que casi nunca son adoptados." },
  "sol-006": { responsible: "Carlos Mendoza", email: "carlos@amigospeludos.mx", phone: "622 333 1190", address: "Av. Serdán 1010, col. Las Playitas", description: "Pequeño refugio comunitario sostenido por voluntarios; rescatamos perros y gatos del puerto." },
};

export function getShelterRegistrationDetail(id: string): ShelterRegistrationDetail | undefined {
  const base = shelterRegistrationRequests.find((r) => r.id === id);
  const more = extra[id];
  if (!base || !more) return undefined;
  return { ...base, ...more, ...sampleFiles(base.shelterName, id === "sol-004" ? 4 : 3) };
}
