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
  "w-full border bg-background px-4 py-3.5 font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink/40 focus:border-ink focus:ring-2 focus:ring-accent";

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
      <p className="eyebrow">Panel web</p>
      <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Iniciar sesión
      </h2>
      <p className="mt-3 text-base leading-7 text-ink/70">
        Escribe tu correo y tu contraseña para entrar a tu panel.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <div>
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
            className={`${inputClass} ${errors.email ? "border-ink" : "border-ink/25"}`}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm font-bold">
              ⚠ {errors.email.message}
            </p>
          )}
        </div>

        <div>
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
              className={`${inputClass} pr-24 ${errors.password ? "border-ink" : "border-ink/25"}`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 px-4 text-sm font-extrabold text-ink/70 hover:text-ink"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm font-bold">
              ⚠ {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <Link
            to="/olvide-contrasena"
            className="text-sm font-extrabold text-ink underline underline-offset-4 hover:text-cards"
          >
            Olvidé mi contraseña
          </Link>
        </div>

        <button type="submit" className="button-primary flex w-full items-center justify-center">
          Iniciar sesión
        </button>
      </form>

      <p className="mt-8 border-t border-ink/15 pt-6 text-sm leading-6 text-ink/75">
        ¿Aún no tienes tu refugio en PetMatch?{" "}
        <Link
          to="/registro-refugio"
          className="font-extrabold text-ink underline underline-offset-4 hover:text-cards"
        >
          Regístralo aquí
        </Link>
        .
      </p>
    </div>
  );
}