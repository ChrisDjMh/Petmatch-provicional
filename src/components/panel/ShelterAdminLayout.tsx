import type { ReactNode } from "react";
import type { OctagonNavItem } from "@/components/panel/OctagonNav";
import PanelLayout from "@/components/panel/PanelLayout";

/* Secciones del panel del Admin de Refugio. "Adopciones" agrupa el proceso completo: solicitudes,
   contrato, entrega y seguimiento. "Donaciones" agrupa la cuenta de Stripe y el dashboard.
   Quita "soon" de cada una cuando se construya su pantalla. */
const NAV_ITEMS: OctagonNavItem[] = [
  { label: "Inicio", to: "/refugio/inicio" },
  { label: "Mis mascotas", lines: ["Mis", "mascotas"], to: "/refugio/mascotas" },
  { label: "Adopciones", to: "/refugio/adopciones" },
  { label: "Donaciones", to: "/refugio/donaciones", soon: true },
];

export default function ShelterAdminLayout({ children }: { children: ReactNode }) {
  return (
    <PanelLayout userLabel="Admin de Refugio" items={NAV_ITEMS}>
      {children}
    </PanelLayout>
  );
}