/* Datos de ejemplo de las mascotas del refugio (RF-21, RF-22). Con backend se reemplazan por la consulta
   real. Los valores de las listas son los de RN-18. */
export type Species = "Perro" | "Gato" | "Otra";
export type PetSize = "Pequeño" | "Mediano" | "Grande";
export type PetSex = "Macho" | "Hembra";
/* RN-04: Disponible → En proceso de adopción (solicitud aprobada) → Adoptada (entrega registrada). */
export type PetStatus = "disponible" | "en-proceso" | "adoptada";

export type Pet = {
  id: string;
  name: string;
  species: Species;
  size: PetSize;
  /** La edad se captura en años y meses (RN-18). */
  ageYears: number;
  ageMonths: number;
  sex: PetSex;
  status: PetStatus;
  /** Foto principal. En el ejemplo son imágenes de /public/ejemplo; con backend, la URL de Storage. */
  photo: string;
};

export const initialPets: Pet[] = [
  { id: "mas-001", name: "Max", species: "Perro", size: "Mediano", ageYears: 2, ageMonths: 3, sex: "Macho", status: "disponible", photo: "/ejemplo/foto-1.svg" },
  { id: "mas-002", name: "Luna", species: "Gato", size: "Pequeño", ageYears: 0, ageMonths: 8, sex: "Hembra", status: "disponible", photo: "/ejemplo/foto-2.svg" },
  { id: "mas-003", name: "Bruno", species: "Perro", size: "Grande", ageYears: 4, ageMonths: 0, sex: "Macho", status: "en-proceso", photo: "/ejemplo/foto-3.svg" },
  { id: "mas-004", name: "Toby", species: "Perro", size: "Pequeño", ageYears: 1, ageMonths: 6, sex: "Macho", status: "adoptada", photo: "/ejemplo/foto-4.svg" },
  { id: "mas-005", name: "Nala", species: "Gato", size: "Mediano", ageYears: 3, ageMonths: 0, sex: "Hembra", status: "adoptada", photo: "/ejemplo/foto-2.svg" },
  { id: "mas-006", name: "Rocky", species: "Perro", size: "Grande", ageYears: 6, ageMonths: 2, sex: "Macho", status: "disponible", photo: "/ejemplo/foto-3.svg" },
  { id: "mas-007", name: "Mía", species: "Gato", size: "Pequeño", ageYears: 0, ageMonths: 5, sex: "Hembra", status: "disponible", photo: "/ejemplo/foto-1.svg" },
  { id: "mas-008", name: "Coco", species: "Otra", size: "Pequeño", ageYears: 1, ageMonths: 0, sex: "Hembra", status: "disponible", photo: "/ejemplo/foto-4.svg" },
];