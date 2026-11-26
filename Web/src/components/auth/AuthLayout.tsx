import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// Imagen por defecto de la mitad izquierda. Cada página puede usar otra con la prop imageUrl.
export const AUTH_IMAGE_URL =
  "https://wildearth.com/cdn/shop/articles/sad-dog-new-size.png?v=1740658796";

function PawMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-ink text-background">
      <svg viewBox="0 0 32 32" className="size-5" fill="currentColor" aria-hidden="true">
        <ellipse cx="16" cy="20" rx="7" ry="6" />
        <ellipse cx="7.5" cy="14" rx="3" ry="4" transform="rotate(-25 7.5 14)" />
        <ellipse cx="24.5" cy="14" rx="3" ry="4" transform="rotate(25 24.5 14)" />
        <ellipse cx="12" cy="8" rx="2.8" ry="3.5" transform="rotate(-8 12 8)" />
        <ellipse cx="20" cy="8" rx="2.8" ry="3.5" transform="rotate(8 20 8)" />
      </svg>
    </span>
  );
}

type AuthLayoutProps = {
  children: ReactNode;
  /** A dónde lleva el botón de arriba a la derecha. */
  backTo?: string;
  backLabel?: string;
  /** "md" para formularios cortos (login), "2xl" para formularios largos (registro). */
  width?: "md" | "2xl";
  /** Imagen de la mitad izquierda. Si no se pasa, usa AUTH_IMAGE_URL. */
  imageUrl?: string;
};

/* Pantalla dividida: imagen a la izquierda (fija al hacer scroll), contenido sobre degradado a la derecha. */
export default function AuthLayout({
  children,
  backTo = "/",
  backLabel = "← Volver al inicio",
  width = "md",
  imageUrl = AUTH_IMAGE_URL,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-background text-ink lg:grid-cols-2">
      <aside className="anim-fade-in relative hidden lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="anim-zoom-out absolute inset-0 size-full object-cover"
          />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-linear-to-br from-cards to-cards-2">
        <header className="anim-fade-in flex items-center justify-between px-6 py-6 sm:px-10">
          <Link to="/" className="flex items-center gap-2.5" aria-label="PetMatch, inicio">
            <PawMark />
            <span className="font-heading text-2xl font-bold">PetMatch</span>
          </Link>
          <Link
            to={backTo}
            className="rounded-full bg-white/60 px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-white"
          >
            {backLabel}
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-4 sm:px-10 lg:items-center">
          <div className={`w-full ${width === "2xl" ? "max-w-2xl" : "max-w-md"}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}