// Datos ficticios de diseño (equivalentes al script semilla, RNF-32). Sin backend.
import type { Perfil, Requisitos } from "./compat";

export type Refugio = {
  id: string;
  nombre: string;
  ciudad: string;
  descripcion: string;
  activo: boolean;
  stripeVinculada: boolean;
};

export type Mascota = {
  id: string;
  nombre: string;
  especie: "Perro" | "Gato" | "Otra";
  tamano: "Pequeño" | "Mediano" | "Grande";
  edadMeses: number;
  sexo: "Macho" | "Hembra";
  actividad: "Bajo" | "Medio" | "Alto";
  refugioId: string;
  descripcion: string;
  estado: "Disponible" | "En proceso de adopción" | "Adoptada";
  req: Requisitos;
};

export const REFUGIOS: Refugio[] = [
  {
    id: "sol",
    nombre: "Refugio Sol",
    ciudad: "San Luis Río Colorado",
    descripcion: "Rescatamos y damos hogar temporal a perros y gatos de la región.",
    activo: true,
    stripeVinculada: true,
  },
  {
    id: "huellitas",
    nombre: "Huellitas Felices",
    ciudad: "San Luis Río Colorado",
    descripcion: "Asociación civil dedicada a la adopción responsable.",
    activo: true,
    stripeVinculada: true,
  },
  {
    id: "esperanza",
    nombre: "Esperanza Animal",
    ciudad: "Mexicali",
    descripcion: "Refugio suspendido temporalmente.",
    activo: false,
    stripeVinculada: false,
  },
];

const r = (
  espacioMin: 1 | 2 | 3,
  horasMin: number,
  experiencia: 0 | 1 | 2,
  compromiso: 0 | 1 | 2,
  compatibleNinos: boolean,
  compatibleMascotas = true,
): Requisitos => ({ espacioMin, horasMin, experiencia, compromiso, compatibleNinos, compatibleMascotas });

export const MASCOTAS: Mascota[] = [
  { id: "luna", nombre: "Luna", especie: "Perro", tamano: "Mediano", edadMeses: 27, sexo: "Hembra", actividad: "Medio", refugioId: "sol", estado: "Disponible", descripcion: "Luna es cariñosa y tranquila. Le encanta caminar por las tardes y convivir con niños.", req: r(1, 3, 0, 1, true) },
  { id: "pelusa", nombre: "Pelusa", especie: "Gato", tamano: "Pequeño", edadMeses: 10, sexo: "Hembra", actividad: "Bajo", refugioId: "huellitas", estado: "Disponible", descripcion: "Una gatita dormilona que se adapta a cualquier espacio.", req: r(1, 1, 0, 0, true) },
  { id: "thor", nombre: "Thor", especie: "Perro", tamano: "Grande", edadMeses: 48, sexo: "Macho", actividad: "Alto", refugioId: "sol", estado: "Disponible", descripcion: "Enérgico y leal. Necesita espacio para correr y juego diario.", req: r(3, 3, 1, 1, true) },
  { id: "milo", nombre: "Milo", especie: "Gato", tamano: "Pequeño", edadMeses: 8, sexo: "Macho", actividad: "Alto", refugioId: "huellitas", estado: "Disponible", descripcion: "Juguetón y curioso. Requiere dueños con experiencia en gatos jóvenes.", req: r(1, 2, 2, 1, true) },
  { id: "nala", nombre: "Nala", especie: "Perro", tamano: "Mediano", edadMeses: 60, sexo: "Hembra", actividad: "Medio", refugioId: "sol", estado: "Disponible", descripcion: "Adulta y noble. Prefiere hogares sin niños pequeños y con rutina constante.", req: r(2, 4, 1, 2, false) },
  { id: "rocky", nombre: "Rocky", especie: "Perro", tamano: "Grande", edadMeses: 36, sexo: "Macho", actividad: "Alto", refugioId: "sol", estado: "Disponible", descripcion: "Entrenado y fuerte; necesita un hogar con experiencia.", req: r(3, 6, 2, 2, true) },
  { id: "coco", nombre: "Coco", especie: "Otra", tamano: "Pequeño", edadMeses: 18, sexo: "Macho", actividad: "Medio", refugioId: "huellitas", estado: "Disponible", descripcion: "Conejo sociable que requiere tiempo diario fuera de su jaula.", req: r(3, 8, 1, 1, false) },
  { id: "bruno", nombre: "Bruno", especie: "Perro", tamano: "Pequeño", edadMeses: 96, sexo: "Macho", actividad: "Bajo", refugioId: "sol", estado: "En proceso de adopción", descripcion: "Senior tranquilo.", req: r(1, 2, 0, 0, true) },
  { id: "kira", nombre: "Kira", especie: "Gato", tamano: "Pequeño", edadMeses: 14, sexo: "Hembra", actividad: "Medio", refugioId: "esperanza", estado: "Disponible", descripcion: "De refugio suspendido: no debe aparecer.", req: r(1, 1, 0, 0, true) },
];

export const PERFIL_EJEMPLO: Perfil = {
  espacio: 2,
  horas: 4,
  experiencia: 1,
  compromiso: 1,
  ninos: true,
  otrasMascotas: false,
};

export type EstadoSolicitud = "Pendiente" | "Aprobada" | "Rechazada" | "Cancelada";

export type Solicitud = {
  id: string;
  mascotaId: string;
  fecha: Date;
  estado: EstadoSolicitud;
  motivoDecision?: string;
  contrato: boolean;
  entregada: boolean;
  motivo: string;
  vivienda: string;
  personas: number;
};

const dias = (n: number) => new Date(Date.now() - n * 86400000);

export const SOLICITUDES: Solicitud[] = [
  { id: "s1", mascotaId: "luna", fecha: dias(1), estado: "Pendiente", contrato: false, entregada: false, motivo: "Quiero darle un hogar a una perrita.", vivienda: "Casa", personas: 3 },
  { id: "s2", mascotaId: "bruno", fecha: dias(5), estado: "Aprobada", contrato: true, entregada: false, motivo: "Busco un compañero tranquilo.", vivienda: "Casa", personas: 2 },
  { id: "s3", mascotaId: "thor", fecha: dias(12), estado: "Rechazada", motivoDecision: "Thor necesita un espacio amplio con patio.", contrato: false, entregada: false, motivo: "Me gustan los perros grandes.", vivienda: "Departamento", personas: 2 },
  { id: "s4", mascotaId: "milo", fecha: dias(20), estado: "Cancelada", motivoDecision: "El refugio canceló la adopción por un cambio en la salud de la mascota.", contrato: false, entregada: false, motivo: "Quiero un gato.", vivienda: "Casa", personas: 3 },
  { id: "s5", mascotaId: "pelusa-adoptada", fecha: dias(100), estado: "Aprobada", contrato: true, entregada: true, motivo: "Adopción concretada.", vivienda: "Casa", personas: 3 },
];

// Mascota ya adoptada (no aparece en Explorar).
export const ADOPTADA = { id: "pelusa-adoptada", nombre: "Tigre", especie: "Gato" as const, refugioId: "huellitas" };
export const FECHA_ENTREGA = dias(92);

export type Hito = { dias: number; completadoEn: Date | null };
export const HITOS_INICIALES: Hito[] = [7, 30, 90, 180, 365].map((d) => ({
  dias: d,
  completadoEn: d === 7 ? new Date(FECHA_ENTREGA.getTime() + 8 * 86400000) : null,
}));

export type Donacion = {
  id: string;
  fecha: Date;
  refugioId: string;
  tipo: "Única" | "Mensual" | "Post-adopción";
  monto: number;
};
export const DONACIONES_INICIALES: Donacion[] = [
  { id: "d1", fecha: dias(30), refugioId: "sol", tipo: "Única", monto: 200 },
  { id: "d2", fecha: dias(10), refugioId: "huellitas", tipo: "Post-adopción", monto: 500 },
];

export type Apadrinamiento = { id: string; refugioId: string; mascotaId?: string; monto: number };

export const refugioPorId = (id: string) => REFUGIOS.find((x) => x.id === id)!;
export const mascotaPorId = (id: string) => MASCOTAS.find((x) => x.id === id);

export const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const fechaCorta = (d: Date) => `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
export const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;
export function edadTexto(m: number) {
  const a = Math.floor(m / 12);
  const mm = m % 12;
  if (a === 0) return `${mm} ${mm === 1 ? "mes" : "meses"}`;
  if (mm === 0) return `${a} ${a === 1 ? "año" : "años"}`;
  return `${a} ${a === 1 ? "año" : "años"} ${mm} m`;
}
export function grupoEdad(m: number): "Cachorro" | "Joven" | "Adulto" | "Senior" {
  if (m <= 12) return "Cachorro";
  if (m < 48) return "Joven";
  if (m < 96) return "Adulto";
  return "Senior";
}

export const infoMascota = (id: string) => {
  const m = mascotaPorId(id);
  return m
    ? { nombre: m.nombre, especie: m.especie, refugioId: m.refugioId }
    : { nombre: ADOPTADA.nombre, especie: ADOPTADA.especie, refugioId: ADOPTADA.refugioId };
};

export type EstadoHito = "Próximo" | "Disponible" | "Completado" | "Vencido" | "Completado con retraso";
export const fechaHito = (h: Hito) => new Date(FECHA_ENTREGA.getTime() + h.dias * 86400000);
export function estadoHito(h: Hito): EstadoHito {
  const f = fechaHito(h).getTime();
  if (h.completadoEn) return h.completadoEn.getTime() > f + 3 * 86400000 ? "Completado con retraso" : "Completado";
  const now = Date.now();
  if (now < f) return "Próximo";
  return now <= f + 3 * 86400000 ? "Disponible" : "Vencido";
}

// ---------- Entrevistas (cambio solicitado: entrevistas a domicilio) ----------
export type Entrevista = {
  id: string;
  tipo: "adopcion" | "hito";
  solicitudId: string;
  hitoDias?: number;
  fecha: Date; // fecha y hora de la entrevista
  estado: "Programada" | "Realizada" | "Cancelada";
  motivoCancelacion?: string;
};

const enDias = (offset: number, hora: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hora, 0, 0, 0);
  return d;
};

export const ENTREVISTAS_INICIALES: Entrevista[] = [
  { id: "e1", tipo: "adopcion", solicitudId: "s1", fecha: enDias(1, 17), estado: "Programada" },
  { id: "e2", tipo: "hito", solicitudId: "s5", hitoDias: 90, fecha: enDias(3, 11), estado: "Programada" },
  { id: "e3", tipo: "hito", solicitudId: "s5", hitoDias: 7, fecha: new Date(FECHA_ENTREGA.getTime() + 9 * 86400000), estado: "Realizada" },
  { id: "e4", tipo: "adopcion", solicitudId: "s4", fecha: enDias(-18, 16), estado: "Cancelada", motivoCancelacion: "El refugio canceló la adopción antes de la entrevista." },
];

export function horaTexto(d: Date) {
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const suf = h >= 12 ? "p. m." : "a. m.";
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${suf}`;
}
export const fechaHora = (d: Date) => `${fechaCorta(d)} · ${horaTexto(d)}`;

// Recordatorios push: el día anterior a las 12:00 p. m. y 3 horas antes de la entrevista.
export function recordatorios(e: Entrevista) {
  const antes = new Date(e.fecha);
  antes.setDate(antes.getDate() - 1);
  antes.setHours(12, 0, 0, 0);
  return { diaAntes: antes, tresHorasAntes: new Date(e.fecha.getTime() - 3 * 3600000) };
}

export function tituloEntrevista(e: Entrevista) {
  return e.tipo === "adopcion" ? "Entrevista de adopción" : `Entrevista de seguimiento · Hito de ${e.hitoDias} días`;
}
