import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { ChoiceGroup, SelectField } from "@/components/panel/FormControls";
import PetPhotoPicker, {
  MAX_PET_PHOTOS,
  MIN_PET_PHOTOS,
  itemsFromUrls,
  photoProblem,
  type PetPhotoItem,
} from "@/components/panel/PetPhotoPicker";
import { TextAreaField, TextField } from "@/components/auth/TextField";
import { primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";
import type { PetSex, PetSize, PetStatus, Species } from "@/data/mascotas";
import { getPetRecord, savePet, type Activity, type PetDetail, type PetFields } from "@/data/mascotasStore";
import {
  COMMITMENT_LABEL,
  EXPERIENCE_LABEL,
  MIN_CRITERIA,
  SPACE_LABEL,
  type CommitmentLevel,
  type ExperienceLevel,
  type SpaceLevel,
} from "@/lib/compatibilidad";

/* Formulario de mascota: sirve para agregar (RF-20) y para editar (RF-21). Incluye los seis requisitos de
   adopción de RF-24, que alimentan la regla de compatibilidad de RN-05. Los valores de las listas son los de
   RN-18. Por ahora solo frontend: guarda en memoria (data/mascotasStore.ts); con backend se enviará a la API. */

const SPECIES: Species[] = ["Perro", "Gato", "Otra"];
const SIZES: PetSize[] = ["Pequeño", "Mediano", "Grande"];
const SEXES: PetSex[] = ["Macho", "Hembra"];
const ACTIVITIES: Activity[] = ["Bajo", "Medio", "Alto"];

const SPACE_OPTIONS = ([1, 2, 3] as SpaceLevel[]).map((n) => ({ value: String(n), label: SPACE_LABEL[n] }));
const EXPERIENCE_OPTIONS = ([0, 1, 2] as ExperienceLevel[]).map((n) => ({
  value: String(n),
  label: EXPERIENCE_LABEL[n],
}));
const COMMITMENT_OPTIONS = ([0, 1, 2] as CommitmentLevel[]).map((n) => ({
  value: String(n),
  label: COMMITMENT_LABEL[n],
}));
const YES_NO = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

const oneOf = (values: readonly string[], message: string) =>
  z.string().refine((value) => values.includes(value), message);

const wholeNumber = (min: number, max: number, empty: string, invalid: string) =>
  z
    .string()
    .trim()
    .min(1, empty)
    .refine((value) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max, invalid);

/* ---------- Validación (RF-20, RF-24, RN-18) ---------- */
const petSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Escribe el nombre de la mascota.")
    .max(40, "El nombre puede tener máximo 40 caracteres."),
  species: oneOf(SPECIES, "Elige la especie."),
  size: oneOf(SIZES, "Elige el tamaño."),
  ageYears: wholeNumber(0, 30, "Escribe los años (0 si es menor de un año).", "Los años van de 0 a 30, sin decimales."),
  ageMonths: wholeNumber(0, 11, "Escribe los meses (0 si son años completos).", "Los meses van de 0 a 11, sin decimales."),
  sex: oneOf(SEXES, "Elige el sexo."),
  activity: oneOf(ACTIVITIES, "Elige el nivel de actividad."),
  minSpace: oneOf(["1", "2", "3"], "Elige el espacio mínimo que necesita."),
  minHours: wholeNumber(0, 24, "Escribe las horas mínimas al día.", "Las horas van de 0 a 24, sin decimales."),
  experience: oneOf(["0", "1", "2"], "Elige la experiencia previa que pides."),
  commitment: oneOf(["0", "1", "2"], "Elige el nivel de compromiso que exige."),
  childrenOk: oneOf(["si", "no"], "Indica si es compatible con niños."),
  petsOk: oneOf(["si", "no"], "Indica si es compatible con otras mascotas."),
  description: z
    .string()
    .trim()
    .min(1, "Escribe una descripción de la mascota.")
    .max(1000, "La descripción puede tener máximo 1000 caracteres."),
  photos: z.array(z.custom<PetPhotoItem>()).superRefine((items, ctx) => {
    if (items.length < MIN_PET_PHOTOS) {
      ctx.addIssue({ code: "custom", message: "Sube al menos una foto de la mascota." });
      return;
    }
    if (items.length > MAX_PET_PHOTOS) {
      const extra = items.length - MAX_PET_PHOTOS;
      ctx.addIssue({
        code: "custom",
        message: `Puedes subir máximo ${MAX_PET_PHOTOS} fotos (llevas ${items.length}). Quita ${extra}.`,
      });
      return;
    }
    for (const item of items) {
      const problem = photoProblem(item);
      if (problem) {
        ctx.addIssue({ code: "custom", message: problem });
        return;
      }
    }
  }),
});

type PetFormValues = z.infer<typeof petSchema>;

const EMPTY_VALUES: PetFormValues = {
  name: "",
  species: "",
  size: "",
  ageYears: "0",
  ageMonths: "0",
  sex: "",
  activity: "",
  // Los seis requisitos empiezan sin respuesta a propósito: no se puede publicar sin elegirlos (RF-24).
  minSpace: "",
  minHours: "",
  experience: "",
  commitment: "",
  childrenOk: "",
  petsOk: "",
  description: "",
  photos: [],
};

function SectionTitle({ number, children }: { number: number; children: string }) {
  return (
    <h2 className="flex items-center gap-3 font-heading text-2xl font-bold">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-background">
        {number}
      </span>
      {children}
    </h2>
  );
}

const cardClass = "anim-fade-up mt-8 rounded-[2rem] bg-white/50 p-6 shadow-soft backdrop-blur sm:p-8";

const STATUS_NOTE: Record<Exclude<PetStatus, "disponible">, string> = {
  "en-proceso":
    "Esta mascota tiene una adopción aprobada. Puedes corregir sus datos, pero cambiar los requisitos no afecta esa solicitud.",
  adoptada:
    "Esta mascota ya fue adoptada. Puedes corregir sus datos, pero no vuelve a aparecer en la app.",
};

function PetForm({ petId }: { petId: string | null }) {
  const navigate = useNavigate();
  const record = petId ? getPetRecord(petId) : undefined;
  const editing = record !== undefined;

  const defaults: PetFormValues = record
    ? {
        name: record.pet.name,
        species: record.pet.species,
        size: record.pet.size,
        ageYears: String(record.pet.ageYears),
        ageMonths: String(record.pet.ageMonths),
        sex: record.pet.sex,
        activity: record.detail.activity,
        minSpace: String(record.detail.requirements.minSpace),
        minHours: String(record.detail.requirements.minHours),
        experience: String(record.detail.requirements.experience),
        commitment: String(record.detail.requirements.commitment),
        childrenOk: record.detail.requirements.childrenOk ? "si" : "no",
        petsOk: record.detail.requirements.petsOk ? "si" : "no",
        description: record.detail.description,
        photos: itemsFromUrls(record.detail.photos),
      }
    : EMPTY_VALUES;

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    mode: "onTouched",
    defaultValues: defaults,
  });

  function onSubmit(values: PetFormValues) {
    const fields: PetFields = {
      name: values.name.trim(),
      species: values.species as Species,
      size: values.size as PetSize,
      ageYears: Number(values.ageYears),
      ageMonths: Number(values.ageMonths),
      sex: values.sex as PetSex,
    };
    const detail: PetDetail = {
      activity: values.activity as Activity,
      description: values.description.trim(),
      photos: values.photos.map((item) => item.url),
      requirements: {
        minSpace: Number(values.minSpace) as SpaceLevel,
        minHours: Number(values.minHours),
        experience: Number(values.experience) as ExperienceLevel,
        commitment: Number(values.commitment) as CommitmentLevel,
        childrenOk: values.childrenOk === "si",
        petsOk: values.petsOk === "si",
      },
    };

    // Aquí se enviará a la API: se crea "Disponible" (RF-20) o se actualiza conservando su estado (RF-21).
    // Las fotos nuevas se suben a Storage; la app las recibe comprimidas (RNF-05).
    const saved = savePet(record?.pet.id ?? null, fields, detail);

    navigate("/refugio/mascotas", {
      replace: true,
      state: {
        message: editing
          ? `Guardaste los cambios de ${saved.name}.`
          : `${saved.name} ya está en tu lista como Disponible y aparece en la app.`,
      },
    });
  }

  const errorCount = Object.keys(errors).length;

  return (
    <ShelterAdminLayout>
      <Link
        to="/refugio/mascotas"
        className="anim-fade-in inline-flex rounded-full bg-white/60 px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-white"
      >
        ← Volver a Mis mascotas
      </Link>

      <p
        style={{ animationDelay: "60ms" }}
        className="anim-fade-up eyebrow mt-8 text-ink/70"
      >
        Patitas Felices
      </p>
      <h1
        style={{ animationDelay: "120ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        {record ? `Editar a ${record.pet.name}` : "Agregar mascota"}
      </h1>
      <p
        style={{ animationDelay: "200ms" }}
        className="anim-fade-up mt-3 max-w-2xl text-base leading-7 text-ink/70"
      >
        {editing
          ? "Corrige los datos o las fotos. Los cambios se ven en tu panel y en la app."
          : "Llena todos los datos. Al guardarla queda como Disponible y los adoptantes la ven en la app."}
      </p>

      {record && record.pet.status !== "disponible" && (
        <p role="note" className="anim-fade-up mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold">
          {STATUS_NOTE[record.pet.status]}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 1. Datos de la mascota */}
        <section aria-labelledby="datos-titulo" className={cardClass}>
          <div id="datos-titulo">
            <SectionTitle number={1}>Datos de la mascota</SectionTitle>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                id="name"
                label="Nombre"
                autoComplete="off"
                placeholder="Por ejemplo, Max"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <SelectField
              id="species"
              label="Especie"
              options={SPECIES}
              error={errors.species?.message}
              {...register("species")}
            />
            <SelectField
              id="size"
              label="Tamaño"
              options={SIZES}
              error={errors.size?.message}
              {...register("size")}
            />
            <TextField
              id="ageYears"
              type="number"
              inputMode="numeric"
              min={0}
              max={30}
              step={1}
              label="Edad: años"
              error={errors.ageYears?.message}
              {...register("ageYears")}
            />
            <TextField
              id="ageMonths"
              type="number"
              inputMode="numeric"
              min={0}
              max={11}
              step={1}
              label="Edad: meses"
              hint="De 0 a 11. Si es menor de un año, deja los años en 0."
              error={errors.ageMonths?.message}
              {...register("ageMonths")}
            />
            <SelectField
              id="sex"
              label="Sexo"
              options={SEXES}
              error={errors.sex?.message}
              {...register("sex")}
            />
            <SelectField
              id="activity"
              label="Nivel de actividad"
              options={ACTIVITIES}
              error={errors.activity?.message}
              {...register("activity")}
            />
          </div>
        </section>

        {/* 2. Requisitos de adopción (RF-24) */}
        <section aria-labelledby="requisitos-titulo" style={{ animationDelay: "80ms" }} className={cardClass}>
          <div id="requisitos-titulo">
            <SectionTitle number={2}>Requisitos de adopción</SectionTitle>
          </div>
          <p className="mt-3 max-w-2xl leading-7 text-ink/70">
            La app le muestra esta mascota a los adoptantes que cumplen al menos {MIN_CRITERIA} de estos 6
            requisitos. Los seis son obligatorios: sin ellos la mascota no queda disponible.
          </p>

          <div className="mt-6 space-y-6">
            <Controller
              control={control}
              name="minSpace"
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label="Espacio mínimo en el hogar"
                  options={SPACE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="max-w-xs">
              <TextField
                id="minHours"
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                step={1}
                label="Tiempo mínimo en casa (horas al día)"
                hint="Horas que alguien debe estar con la mascota, de 0 a 24."
                error={errors.minHours?.message}
                {...register("minHours")}
              />
            </div>

            <Controller
              control={control}
              name="experience"
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label="Experiencia previa con mascotas"
                  options={EXPERIENCE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="commitment"
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label="Compromiso que exige"
                  hint="Grado de cuidado: rutinas, entrenamiento y atención médica."
                  options={COMMITMENT_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="childrenOk"
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label="¿Es compatible con niños?"
                  options={YES_NO}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="petsOk"
              render={({ field, fieldState }) => (
                <ChoiceGroup
                  label="¿Es compatible con otras mascotas?"
                  options={YES_NO}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </section>

        {/* 3. Descripción y fotos */}
        <section aria-labelledby="fotos-titulo" style={{ animationDelay: "160ms" }} className={cardClass}>
          <div id="fotos-titulo">
            <SectionTitle number={3}>Descripción y fotos</SectionTitle>
          </div>
          <div className="mt-6 space-y-6">
            <TextAreaField
              id="description"
              label="Descripción"
              placeholder="Cuenta cómo es su carácter, su historia y qué cuidados necesita."
              hint="Es lo primero que lee quien quiere adoptarla. Máximo 1000 caracteres."
              error={errors.description?.message}
              {...register("description")}
            />

            <Controller
              control={control}
              name="photos"
              render={({ field, fieldState }) => (
                <PetPhotoPicker
                  id="photos"
                  items={field.value}
                  onChange={(items) => {
                    field.onChange(items);
                    void trigger("photos");
                  }}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </section>

        {submitCount > 0 && errorCount > 0 && (
          <p role="alert" className="anim-error mt-8 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-background">
            {errorCount === 1
              ? "Falta 1 dato por corregir. Revisa el campo marcado."
              : `Faltan ${errorCount} datos por corregir. Revisa los campos marcados.`}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
          <button type="submit" className={`${primaryButtonClass} sm:max-w-xs`}>
            {editing ? "Guardar cambios" : "Guardar mascota"}
          </button>
          <Link to="/refugio/mascotas" className={`${secondaryButtonClass} sm:max-w-[12rem]`}>
            Cancelar
          </Link>
        </div>
      </form>
    </ShelterAdminLayout>
  );
}

export default function PetFormPage() {
  const { id } = useParams<{ id: string }>();

  // Si la dirección trae un id que no existe (por ejemplo, tras recargar la página), se avisa en vez de
  // mostrar un formulario vacío que parecería nuevo.
  if (id && !getPetRecord(id)) {
    return (
      <ShelterAdminLayout>
        <section className="anim-fade-up rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft backdrop-blur">
          <h1 className="font-heading text-3xl font-bold">No encontramos esta mascota</h1>
          <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
            Puede que ya no exista o que la dirección esté incompleta. Vuelve a tu lista y elige otra.
          </p>
          <Link
            to="/refugio/mascotas"
            className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85"
          >
            Volver a Mis mascotas
          </Link>
        </section>
      </ShelterAdminLayout>
    );
  }

  // "key" reinicia el formulario si se pasa de editar una mascota a agregar otra.
  return <PetForm key={id ?? "nueva"} petId={id ?? null} />;
}