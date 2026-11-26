import CategoriesManager from "@/components/panel/CategoriesManager";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { CURRENT_SHELTER } from "@/data/entrevistas";

export default function ShelterCategoriesPage() {
  return (
    <ShelterAdminLayout>
      <p className="eyebrow text-ink/70">Administración del refugio</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Categorías</h1>
      <p className="mt-3 max-w-2xl leading-7 text-ink/70">
        Organiza las categorías de tus mascotas. Estos cambios solo afectan a {CURRENT_SHELTER.name}.
      </p>
      <CategoriesManager shelterId={CURRENT_SHELTER.id} />
    </ShelterAdminLayout>
  );
}
