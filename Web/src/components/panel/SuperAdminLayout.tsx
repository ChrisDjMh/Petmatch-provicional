import type { ReactNode } from "react";
import PanelHeader from "@/components/panel/PanelHeader";
import TopNav, { type TopNavItem } from "@/components/panel/TopNav";

const items: TopNavItem[] = [
  { label: "Inicio", to: "/admin/inicio", paths: ["/admin/inicio"] },
  { label: "Solicitudes", to: "/admin/solicitudes", paths: ["/admin/solicitudes"] },
  { label: "Refugios", to: "/admin/refugios", paths: ["/admin/refugios"] },
  { label: "Entrevistas", to: "/admin/entrevistas", paths: ["/admin/entrevistas"] },
  { label: "Entregas", to: "/admin/entregas", paths: ["/admin/entregas"] },
  { label: "Donaciones", to: "/admin/donaciones", paths: ["/admin/donaciones"] },
  { label: "Categorías", to: "/admin/categorias", paths: ["/admin/categorias"] },
  { label: "Bitácora", to: "/admin/bitacora", paths: ["/admin/bitacora"] },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-cards to-cards-2 text-ink">
      <PanelHeader userLabel="Super Admin" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <TopNav items={items} />
      </div>
      <main className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-20 pt-8 sm:px-10 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
