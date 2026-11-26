/* Mascotas del refugio y su detalle (RF-20, RF-21, RF-24). Con backend se guardan en la base de datos y las
   fotos en Storage; aquí se simulan en memoria mientras la página esté abierta, igual que las entregas.
   Las mascotas nuevas o editadas se ven al instante en "Mis mascotas"; al recargar la página se reinician. */
import { initialPets, type Pet, type PetSex, type PetSize, type Species } from "@/data/mascotas";
import type { PetRequirements } from "@/lib/compatibilidad";

/* Nivel de actividad (RN-18). Se usa como filtro exacto en la app, no cuenta como criterio (RN-05). */
export type Activity = "Bajo" | "Medio" | "Alto";

/** Lo que captura el formulario además de lo que ya muestra la lista (RF-20 y RF-24). */
export type PetDetail = {
  activity: Activity;
  description: string;
  /** De 1 a 5 fotos. La primera es la principal (la que se ve en la lista y en la app). */
  photos: string[];
  /** Los seis requisitos de adopción. "childrenOk" y "petsOk" son también la compatibilidad de RF-20. */
  requirements: PetRequirements;
};

const photo = (n: number) => `/ejemplo/foto-${n}.svg`;

const initialDetails: Record<string, PetDetail> = {
  "mas-001": {
    activity: "Alto",
    description: "Max es juguetón y muy cariñoso. Le encanta correr en el parque y aprende rápido los trucos.",
    photos: [photo(1), photo(2)],
    requirements: { minSpace: 2, minHours: 4, experience: 1, commitment: 1, childrenOk: true, petsOk: true },
  },
  "mas-002": {
    activity: "Medio",
    description: "Luna es tranquila y curiosa. Se adapta bien a espacios pequeños y le gusta dormir junto a la ventana.",
    photos: [photo(2)],
    requirements: { minSpace: 1, minHours: 2, experience: 0, commitment: 0, childrenOk: true, petsOk: false },
  },
  "mas-003": {
    activity: "Alto",
    description: "Bruno es grande y protector. Necesita espacio para moverse y una rutina de paseos diarios.",
    photos: [photo(3), photo(1)],
    requirements: { minSpace: 3, minHours: 6, experience: 2, commitment: 2, childrenOk: false, petsOk: false },
  },
  "mas-004": {
    activity: "Medio",
    description: "Toby es pequeño, sociable y se lleva bien con todos.",
    photos: [photo(4)],
    requirements: { minSpace: 1, minHours: 3, experience: 0, commitment: 1, childrenOk: true, petsOk: true },
  },
  "mas-005": {
    activity: "Bajo",
    description: "Nala es una gata serena que disfruta de la compañía y de las siestas largas.",
    photos: [photo(2)],
    requirements: { minSpace: 1, minHours: 2, experience: 0, commitment: 0, childrenOk: true, petsOk: true },
  },
  "mas-006": {
    activity: "Medio",
    description: "Rocky es un perro adulto, noble y tranquilo. Ideal para una familia con rutina estable.",
    photos: [photo(3), photo(4), photo(1)],
    requirements: { minSpace: 2, minHours: 5, experience: 1, commitment: 1, childrenOk: true, petsOk: false },
  },
  "mas-007": {
    activity: "Alto",
    description: "Mía es una gatita muy activa que busca jugar todo el día.",
    photos: [photo(1)],
    requirements: { minSpace: 1, minHours: 4, experience: 0, commitment: 1, childrenOk: true, petsOk: true },
  },
  "mas-008": {
    activity: "Bajo",
    description: "Coco es pequeña, dócil y fácil de cuidar.",
    photos: [photo(4)],
    requirements: { minSpace: 1, minHours: 1, experience: 0, commitment: 0, childrenOk: false, petsOk: true },
  },
};

let pets: Pet[] = initialPets.map((pet) => ({ ...pet }));
const details = new Map<string, PetDetail>(Object.entries(initialDetails));

export function listPets(): Pet[] {
  return pets.map((pet) => ({ ...pet }));
}

export function getPetRecord(id: string): { pet: Pet; detail: PetDetail } | undefined {
  const pet = pets.find((p) => p.id === id);
  const detail = details.get(id);
  return pet && detail ? { pet: { ...pet }, detail } : undefined;
}

/** Lo que el formulario puede cambiar de la mascota. El estado nunca se edita aquí (RN-04). */
export type PetFields = {
  name: string;
  species: Species;
  size: PetSize;
  ageYears: number;
  ageMonths: number;
  sex: PetSex;
};

function nextId() {
  const highest = pets.reduce((max, p) => Math.max(max, Number(p.id.replace(/\D/g, "")) || 0), 0);
  return `mas-${String(highest + 1).padStart(3, "0")}`;
}

/** Crea la mascota (queda "Disponible", RF-20) o actualiza la existente conservando su estado (RF-21). */
export function savePet(id: string | null, fields: PetFields, detail: PetDetail): Pet {
  if (detail.photos.length < 1 || detail.photos.length > 5) {
    throw new Error("Una mascota lleva de 1 a 5 fotos.");
  }
  const mainPhoto = detail.photos[0];

  if (id) {
    const current = pets.find((p) => p.id === id);
    if (current) {
      const updated: Pet = { ...current, ...fields, photo: mainPhoto };
      pets = pets.map((p) => (p.id === id ? updated : p));
      details.set(id, detail);
      return { ...updated };
    }
  }

  const created: Pet = { id: nextId(), ...fields, status: "disponible", photo: mainPhoto };
  // La más reciente va primero, como en una lista de publicaciones.
  pets = [created, ...pets];
  details.set(created.id, detail);
  return { ...created };
}

export function removePet(id: string) {
  pets = pets.filter((p) => p.id !== id);
  details.delete(id);
}