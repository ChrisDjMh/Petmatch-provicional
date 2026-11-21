import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { TextField } from "@/components/auth/TextField";
import { linkClass, primaryButtonClass } from "@/components/auth/styles";

// Cambia esta URL por la imagen de la mitad izquierda de este acceso.
const SUPERADMIN_IMAGE_URL =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1400&q=80";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe tu correo electrónico.")
    .email("Escribe un correo válido, por ejemplo nombre@correo.com."),
  password: z.string().min(1, "Escribe tu contraseña."),
});

type LoginValues = z.infer<typeof loginSchema>;

/*
  Acceso del Super Admin (RF-04). No tiene ningún enlace desde el sitio: se entra escribiendo
  /acceso-interno. Ocultar la dirección no protege nada por sí solo; lo que protege es que el
  backend verifique el rol (RF-07). Esta pantalla solo es la puerta de entrada.
*/
export default function SuperAdminLoginPage() {
  // Se llenará cuando haya backend. Un solo mensaje para cualquier fallo, sin revelar si el correo
  // existe ni si la cuenta tiene otro rol (RF-03).
  const [authError] = useState<string | null>(null);

  // Pide a los buscadores que no indexen esta página.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    // Aquí se conectará el inicio de sesión con el backend.
    // Si la cuenta no es Super Admin, el backend debe rechazarla con el mismo mensaje genérico.
    // Al entrar bien, se navega al panel del Super Admin con navigate(..., { replace: true }).
    void values;
  }

  return (
    <AuthLayout imageUrl={SUPERADMIN_IMAGE_URL} backTo="/" backLabel="← Volver al inicio">
      <div>
        <p
          style={{ animationDelay: "100ms" }}
          className="anim-fade-up inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-background"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="11" width="16" height="10" rx="2.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Acceso restringido
        </p>
        <h1
          style={{ animationDelay: "180ms" }}
          className="anim-fade-up mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Administración de PetMatch
        </h1>
        <p
          style={{ animationDelay: "260ms" }}
          className="anim-fade-up mt-3 text-base leading-7 text-ink/70"
        >
          Solo para el equipo que revisa solicitudes de refugios y supervisa las donaciones.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          {authError && (
            <p role="alert" className="anim-error rounded-2xl bg-white px-5 py-3.5 text-sm font-bold">
              ⚠ {authError}
            </p>
          )}

          <div style={{ animationDelay: "350ms" }} className="anim-fade-up">
            <TextField
              id="email"
              type="email"
              label="Correo electrónico"
              autoComplete="username"
              placeholder="nombre@correo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div style={{ animationDelay: "430ms" }} className="anim-fade-up">
            <PasswordField
              id="password"
              label="Contraseña"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div style={{ animationDelay: "500ms" }} className="anim-fade-up text-right">
            <Link to="/olvide-contrasena" className={`text-sm ${linkClass}`}>
              Olvidé mi contraseña
            </Link>
          </div>

          <button
            type="submit"
            style={{ animationDelay: "570ms" }}
            className={`anim-fade-up ${primaryButtonClass}`}
          >
            Entrar al panel
          </button>
        </form>

        <p
          style={{ animationDelay: "650ms" }}
          className="anim-fade-up mt-8 border-t border-ink/20 pt-6 text-sm leading-6 text-ink/75"
        >
          ¿Eres responsable de un refugio?{" "}
          <Link to="/login" className={linkClass}>
            Entra por el acceso de refugios
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}