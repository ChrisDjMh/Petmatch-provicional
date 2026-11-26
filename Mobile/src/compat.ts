// Regla de compatibilidad RN-05 — implementada en un solo lugar (RNF-26).
export type Perfil = {
  espacio: 1 | 2 | 3; // reducido, medio, amplio
  horas: number; // 0..24
  experiencia: 0 | 1 | 2; // ninguna, básica, amplia
  compromiso: 0 | 1 | 2; // bajo, medio, alto
  ninos: boolean;
  otrasMascotas: boolean;
};

export type Requisitos = {
  espacioMin: 1 | 2 | 3;
  horasMin: number;
  experiencia: 0 | 1 | 2;
  compromiso: 0 | 1 | 2;
  compatibleNinos: boolean;
  compatibleMascotas: boolean;
};

export const ESPACIO = ["", "Reducido", "Medio", "Amplio"];
export const NIVEL_EXP = ["Ninguna", "Básica", "Amplia"];
export const NIVEL_COMP = ["Bajo", "Medio", "Alto"];

export type Criterio = {
  clave: string;
  titulo: string;
  cumple: boolean;
  pide: string;
  ofreces: string;
};

export function evaluar(p: Perfil, r: Requisitos): { criterios: Criterio[]; cumplidos: number } {
  const criterios: Criterio[] = [
    {
      clave: "espacio",
      titulo: "Espacio",
      cumple: p.espacio >= r.espacioMin,
      pide: `Mínimo ${ESPACIO[r.espacioMin]}`,
      ofreces: ESPACIO[p.espacio],
    },
    {
      clave: "tiempo",
      titulo: "Tiempo en casa",
      cumple: p.horas >= r.horasMin,
      pide: `Mínimo ${r.horasMin} h al día`,
      ofreces: `${p.horas} h al día`,
    },
    {
      clave: "experiencia",
      titulo: "Experiencia previa",
      cumple: p.experiencia >= r.experiencia,
      pide: NIVEL_EXP[r.experiencia],
      ofreces: NIVEL_EXP[p.experiencia],
    },
    {
      clave: "compromiso",
      titulo: "Compromiso",
      cumple: p.compromiso >= r.compromiso,
      pide: NIVEL_COMP[r.compromiso],
      ofreces: NIVEL_COMP[p.compromiso],
    },
    {
      clave: "ninos",
      titulo: "Niños",
      cumple: !p.ninos || r.compatibleNinos,
      pide: r.compatibleNinos ? "Compatible con niños" : "No compatible con niños",
      ofreces: p.ninos ? "Hay niños en casa" : "No hay niños en casa",
    },
    {
      clave: "mascotas",
      titulo: "Otras mascotas",
      cumple: !p.otrasMascotas || r.compatibleMascotas,
      pide: r.compatibleMascotas ? "Compatible con otras mascotas" : "No compatible con otras mascotas",
      ofreces: p.otrasMascotas ? "Tienes otras mascotas" : "No tienes otras mascotas",
    },
  ];
  return { criterios, cumplidos: criterios.filter((c) => c.cumple).length };
}

export const MINIMO_COMPATIBLE = 4;
