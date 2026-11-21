import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import StatusMessage from "@/components/auth/StatusMessage";
import { TextField } from "@/components/auth/TextField";
import { linkClass, primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";

const resendSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe tu correo electrónico.")
    .email("Escribe un correo válido, por ejemplo nombre@correo.com."),
});

type ResendValues = z.infer<typeof resendSchema>;

const iconProps = {
  viewBox: "0 0 24 24",
  className: "size-8",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/*
  Se abre desde el enlace del correo de confirmación (RF-02).
  Para revisar cada pantalla entra a:
    /confirmar-correo                  → correo confirmado
    /confirmar-correo?estado=vencido   → el enlace pasó de 1 hora
    /confirmar-correo?estado=usado     → el enlace ya se usó
  Cuando haya backend, él decidirá cuál mostrar según el enlace recibido.
*/
type LinkState = "confirmado" | "vencido" | "usado";

function readState(value: string | null): LinkState {
  return value === "vencido" || value === "usado" ? value : "confirmado";
}

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const state = readState(params.get("estado"));

  // Solo frontend: guarda el correo escrito para mostrar la pantalla de "enlace reenviado".
  const [resentTo, setResentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ResendValues) {
    // Aquí se pedirá al backend un nuevo enlace de confirmación (RF-02).
    // Con backend, el mensaje no debe revelar si el correo existe o ya estaba confirmado.
    setResentTo(values.email);
  }

  if (resentTo) {
    return (
      <AuthLayout backTo="/login" backLabel="← Volver a iniciar sesión">
        <StatusMessage
          icon={
            <svg {...iconProps}>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 8 8 6 8-6" />
            </svg>
          }
          title="Te enviamos un nuevo enlace"
          actions={
            <>
              <Link to="/login" className={primaryButtonClass}>
                Ir a iniciar sesión
              </Link>
              <button type="button" onClick={() => setResentTo(null)} className={secondaryButtonClass}>
                Usar otro correo
              </button>
            </>
          }
        >
          <p>
            Si <strong className="break-all">{resentTo}</strong> tiene una cuenta pendiente de
            confirmar, recibirás un correo con un enlace nuevo.
          </p>
          <p>El enlace es de un solo uso y vence en 1 hora. Revisa también tu carpeta de spam.</p>
        </StatusMessage>
      </AuthLayout>
    );
  }

  if (state === "confirmado") {
    return (
      <AuthLayout backTo="/" backLabel="← Volver al inicio">
        <StatusMessage
          icon={
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12.5 2.8 2.8L16.5 9.5" />
            </svg>
          }
          title="Correo confirmado"
          actions={
            <>
              <Link to="/login" className={primaryButtonClass}>
                Iniciar sesión
              </Link>
              <Link to="/" className={secondaryButtonClass}>
                Volver al inicio
              </Link>
            </>
          }
        >
          <p>Tu cuenta ya está confirmada y puedes iniciar sesión con tu correo y contraseña.</p>
          <p>
            Si registraste un refugio, al entrar verás el estado de tu solicitud mientras el equipo
            de PetMatch la revisa.
          </p>
        </StatusMessage>
      </AuthLayout>
    );
  }

  const expired = state === "vencido";

  return (
    <AuthLayout backTo="/login" backLabel="← Volver a iniciar sesión">
      <div>
        <div className="anim-fade-up flex size-16 items-center justify-center rounded-full bg-white text-ink shadow-soft">
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <h1
          style={{ animationDelay: "100ms" }}
          className="anim-fade-up mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          {expired ? "Este enlace venció" : "Este enlace ya se usó"}
        </h1>
        <p
          style={{ animationDelay: "200ms" }}
          className="anim-fade-up mt-3 text-base leading-7 text-ink/75"
        >
          {expired
            ? "Los enlaces de confirmación duran 1 hora y este ya pasó de ese tiempo. Pide uno nuevo y te lo mandamos de inmediato."
            : "Cada enlace de confirmación solo se puede usar una vez. Si todavía no puedes iniciar sesión, pide uno nuevo."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <div style={{ animationDelay: "300ms" }} className="anim-fade-up">
            <TextField
              id="email"
              type="email"
              label="Correo electrónico"
              autoComplete="email"
              placeholder="nombre@correo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <button
            type="submit"
            style={{ animationDelay: "380ms" }}
            className={`anim-fade-up ${primaryButtonClass}`}
          >
            Reenviar enlace de confirmación
          </button>
        </form>

        <p
          style={{ animationDelay: "460ms" }}
          className="anim-fade-up mt-8 border-t border-ink/20 pt-6 text-sm leading-6 text-ink/80"
        >
          ¿Ya confirmaste tu correo?{" "}
          <Link to="/login" className={linkClass}>
            Inicia sesión
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}