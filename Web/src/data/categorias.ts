/* Categorías de mascotas (perro, gato, etc.). Cada categoría pertenece a un refugio y tiene nombre y foto.
   Con backend se guardan en la base de datos y las fotos en Storage; aquí se simulan en memoria mientras la
   página esté abierta, igual que las mascotas y las entrevistas. Al recargar vuelven los datos de ejemplo. */
import { useSyncExternalStore } from "react";
import { initialShelters } from "@/data/refugios";

export type Category = {
  id: string;
  shelterId: string;
  shelterName: string;
  name: string;
  /** Enlace de la foto. En el ejemplo es una imagen de /public/ejemplo o una vista previa local. */
  photo: string;
};

const photo = (n: number) => `/ejemplo/foto-${n}.svg`;
const shelterName = (id: string) => initialShelters.find((s) => s.id === id)?.shelterName ?? "";

const seed: Category[] = [
  { id: "cat-001", shelterId: "ref-001", shelterName: shelterName("ref-001"), name: "Perros", photo: photo(1) },
  { id: "cat-002", shelterId: "ref-001", shelterName: shelterName("ref-001"), name: "Gatos", photo: photo(2) },
  { id: "cat-003", shelterId: "ref-002", shelterName: shelterName("ref-002"), name: "Perros", photo: photo(3) },
  { id: "cat-004", shelterId: "ref-002", shelterName: shelterName("ref-002"), name: "Gatos", photo: photo(4) },
  { id: "cat-005", shelterId: "ref-002", shelterName: shelterName("ref-002"), name: "Conejos", photo: photo(2) },
  { id: "cat-006", shelterId: "ref-004", shelterName: shelterName("ref-004"), name: "Gatos", photo: photo(4) },
  { id: "cat-007", shelterId: "ref-005", shelterName: shelterName("ref-005"), name: "Perros", photo: photo(1) },
  { id: "cat-008", shelterId: "ref-005", shelterName: shelterName("ref-005"), name: "Aves", photo: photo(3) },
];

let categories: Category[] = seed;
const listeners = new Set<() => void>();

function commit(next: Category[]) {
  categories = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCategories(): Category[] {
  return categories;
}

/** Todas las categorías, y la pantalla se actualiza sola cuando cambian. */
export function useCategories(): Category[] {
  return useSyncExternalStore(subscribe, getCategories, getCategories);
}

/** Refugios a los que se puede asignar una categoría: solo los activos. */
export function shelterOptions(): { id: string; name: string }[] {
  return initialShelters
    .filter((s) => s.status === "activo")
    .map((s) => ({ id: s.id, name: s.shelterName }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

/** Nombres válidos: de 2 a 30 caracteres y sin repetirse dentro del mismo refugio. */
export const NAME_MIN = 2;
export const NAME_MAX = 30;

export function nameTaken(list: Category[], shelterId: string, name: string, ignoreId?: string): boolean {
  const wanted = name.trim().toLocaleLowerCase("es");
  return list.some(
    (c) => c.shelterId === shelterId && c.id !== ignoreId && c.name.trim().toLocaleLowerCase("es") === wanted,
  );
}

function nextId() {
  const highest = categories.reduce((max, c) => Math.max(max, Number(c.id.replace(/\D/g, "")) || 0), 0);
  return `cat-${String(highest + 1).padStart(3, "0")}`;
}

export type CategoryFields = { shelterId: string; name: string; photo: string };

/** Crea la categoría o actualiza la existente. */
export function saveCategory(id: string | null, fields: CategoryFields): Category {
  // Aquí se sube la foto a Storage y se guarda la categoría en la base de datos.
  // Si se cambia la foto, la anterior debe borrarse del almacenamiento, no solo el enlace.
  const record = {
    shelterId: fields.shelterId,
    shelterName: shelterName(fields.shelterId),
    name: fields.name.trim(),
    photo: fields.photo,
  };
  if (id) {
    const current = categories.find((c) => c.id === id);
    if (current) {
      const updated: Category = { ...current, ...record };
      commit(categories.map((c) => (c.id === id ? updated : c)));
      return updated;
    }
  }
  const created: Category = { id: nextId(), ...record };
  commit([created, ...categories]);
  return created;
}

export function removeCategory(id: string) {
  // Aquí se borra la categoría y su foto del almacenamiento.
  commit(categories.filter((c) => c.id !== id));
}