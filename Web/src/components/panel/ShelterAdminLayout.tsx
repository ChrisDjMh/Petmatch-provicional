import type { ReactNode } from "react";
import PanelHeader from "@/components/panel/PanelHeader";
import ShelterTopNav from "@/components/panel/ShelterTopNav";

export default function ShelterAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-cards to-cards-2 text-ink">
      <PanelHeader userLabel="Admin de Refugio" />
      <ShelterTopNav />
      <main className="mx-auto w-full min-w-0 max-w-6xl px-6 pb-20 pt-8 sm:px-10 lg:pt-6">
        {children}
      </main>
    </div>
  );
}
