import type { ReactNode } from "react";
import type { OctagonNavItem } from "@/components/panel/OctagonNav";
import PanelLayout from "@/components/panel/PanelLayout";

/* Secciones del panel del Admin de Refugio. "Adopciones" agrupa el proceso completo: solicitudes,
   contrato, entrega y seguimiento. "Donaciones" agrupa la cuenta de Stripe y el dashboard.
   Una sección sin pantalla se marca con "soon". */
const NAV_ITEMS: OctagonNavItem[] = [
  { label: "Inicio", to: "/refugio/inicio" },
  { label: "Mis mascotas", lines: ["Mis", "mascotas"], to: "/refugio/mascotas" },
  { label: "Adopciones", to: "/refugio/adopciones" },
  { label: "Entrevistas", to: "/refugio/entrevistas" },
  { label: "Donaciones", to: "/refugio/donaciones" },
];

export default function ShelterAdminLayout({ children }: { children: ReactNode }) {
  return (
    <PanelLayout userLabel="Admin de Refugio" items={NAV_ITEMS}>
      {children}
    </PanelLayout>
  );
}