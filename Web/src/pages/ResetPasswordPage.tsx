import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import StatusMessage from "@/components/auth/StatusMessage";
import { primaryButtonClass, linkClass, secondaryButtonClass } from "@/components/auth/styles";

const resetSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirm: z.string().min(1, "Repite tu nueva contraseña."),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden. Escribe la misma en los dos campos.",
  });

type ResetValues = z.infer<typeof resetSchema>;

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
  Se abre desde el enlace del correo (RF-05).
  Para ver la pantalla de "enlace vencido o ya usado" entra a /nueva-contrasena?estado=vencido.
  Cuando haya backend, el enlace inválido mostrará esa misma pantalla.
*/
export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const linkInvalid = params.get("estado") === "vencido";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirm: "" },
  });

  function onSubmit(values: ResetValues) {
    // Aquí se guardará la nueva contraseña con el backend; el enlace queda usado (RN-08).
    void values;
    setDone(true);
  }

  return (
    <AuthLayout backTo="/login" backLabel="← Volver a iniciar sesión">
      {linkInvalid ? (
        <StatusMessage
          icon={
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
          title="Este enlace ya no es válido"
          actions={
            <>
              <Link to="/olvide-contrasena" className={primaryButtonClass}>
                Pedir un nuevo enlace
              </Link>
              <Link to="/login" className={secondaryButtonClass}>
                Volver a iniciar sesión
              </Link>
            </>
          }
        >
          <p>
            Los enlaces de recuperación se pueden usar una sola vez y vencen después de 1 hora.
            Pide uno nuevo para continuar.
          </p>
        </StatusMessage>
      ) : done ? (
        <StatusMessage
          icon={
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12.5 2.8 2.8L16.5 9.5" />
            </svg>
          }
          title="Contraseña actualizada"
          actions={
            <Link to="/login" className={primaryButtonClass}>
              Iniciar sesión
            </Link>
          }
        >
          <p>Ya puedes entrar con tu nueva contraseña. La anterior dejó de funcionar.</p>
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
            Crea tu nueva contraseña
          </h1>
          <p
            style={{ animationDelay: "260ms" }}
            className="anim-fade-up mt-3 text-base leading-7 text-ink/70"
          >
            Elige una contraseña que no hayas usado antes. Úsala para iniciar sesión desde ahora.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <div style={{ animationDelay: "350ms" }} className="anim-fade-up">
              <PasswordField
                id="password"
                label="Nueva contraseña"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                hint="Mínimo 8 caracteres."
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div style={{ animationDelay: "430ms" }} className="anim-fade-up">
              <PasswordField
                id="confirm"
                label="Repite la contraseña"
                autoComplete="new-password"
                placeholder="Escríbela otra vez"
                error={errors.confirm?.message}
                {...register("confirm")}
              />
            </div>

            <button
              type="submit"
              style={{ animationDelay: "510ms" }}
              className={`anim-fade-up ${primaryButtonClass}`}
            >
              Guardar contraseña
            </button>
          </form>

          <p
            style={{ animationDelay: "590ms" }}
            className="anim-fade-up mt-8 border-t border-ink/20 pt-6 text-sm leading-6 text-ink/80"
          >
            Este enlace es de un solo uso y vence 1 hora después de haberlo pedido. ¿Venció?{" "}
            <Link to="/olvide-contrasena" className={linkClass}>
              Pide uno nuevo
            </Link>
            .
          </p>
        </div>
      )}
    </AuthLayout>
  );
}