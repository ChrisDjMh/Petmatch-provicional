import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/refugio/adopciones", label: "Solicitudes", end: true },
  { to: "/refugio/adopciones/seguimiento", label: "Seguimiento", end: false },
];

/* Cambia entre las dos vistas de la sección Adopciones: las solicitudes y el seguimiento post-adopción. */
export default function AdoptionTabs() {
  return (
    <nav aria-label="Vistas de adopciones" className="mt-8 flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-full px-5 py-2 text-sm font-extrabold transition-colors ${
              isActive ? "bg-ink text-background" : "bg-white/60 hover:bg-white"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}