import type { ReactNode } from "react";

type StatusMessageProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  actions: ReactNode;
};

/* Mensaje de resultado (correo enviado, contraseña actualizada, enlace vencido...). */
export default function StatusMessage({ icon, title, children, actions }: StatusMessageProps) {
  return (
    <div role="status">
      <div className="anim-fade-up flex size-16 items-center justify-center rounded-full bg-white text-ink shadow-soft">
        {icon}
      </div>
      <h1
        style={{ animationDelay: "100ms" }}
        className="anim-fade-up mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        {title}
      </h1>
      <div
        style={{ animationDelay: "200ms" }}
        className="anim-fade-up mt-3 space-y-3 text-base leading-7 text-ink/75"
      >
        {children}
      </div>
      <div style={{ animationDelay: "320ms" }} className="anim-fade-up mt-8 flex flex-col gap-3">
        {actions}
      </div>
    </div>
  );
}