import { NavLink, useLocation } from "react-router-dom";

type Item = { label: string; to: string; active?: string[] };
const ITEMS: Item[] = [
  { label: "Inicio", to: "/refugio/inicio" },
  { label: "Mis mascotas", to: "/refugio/mascotas" },
  { label: "Adopciones", to: "/refugio/adopciones", active: ["/refugio/adopciones/seguimiento"] },
  { label: "Entregas", to: "/refugio/entregas" },
  { label: "Entrevistas", to: "/refugio/entrevistas" },
  { label: "Donaciones", to: "/refugio/donaciones" },
  { label: "Fotos", to: "/refugio/fotos" },
  { label: "Categorías", to: "/refugio/categorias" },
];

export default function ShelterTopNav() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Navegación del refugio" className="mx-4 mb-2 overflow-x-auto rounded-2xl bg-white/65 p-2 shadow-sm sm:mx-8 lg:mx-10">
      <ul className="flex w-full min-w-max items-center justify-center gap-1">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/refugio/adopciones"}
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center rounded-xl px-4 py-2 text-sm font-extrabold transition-colors ${
                  isActive || item.active?.some((path) => pathname.startsWith(path))
                    ? "bg-ink text-background"
                    : "text-ink/75 hover:bg-white hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
