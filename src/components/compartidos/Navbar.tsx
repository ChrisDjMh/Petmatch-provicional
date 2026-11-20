import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Registrar mi refugio", href: "/registro-refugio" },
];

function PawMark() {
  return (
    <span className="relative flex size-9 items-center justify-center rounded-full bg-cards text-background">
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`anim-slide-down fixed inset-x-0 top-0 z-50 border-b border-ink/10 backdrop-blur-lg transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-background/85 shadow-soft" : "bg-background/60"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="PetMatch, inicio">
          <PawMark />
          <span className="font-heading text-2xl font-bold text-ink">PetMatch</span>
        </Link>

        <div className="hidden items-center gap-8 rounded-full bg-cards-2/40 px-7 py-3 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-ink/75 transition-colors hover:text-cards"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link to="/login" className="button-primary hidden sm:inline-flex">
          Iniciar sesión
        </Link>

        <button
          className="flex size-11 items-center justify-center rounded-full bg-background text-ink shadow-soft lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label="Abrir menú"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="anim-fade-up mx-5 mb-5 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[2rem] bg-cards-2/40 p-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 font-bold hover:bg-cards-2/40"
              >
                {link.label}
              </a>
            ))}
            <Link to="/login" className="button-primary mt-2 justify-center sm:hidden">
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}