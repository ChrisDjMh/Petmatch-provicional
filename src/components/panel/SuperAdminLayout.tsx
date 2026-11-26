import type { ReactNode } from "react";
import type { OctagonNavItem } from "@/components/panel/OctagonNav";
import PanelLayout from "@/components/panel/PanelLayout";

const NAV_ITEMS: OctagonNavItem[] = [
  { label: "Solicitudes pendientes", lines: ["Solicitudes", "pendientes"], to: "/admin/solicitudes" },
  { label: "Refugios activos", lines: ["Refugios", "activos"], to: "/admin/refugios" },
  { label: "Donaciones", to: "/admin/donaciones" },
  { label: "Bitácora", to: "/admin/bitacora" },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <PanelLayout userLabel="Super Admin" items={NAV_ITEMS}>
      {children}
    </PanelLayout>
  );
}