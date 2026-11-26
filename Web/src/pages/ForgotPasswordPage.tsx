import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import StatusMessage from "@/components/auth/StatusMessage";
import { inputClass, linkClass, primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";

const forgotSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe tu correo electrónico.")
    .email("Escribe un correo válido, por ejemplo nombre@correo.com."),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  // Solo frontend: guarda el correo escrito para mostrar la pantalla de "revisa tu correo".
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotValues) {
    // Aquí se pedirá el enlace de recuperación al backend (RF-05).
    // El mensaje de abajo es el mismo exista o no la cuenta.
    setSentTo(values.email);
  }

  return (
    <AuthLayout backTo="/login" backLabel="← Volver a iniciar sesión">
      {sentTo ? (
        <StatusMessage
          icon={
            <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 8 8 6 8-6" />
            </svg>
          }
          title="Revisa tu correo"
          actions={
            <>
              <Link to="/login" className={primaryButtonClass}>
                Volver a iniciar sesión
              </Link>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSentTo(null);
                }}
                className={secondaryButtonClass}
              >
                Usar otro correo
              </button>
            </>
          }
        >
          <p>
            Si existe una cuenta confirmada con <strong className="break-all">{sentTo}</strong>,
            te enviamos un enlace para crear una nueva contraseña.
          </p>
          <p className="text-sm text-ink/70">
            El enlace es de un solo uso y vence en 1 hora. Si no lo ves, revisa tu carpeta de
            correo no deseado.
          </p>
        </StatusMessage>
      ) : (
        <div>
          <p className="anim-fade-up eyebrow text-ink/70" style={{ animationDelay: "100ms" }}>
            Recuperar acceso
          </p>
          <h1
            style={{ animationDelay: "180ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            ¿Olvidaste tu contraseña?
          </h1>
          <p
            style={{ animationDelay: "260ms" }}
            className="anim-fade-up mt-3 text-base leading-7 text-ink/70"
          >
            Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva
            contraseña.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <div style={{ animationDelay: "350ms" }} className="anim-fade-up">
              <label htmlFor="email" className="mb-2 block text-sm font-extrabold">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`${inputClass} ${errors.email ? "border-ink" : "border-transparent"}`}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="anim-error mt-2 text-sm font-bold">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{ animationDelay: "440ms" }}
              className={`anim-fade-up ${primaryButtonClass}`}
            >
              Enviar enlace
            </button>
          </form>

          <p
            style={{ animationDelay: "520ms" }}
            className="anim-fade-up mt-8 border-t border-ink/20 pt-6 text-sm leading-6 text-ink/80"
          >
            ¿Ya la recordaste?{" "}
            <Link to="/login" className={linkClass}>
              Inicia sesión
            </Link>
            .
          </p>
        </div>
      )}
    </AuthLayout>
  );
}