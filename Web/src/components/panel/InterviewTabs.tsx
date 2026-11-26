import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/refugio/entrevistas", label: "Agendar entrevistas", end: true },
  { to: "/refugio/entrevistas/agenda", label: "Mi agenda", end: false },
];

/* Cambia entre las dos vistas de la sección Entrevistas: agendar nuevas y la agenda del refugio. */
export default function InterviewTabs() {
  return (
    <nav aria-label="Vistas de entrevistas" className="mt-8 flex flex-wrap gap-2">
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