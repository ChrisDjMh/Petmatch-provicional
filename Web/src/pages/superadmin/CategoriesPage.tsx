import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import CategoriesManager from "@/components/panel/CategoriesManager";

export default function CategoriesPage() {
  return (
    <SuperAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">Contenido</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Categorías
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Las categorías de mascotas (perros, gatos, etc.) de cada refugio, con su nombre y su foto.
      </p>

      <CategoriesManager />
    </SuperAdminLayout>
  );
}