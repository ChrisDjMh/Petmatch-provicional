import { Link, useNavigate } from "react-router-dom";

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

/* Barra superior de las pantallas con sesión iniciada del panel web (incluye cerrar sesión, RF-06). */
export default function PanelHeader({ userLabel }: { userLabel?: string }) {
  const navigate = useNavigate();

  function logout() {
    // Aquí se cerrará la sesión con el backend (RF-06).
    // "replace" evita que el botón "atrás" regrese a esta pantalla.
    navigate("/login", { replace: true });
  }

  return (
    <header className="anim-fade-in flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link to="/" className="flex items-center gap-2.5" aria-label="PetMatch, inicio">
        <PawMark />
        <span className="font-heading text-2xl font-bold">PetMatch</span>
      </Link>
      <div className="flex items-center gap-4">
        {userLabel && (
          <span className="hidden text-sm font-bold text-ink/70 sm:block">{userLabel}</span>
        )}
        <button
          type="button"
          onClick={logout}
          className="rounded-full bg-white/60 px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-white"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}