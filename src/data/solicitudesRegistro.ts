/* Datos de ejemplo de las solicitudes de registro de refugios (estado "Pendiente de verificación").
   Cuando haya backend se reemplazan por la consulta real. Van desordenadas a propósito:
   la lista las ordena de la más antigua a la más reciente (RF-12). */

export type RequestDocument = {
  id: string;
  /** Qué documento es (los tres que pide RN-18). */
  label: string;
  fileName: string;
  format: "PDF" | "JPG" | "PNG";
  sizeLabel: string;
  /** Dirección del archivo para verlo o descargarlo. */
  url: string;
};

export type RequestPhoto = {
  id: string;
  alt: string;
  src: string;
  fileName: string;
};

export type ShelterRegistrationRequest = {
  id: string;
  shelterName: string;
  city: string;
  /** Fecha y hora de envío, en formato ISO. */
  sentAt: string;
  responsible: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  documents: RequestDocument[];
  photos: RequestPhoto[];
};

const SAMPLE_PDF = "/ejemplos/documento-ejemplo.pdf";

/* Los tres documentos obligatorios del registro (RN-18). */
function documentsFor(sizes: [string, string, string]): RequestDocument[] {
  return [
    {
      id: "identificacion",
      label: "Identificación oficial del responsable",
      fileName: "identificacion-responsable.pdf",
      format: "PDF",
      sizeLabel: sizes[0],
      url: SAMPLE_PDF,
    },
    {
      id: "domicilio",
      label: "Comprobante de domicilio del refugio",
      fileName: "comprobante-domicilio.pdf",
      format: "PDF",
      sizeLabel: sizes[1],
      url: SAMPLE_PDF,
    },
    {
      id: "existencia",
      label: "Documento que respalda al refugio (acta, constancia o carta)",
      fileName: "acta-constancia.pdf",
      format: "PDF",
      sizeLabel: sizes[2],
      url: SAMPLE_PDF,
    },
  ];
}

/* Fotos de ejemplo. Si alguna no carga, la pantalla muestra un recuadro en su lugar. */
const SAMPLE_PHOTOS: RequestPhoto[] = [
  {
    id: "foto-1",
    alt: "Perros descansando en el patio del refugio",
    src: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=900&q=80",
    fileName: "refugio-foto-1.jpg",
  },
  {
    id: "foto-2",
    alt: "Gato en una de las áreas de descanso",
    src: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
    fileName: "refugio-foto-2.jpg",
  },
  {
    id: "foto-3",
    alt: "Perro dorado recostado en el pasto",
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    fileName: "refugio-foto-3.jpg",
  },
  {
    id: "foto-4",
    alt: "Gato mirando con curiosidad",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    fileName: "refugio-foto-4.jpg",
  },
];

export const shelterRegistrationRequests: ShelterRegistrationRequest[] = [
  {
    id: "sol-004",
    shelterName: "Casa de los Gatos",
    city: "Nogales",
    sentAt: "2026-11-20T16:05:00",
    responsible: "Fernanda Ruiz",
    email: "fernanda@correo.com",
    phone: "631 555 0142",
    address: "Calle Obregón 214, Col. Centro, Nogales, Sonora",
    description:
      "Refugio dedicado al rescate y la adopción de gatos. Atendemos a unos 40 gatos con apoyo de voluntarios.",
    documents: documentsFor(["1.2 MB", "860 KB", "2.4 MB"]),
    photos: SAMPLE_PHOTOS.slice(1, 4),
  },
  {
    id: "sol-001",
    shelterName: "Huellitas del Norte",
    city: "Hermosillo",
    sentAt: "2026-11-18T10:30:00",
    responsible: "María López",
    email: "maria@correo.com",
    phone: "662 555 0118",
    address: "Blvd. Colosio 1520, Col. Pitic, Hermosillo, Sonora",
    description:
      "Asociación civil que rescata perros y gatos en situación de calle, los esterilizamos y buscamos un hogar responsable para cada uno.",
    documents: documentsFor(["980 KB", "1.1 MB", "3.0 MB"]),
    photos: SAMPLE_PHOTOS,
  },
  {
    id: "sol-006",
    shelterName: "Amigos Peludos",
    city: "Guaymas",
    sentAt: "2026-11-22T09:12:00",
    responsible: "Luis Armenta",
    email: "luis@correo.com",
    phone: "622 555 0176",
    address: "Av. Serdán 87, Col. Las Playitas, Guaymas, Sonora",
    description:
      "Refugio comunitario con 25 perros. Trabajamos con jornadas de adopción y campañas de vacunación.",
    documents: documentsFor(["1.5 MB", "720 KB", "1.9 MB"]),
    photos: SAMPLE_PHOTOS.slice(0, 3),
  },
  {
    id: "sol-002",
    shelterName: "Patitas Felices",
    city: "San Luis Río Colorado",
    sentAt: "2026-11-14T13:45:00",
    responsible: "Andrea Sánchez",
    email: "andrea@correo.com",
    phone: "653 555 0109",
    address: "Calle 16 y Av. Obregón 305, Col. Centro, San Luis Río Colorado, Sonora",
    description:
      "Rescatamos mascotas abandonadas en la frontera y las preparamos para su adopción: vacunas, desparasitación y esterilización.",
    documents: documentsFor(["1.0 MB", "940 KB", "2.2 MB"]),
    photos: SAMPLE_PHOTOS,
  },
  {
    id: "sol-005",
    shelterName: "Segunda Oportunidad",
    city: "Ciudad Obregón",
    sentAt: "2026-11-21T18:20:00",
    responsible: "Jorge Valenzuela",
    email: "jorge@correo.com",
    phone: "644 555 0133",
    address: "Calle Sonora 1102, Col. Cuauhtémoc, Ciudad Obregón, Sonora",
    description:
      "Refugio familiar para perros adultos y senior que han sido devueltos o abandonados.",
    documents: documentsFor(["870 KB", "1.3 MB", "2.8 MB"]),
    photos: SAMPLE_PHOTOS.slice(1),
  },
  {
    id: "sol-003",
    shelterName: "Refugio Esperanza Animal",
    city: "Mexicali",
    sentAt: "2026-11-10T08:00:00",
    responsible: "Patricia Moreno",
    email: "patricia@correo.com",
    phone: "686 555 0127",
    address: "Calzada Independencia 450, Col. Nueva, Mexicali, Baja California",
    description:
      "Más de diez años rescatando animales. Contamos con área de cuarentena y atención veterinaria básica.",
    documents: documentsFor(["1.4 MB", "1.0 MB", "3.2 MB"]),
    photos: SAMPLE_PHOTOS,
  },
];

export function findRegistrationRequest(id: string | undefined) {
  return shelterRegistrationRequests.find((request) => request.id === id);
}