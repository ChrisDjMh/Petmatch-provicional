import type { ReactNode } from "react";
import PanelHeader from "@/components/panel/PanelHeader";
import TopNav, { type TopNavItem } from "@/components/panel/TopNav";

export type OctagonNavItem = TopNavItem;

/** Layout legado compatible con los paneles que todavía usan PanelLayout. */
export default function PanelLayout({
  userLabel,
  items,
  children,
}: {
  userLabel: string;
  items: OctagonNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-cards to-cards-2 text-ink">
      <PanelHeader userLabel={userLabel} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8"><TopNav items={items} /></div>
      <main className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-20 pt-8 sm:px-10">{children}</main>
    </div>
  );
}
