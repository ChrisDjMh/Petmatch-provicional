import { Link } from "react-router-dom";
import LoginForm from "@/components/login/LoginForm";

// Cambia esta URL por la imagen que quieras mostrar en el login.
const LOGIN_IMAGE_URL =
  "https://tica.org/wp-content/uploads/2024/04/kitty-puppy-scaled.jpg";

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

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-background text-ink lg:grid-cols-2">
      {/* Mitad izquierda: imagen (cambia la URL en LOGIN_IMAGE_URL) */}
      <aside className="relative hidden lg:block">
        <img
          src={LOGIN_IMAGE_URL}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      </aside>

      {/* Mitad derecha: formulario sobre degradado */}
      <div className="flex min-h-screen flex-col bg-linear-to-br from-cards to-cards-2">
        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Link to="/" className="flex items-center gap-2.5" aria-label="PetMatch, inicio">
            <PawMark />
            <span className="font-heading text-2xl font-bold">PetMatch</span>
          </Link>
          <Link
            to="/"
            className="rounded-full bg-white/60 px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-white"
          >
            ← Volver al inicio
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 sm:px-10">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}