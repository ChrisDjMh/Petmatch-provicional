import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import StatusMessage from "@/components/auth/StatusMessage";
import { TextAreaField, TextField } from "@/components/auth/TextField";
import { linkClass, primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";
import FileDropzone from "@/components/registro/FileDropzone";


const REGISTER_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkoO6NyPXIfylfVT-dNUHcQ4zig2iG5g9wmtx9M7ujR03ZqgpOvgq30qI&s=10";


const MAX_BYTES = 5 * 1024 * 1024; 
const MIN_PHOTOS = 3;
const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const PHOTO_TYPES = ["image/jpeg", "image/png"];

function fileProblem(file: File, allowed: string[], formats: string): string | null {
  if (!allowed.includes(file.type)) {
    return `«${file.name}» no tiene un formato válido. Sube un archivo ${formats}.`;
  }
  if (file.size > MAX_BYTES) {
    return `«${file.name}» pesa más de 5 MB. Sube una versión más ligera.`;
  }
  return null;
}

const docFile = (requiredMessage: string) =>
  z
    .custom<File>((value) => value instanceof File, requiredMessage)
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) return;
      const problem = fileProblem(file, DOC_TYPES, "PDF, JPG o PNG");
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    });

const emailField = (requiredMessage: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .email("Escribe un correo válido, por ejemplo nombre@correo.com.");

/* ---------- Validación del formulario (RF-08, RF-09, RNF-15, RNF-19) ---------- */
const registerSchema = z.object({
  shelterName: z.string().trim().min(1, "Escribe el nombre del refugio."),
  responsibleName: z.string().trim().min(1, "Escribe el nombre del responsable."),
  contactEmail: emailField("Escribe el correo de contacto del refugio."),
  phone: z
    .string()
    .trim()
    .min(1, "Escribe un teléfono de contacto.")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return /^[\d\s()+-]+$/.test(value) && digits.length >= 10 && digits.length <= 13;
      },
      "Escribe un teléfono válido de 10 dígitos, por ejemplo 55 1234 5678.",
    ),
  city: z.string().trim().min(1, "Escribe la ciudad del refugio."),
  address: z.string().trim().min(1, "Escribe la dirección del refugio."),
  description: z.string().trim().min(1, "Escribe una descripción breve del refugio."),
  accessEmail: emailField("Escribe el correo con el que iniciarás sesión."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  identification: docFile("Adjunta la identificación oficial del responsable."),
  addressProof: docFile("Adjunta el comprobante de domicilio del refugio."),
  existenceProof: docFile("Adjunta un documento que respalde la existencia del refugio."),
  photos: z.array(z.custom<File>((value) => value instanceof File)).superRefine((files, ctx) => {
    if (files.length < MIN_PHOTOS) {
      ctx.addIssue({
        code: "custom",
        message: `Sube al menos ${MIN_PHOTOS} fotos del refugio (llevas ${files.length}).`,
      });
      return;
    }
    for (const file of files) {
      const problem = fileProblem(file, PHOTO_TYPES, "JPG o PNG");
      if (problem) {
        ctx.addIssue({ code: "custom", message: problem });
        return;
      }
    }
  }),
  privacy: z.boolean().refine((value) => value, "Debes aceptar el aviso de privacidad para continuar."),
});

type RegisterValues = z.infer<typeof registerSchema>;
type DocName = "identification" | "addressProof" | "existenceProof";

const DOC_ACCEPT = ".pdf,.jpg,.jpeg,.png";
const PHOTO_ACCEPT = ".jpg,.jpeg,.png";

function SectionTitle({ id, number, children }: { id: string; number: number; children: string }) {
  return (
    <h2 id={id} className="flex items-center gap-3 font-heading text-2xl font-bold">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-background">
        {number}
      </span>
      {children}
    </h2>
  );
}

export default function RegisterShelterPage() {
  // Solo frontend: guarda el correo de acceso para mostrar la pantalla de "solicitud enviada".
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      shelterName: "",
      responsibleName: "",
      contactEmail: "",
      phone: "",
      city: "",
      address: "",
      description: "",
      accessEmail: "",
      password: "",
      photos: [],
      privacy: false,
    },
  });

  function onSubmit(values: RegisterValues) {
    // Aquí se enviará la solicitud al backend. Queda en "Correo por confirmar" (RF-10)
    // y pasa a "Pendiente de verificación" cuando el representante confirma su correo (RF-02).
    setSentTo(values.accessEmail);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderDoc(name: DocName, label: string, hint: string) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FileDropzone
            id={name}
            label={label}
            hint={hint}
            accept={DOC_ACCEPT}
            files={field.value ? [field.value] : []}
            onChange={(files) => {
              field.onChange(files[0]);
              void trigger(name);
            }}
            onBlur={field.onBlur}
            inputRef={field.ref}
            error={fieldState.error?.message}
            isInvalid={(file) => fileProblem(file, DOC_TYPES, "PDF, JPG o PNG") !== null}
          />
        )}
      />
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <AuthLayout width="2xl" imageUrl={REGISTER_IMAGE_URL}>
      {sentTo ? (
        <StatusMessage
          icon={
            <svg
              viewBox="0 0 24 24"
              className="size-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 8 8 6 8-6" />
            </svg>
          }
          title="Confirma tu correo"
          actions={
            <>
              <Link to="/login" className={primaryButtonClass}>
                Ir a iniciar sesión
              </Link>
              <Link to="/" className={secondaryButtonClass}>
                Volver al inicio
              </Link>
            </>
          }
        >
          <p>
            Recibimos tu solicitud. Te enviamos un enlace a{" "}
            <strong className="break-all">{sentTo}</strong> para confirmar tu correo.
          </p>
          <p>
            Tu solicitud llegará al equipo de PetMatch hasta que confirmes tu correo. El enlace es
            de un solo uso y vence en 1 hora. Después podrás iniciar sesión para ver el estado de
            tu solicitud.
          </p>
        </StatusMessage>
      ) : (
        <div>
          <p className="anim-fade-up eyebrow text-ink/70" style={{ animationDelay: "100ms" }}>
            Registro de refugios
          </p>
          <h1
            style={{ animationDelay: "180ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Registra tu refugio en PetMatch
          </h1>
          <p
            style={{ animationDelay: "260ms" }}
            className="anim-fade-up mt-3 text-base leading-7 text-ink/70"
          >
            Llena el formulario y adjunta tus documentos. Revisaremos tu solicitud antes de activar
            tu refugio. Todos los campos son obligatorios.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 space-y-12">
            {/* 1. Datos del refugio */}
            <section
              aria-labelledby="sec-refugio"
              style={{ animationDelay: "340ms" }}
              className="anim-fade-up space-y-5"
            >
              <SectionTitle id="sec-refugio" number={1}>
                Datos del refugio
              </SectionTitle>
              <TextField
                id="shelterName"
                label="Nombre del refugio"
                autoComplete="organization"
                placeholder="Ej. Huellitas del Norte"
                error={errors.shelterName?.message}
                {...register("shelterName")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="contactEmail"
                  type="email"
                  label="Correo de contacto del refugio"
                  autoComplete="off"
                  placeholder="contacto@refugio.com"
                  error={errors.contactEmail?.message}
                  {...register("contactEmail")}
                />
                <TextField
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  label="Teléfono"
                  autoComplete="tel"
                  placeholder="55 1234 5678"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="city"
                  label="Ciudad"
                  autoComplete="address-level2"
                  placeholder="Ej. Hermosillo"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <TextField
                  id="address"
                  label="Dirección"
                  autoComplete="street-address"
                  placeholder="Calle, número y colonia"
                  error={errors.address?.message}
                  {...register("address")}
                />
              </div>
              <TextAreaField
                id="description"
                label="Descripción del refugio"
                rows={4}
                placeholder="Cuéntanos quiénes son, cuántos animales cuidan y cómo trabajan."
                error={errors.description?.message}
                {...register("description")}
              />
            </section>

            {/* 2. Responsable y acceso */}
            <section
              aria-labelledby="sec-responsable"
              style={{ animationDelay: "420ms" }}
              className="anim-fade-up space-y-5"
            >
              <SectionTitle id="sec-responsable" number={2}>
                Responsable y acceso
              </SectionTitle>
              <TextField
                id="responsibleName"
                label="Nombre del responsable"
                autoComplete="name"
                placeholder="Nombre y apellidos"
                error={errors.responsibleName?.message}
                {...register("responsibleName")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="accessEmail"
                  type="email"
                  label="Correo para iniciar sesión"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  hint="A este correo te enviaremos el enlace de confirmación."
                  error={errors.accessEmail?.message}
                  {...register("accessEmail")}
                />
                <PasswordField
                  id="password"
                  label="Contraseña"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  hint="Mínimo 8 caracteres."
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>
            </section>

            {/* 3. Documentos */}
            <section
              aria-labelledby="sec-documentos"
              style={{ animationDelay: "500ms" }}
              className="anim-fade-up space-y-5"
            >
              <SectionTitle id="sec-documentos" number={3}>
                Documentos
              </SectionTitle>
              <p className="text-sm leading-6 text-ink/70">
                PDF, JPG o PNG, de máximo 5 MB cada uno.
              </p>
              {renderDoc(
                "identification",
                "Identificación oficial del responsable",
                "PDF, JPG o PNG · máximo 5 MB",
              )}
              {renderDoc(
                "addressProof",
                "Comprobante de domicilio del refugio",
                "PDF, JPG o PNG · máximo 5 MB",
              )}
              {renderDoc(
                "existenceProof",
                "Documento que respalde la existencia del refugio",
                "Acta, constancia o carta de tu organización · máximo 5 MB",
              )}
            </section>

            {/* 4. Fotos */}
            <section
              aria-labelledby="sec-fotos"
              style={{ animationDelay: "580ms" }}
              className="anim-fade-up space-y-5"
            >
              <SectionTitle id="sec-fotos" number={4}>
                Fotos del refugio
              </SectionTitle>
              <Controller
                control={control}
                name="photos"
                render={({ field, fieldState }) => (
                  <FileDropzone
                    id="photos"
                    label="Muestra tus instalaciones y a tus animales"
                    hint={`Mínimo ${MIN_PHOTOS} fotos · JPG o PNG · máximo 5 MB cada una`}
                    accept={PHOTO_ACCEPT}
                    multiple
                    files={field.value}
                    onChange={(files) => {
                      field.onChange(files);
                      void trigger("photos");
                    }}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    error={fieldState.error?.message}
                    status={`Llevas ${field.value.length} de ${MIN_PHOTOS} fotos mínimas.`}
                    isInvalid={(file) => fileProblem(file, PHOTO_TYPES, "JPG o PNG") !== null}
                  />
                )}
              />
            </section>

            {/* Aviso de privacidad y envío */}
            <div
              style={{ animationDelay: "660ms" }}
              className="anim-fade-up space-y-5"
            >
              <div>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white/60 p-4 text-sm leading-6">
                  <input
                    type="checkbox"
                    aria-invalid={errors.privacy ? true : undefined}
                    aria-describedby={errors.privacy ? "privacy-error" : undefined}
                    className="mt-1 size-5 shrink-0 accent-ink"
                    {...register("privacy")}
                  />
                  <span>
                    He leído y acepto el{" "}
                    <a
                      href="/aviso-de-privacidad"
                      target="_blank"
                      rel="noreferrer"
                      className={linkClass}
                    >
                      aviso de privacidad
                    </a>
                    .
                  </span>
                </label>
                {errors.privacy && (
                  <p id="privacy-error" className="anim-error mt-2 text-sm font-bold">
                    ⚠ {errors.privacy.message}
                  </p>
                )}
              </div>

              <p className="text-sm leading-6 text-ink/70">
                Hasta que tu refugio sea aprobado no podrás publicar mascotas, recibir solicitudes
                de adopción ni donaciones.
              </p>

              {submitCount > 0 && hasErrors && (
                <p role="alert" className="anim-error rounded-2xl bg-white p-4 text-sm font-bold">
                  ⚠ Faltan datos o hay archivos con problemas. Revisa los campos marcados y vuelve
                  a enviar.
                </p>
              )}

              <button type="submit" className={primaryButtonClass}>
                Enviar solicitud
              </button>

              <p className="border-t border-ink/20 pt-6 text-sm leading-6 text-ink/80">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className={linkClass}>
                  Inicia sesión
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      )}
    </AuthLayout>
  );
}