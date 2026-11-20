import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe tu correo electrónico.")
    .email("Escribe un correo válido, por ejemplo nombre@correo.com."),
  password: z.string().min(1, "Escribe tu contraseña."),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-2xl border-2 bg-white px-5 py-3.5 font-semibold text-ink shadow-sm outline-none transition-colors placeholder:font-normal placeholder:text-ink/40 focus:border-ink";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    // Por ahora solo frontend: aquí se conectará el inicio de sesión más adelante.
    void values;
  }

  return (
    <div>
      <p style={{ animationDelay: "150ms" }} className="anim-fade-up eyebrow text-ink/70">Panel web</p>
      <h1 style={{ animationDelay: "230ms" }} className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Iniciar sesión
      </h1>
      <p style={{ animationDelay: "310ms" }} className="anim-fade-up mt-3 text-base leading-7 text-ink/70">
        Escribe tu correo y tu contraseña para entrar a tu panel.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <div style={{ animationDelay: "400ms" }} className="anim-fade-up">
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

        <div style={{ animationDelay: "480ms" }} className="anim-fade-up">
          <label htmlFor="password" className="mb-2 block text-sm font-extrabold">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputClass} pr-24 ${errors.password ? "border-ink" : "border-transparent"}`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 rounded-r-2xl px-5 text-sm font-extrabold text-ink/70 hover:text-ink"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="anim-error mt-2 text-sm font-bold">
              ⚠ {errors.password.message}
            </p>
          )}
        </div>

        <div style={{ animationDelay: "550ms" }} className="anim-fade-up text-right">
          <Link
            to="/olvide-contrasena"
            className="text-sm font-extrabold text-ink underline underline-offset-4 hover:text-ink/70"
          >
            Olvidé mi contraseña
          </Link>
        </div>

        <button
          type="submit"
          style={{ animationDelay: "620ms" }}
          className="anim-fade-up flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]"
        >
          Iniciar sesión
        </button>
      </form>

      <p style={{ animationDelay: "700ms" }} className="anim-fade-up mt-8 border-t border-ink/20 pt-6 text-sm leading-6 text-ink/80">
        ¿Aún no tienes tu refugio en PetMatch?{" "}
        <Link
          to="/registro-refugio"
          className="font-extrabold text-ink underline underline-offset-4 hover:text-ink/70"
        >
          Regístralo aquí
        </Link>
        .
      </p>
      <p style={{ animationDelay: "780ms" }} className="anim-fade-up mt-4 text-sm leading-6 text-ink/70">
        ¿Eres adoptante? Usa la app móvil de PetMatch para Android. Este panel web es solo para
        refugios y administradores.
      </p>
    </div>
  );
}