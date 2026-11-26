import type { ReactNode } from "react";
import OctagonNav, { type OctagonNavItem } from "@/components/panel/OctagonNav";
import PanelHeader from "@/components/panel/PanelHeader";

/* Estructura común de los paneles web con sesión iniciada: encabezado, medio octágono de secciones y
   contenido. Cada rol pasa sus propias secciones (una por triángulo, de arriba abajo en escritorio y de
   izquierda a derecha en celular). Las marcadas con "soon" aún no tienen pantalla. */
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

      <div className="lg:flex lg:items-start lg:gap-8">
        {/* Escritorio: medio octágono fijo, pegado al borde izquierdo y centrado en la altura de la
            pantalla; lo demás de la página se desplaza. El espacio vacío reserva su ancho (204 px). */}
        <div aria-hidden="true" className="hidden lg:block lg:w-[204px] lg:shrink-0" />
        <nav
          aria-label="Secciones del panel"
          className="hidden lg:fixed lg:left-0 lg:top-1/2 lg:z-10 lg:block lg:-translate-y-1/2"
        >
          <OctagonNav items={items} orientation="side" />
        </nav>

        {/* Celular y tableta: medio octágono con el lado plano arriba */}
        <nav aria-label="Secciones del panel" className="px-6 sm:px-10 lg:hidden">
          <OctagonNav items={items} orientation="top" />
        </nav>

        <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-6 pb-20 pt-10 sm:px-10 lg:pr-10 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}