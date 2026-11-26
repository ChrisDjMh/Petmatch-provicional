export type PhotoOwnerType = "refugio" | "mascota" | "usuario";

export type AdminPhoto = {
  id: string;
  ownerType: PhotoOwnerType;
  ownerId: string;
  ownerName: string;
  label: string;
  url: string;
  fileName: string;
  /** true cuando la imagen se eligió desde el equipo durante esta sesión. */
  localFile?: boolean;
};

/** Datos de ejemplo para el prototipo frontend. Las imágenes iniciales viven en /public/ejemplo. */
export const initialAdminPhotos: AdminPhoto[] = [
  { id: "foto-ref-001", ownerType: "refugio", ownerId: "ref-001", ownerName: "Patitas Felices", label: "Foto principal del refugio", url: "/ejemplo/foto-1.svg", fileName: "patitas-felices.svg" },
  { id: "foto-ref-002", ownerType: "refugio", ownerId: "ref-002", ownerName: "Huellas de Esperanza", label: "Foto de instalaciones", url: "/ejemplo/foto-2.svg", fileName: "huellas-esperanza.svg" },
  { id: "foto-ref-003", ownerType: "refugio", ownerId: "ref-004", ownerName: "Colita Alegre", label: "Foto principal del refugio", url: "/ejemplo/foto-3.svg", fileName: "colita-alegre.svg" },
  { id: "foto-mas-001", ownerType: "mascota", ownerId: "mas-001", ownerName: "Max · Patitas Felices", label: "Foto de mascota", url: "/ejemplo/foto-1.svg", fileName: "max.svg" },
  { id: "foto-mas-002", ownerType: "mascota", ownerId: "mas-002", ownerName: "Luna · Huellas de Esperanza", label: "Foto de mascota", url: "/ejemplo/foto-2.svg", fileName: "luna.svg" },
  { id: "foto-mas-003", ownerType: "mascota", ownerId: "mas-003", ownerName: "Bruno · Colita Alegre", label: "Foto de mascota", url: "/ejemplo/foto-3.svg", fileName: "bruno.svg" },
  { id: "foto-usr-001", ownerType: "usuario", ownerId: "usr-001", ownerName: "Andrea Morales", label: "Foto de perfil", url: "/ejemplo/foto-4.svg", fileName: "andrea-morales.svg" },
  { id: "foto-usr-002", ownerType: "usuario", ownerId: "usr-002", ownerName: "Luis Fernández", label: "Foto de perfil", url: "/ejemplo/foto-1.svg", fileName: "luis-fernandez.svg" },
];

export const PHOTO_TYPE_LABEL: Record<PhotoOwnerType, string> = {
  refugio: "Refugios",
  mascota: "Mascotas",
  usuario: "Usuarios",
};
