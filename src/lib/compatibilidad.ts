/* Regla de compatibilidad (RN-05). Vive en un solo lugar para que el panel web y la app móvil den el mismo
   resultado (RNF-26). Compara lo que pide la mascota contra lo que ofrece el adoptante, en 6 criterios.
   Una mascota es compatible si cumple al menos 4 de 6. */
export const MIN_CRITERIA = 4;

/* Escalas de menor a mayor (RN-05). */
export type SpaceLevel = 1 | 2 | 3;
export type ExperienceLevel = 0 | 1 | 2;
export type CommitmentLevel = 0 | 1 | 2;

export const SPACE_LABEL: Record<SpaceLevel, string> = {
  1: "Reducido (departamento o cuarto)",
  2: "Medio (casa sin patio)",
  3: "Amplio (casa con patio o jardín)",
};
export const EXPERIENCE_LABEL: Record<ExperienceLevel, string> = { 0: "Ninguna", 1: "Básica", 2: "Amplia" };
export const COMMITMENT_LABEL: Record<CommitmentLevel, string> = { 0: "Bajo", 1: "Medio", 2: "Alto" };

/** Lo que responde el adoptante (RF-28). */
export type AdopterProfile = {
  space: SpaceLevel;
  hoursAtHome: number;
  experience: ExperienceLevel;
  commitment: CommitmentLevel;
  hasChildren: boolean;
  hasOtherPets: boolean;
};

/** Lo que define el refugio para cada mascota (RF-24). */
export type PetRequirements = {
  minSpace: SpaceLevel;
  minHours: number;
  experience: ExperienceLevel;
  commitment: CommitmentLevel;
  childrenOk: boolean;
  petsOk: boolean;
};

export type CriterionResult = {
  key: "space" | "hours" | "experience" | "commitment" | "children" | "pets";
  label: string;
  /** Texto de lo que pide la mascota. */
  required: string;
  /** Texto de lo que ofrece el adoptante. */
  offered: string;
  met: boolean;
};

export function evaluateCompatibility(profile: AdopterProfile, req: PetRequirements) {
  const criteria: CriterionResult[] = [
    {
      key: "space",
      label: "Espacio",
      required: `Mínimo: ${SPACE_LABEL[req.minSpace]}`,
      offered: SPACE_LABEL[profile.space],
      met: profile.space >= req.minSpace,
    },
    {
      key: "hours",
      label: "Tiempo en casa",
      required: `Mínimo ${req.minHours} h al día`,
      offered: `${profile.hoursAtHome} h al día`,
      met: profile.hoursAtHome >= req.minHours,
    },
    {
      key: "experience",
      label: "Experiencia previa",
      required: `Requerida: ${EXPERIENCE_LABEL[req.experience].toLowerCase()}`,
      offered: EXPERIENCE_LABEL[profile.experience],
      met: profile.experience >= req.experience,
    },
    {
      key: "commitment",
      label: "Compromiso",
      required: `Exigido: ${COMMITMENT_LABEL[req.commitment].toLowerCase()}`,
      offered: COMMITMENT_LABEL[profile.commitment],
      met: profile.commitment >= req.commitment,
    },
    {
      key: "children",
      label: "Niños",
      required: req.childrenOk ? "Compatible con niños" : "No compatible con niños",
      offered: profile.hasChildren ? "Hay niños en casa" : "No hay niños en casa",
      met: !profile.hasChildren || req.childrenOk,
    },
    {
      key: "pets",
      label: "Otras mascotas",
      required: req.petsOk ? "Compatible con otras mascotas" : "No compatible con otras mascotas",
      offered: profile.hasOtherPets ? "Tiene otras mascotas" : "No tiene otras mascotas",
      met: !profile.hasOtherPets || req.petsOk,
    },
  ];
  const metCount = criteria.filter((c) => c.met).length;
  return { criteria, metCount, compatible: metCount >= MIN_CRITERIA };
}