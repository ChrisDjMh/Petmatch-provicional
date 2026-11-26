import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { OctagonNavItem } from "@/components/panel/OctagonNav";
import PanelLayout from "@/components/panel/PanelLayout";

/* Secciones del panel del Super Admin. Cada una agrupa varias pantallas, que se cambian con las pestañas de
   arriba. "also" son las demás rutas de la sección (para marcar el triángulo activo). Una sección sin
   pantalla se marca con "soon". */
const NAV_ITEMS: OctagonNavItem[] = [
  { label: "Inicio", to: "/admin/inicio" },
  { label: "Refugios", to: "/admin/solicitudes", also: ["/admin/refugios"] },
  { label: "Usuarios", to: "/admin/usuarios", soon: true },
  { label: "Operación", to: "/admin/donaciones", also: ["/admin/entrevistas"] },
  { label: "Contenido", to: "/admin/categorias" },
  { label: "Bitácora", to: "/admin/bitacora" },
];

type Tab = { to: string; label: string };

/* Pestañas de cada sección. Una sección con una sola pantalla no muestra pestañas. */
const TAB_GROUPS: Tab[][] = [
  [
    { to: "/admin/solicitudes", label: "Solicitudes pendientes" },
    { to: "/admin/refugios", label: "Refugios activos" },
  ],
  [
    { to: "/admin/donaciones", label: "Donaciones" },
    { to: "/admin/entrevistas", label: "Entrevistas" },
  ],
];

function SectionTabs() {
  const { pathname } = useLocation();
  const group = TAB_GROUPS.find((tabs) => tabs.some((t) => pathname === t.to || pathname.startsWith(`${t.to}/`)));
  if (!group) return null;

  return (
    <nav aria-label="Pantallas de esta sección" className="mb-8 flex flex-wrap gap-2">
      {group.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
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

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <PanelLayout userLabel="Super Admin" items={NAV_ITEMS}>
      <SectionTabs />
      {children}
    </PanelLayout>
  );
}