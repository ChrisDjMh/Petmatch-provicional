import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import type { Pet, PetStatus } from "@/data/mascotas";
import { listPets, removePet } from "@/data/mascotasStore";

const STATUS_BADGE: Record<PetStatus, { label: string; className: string }> = {
  disponible: { label: "Disponible", className: "bg-accent" },
  "en-proceso": { label: "En proceso de adopción", className: "bg-white" },
  adoptada: { label: "Adoptada", className: "bg-ink text-background" },
};

function ageLabel(years: number, months: number) {
  const y = years > 0 ? `${years} ${years === 1 ? "año" : "años"}` : "";
  const m = months > 0 ? `${months} ${months === 1 ? "mes" : "meses"}` : "";
  return [y, m].filter(Boolean).join(" y ") || "Recién nacida";
}

/* RF-22: no se puede eliminar una mascota con adopción aprobada ("En proceso de adopción") ni concretada
   ("Adoptada"). */
const canDelete = (pet: Pet) => pet.status === "disponible";

const buttonBase =
  "inline-flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-[0.98]";

export default function PetsPage() {
  // Por ahora solo frontend: los cambios no se guardan; con backend se enviarán a la API (RF-22).
  const [pets, setPets] = useState<Pet[]>(() => listPets());
  const [deleting, setDeleting] = useState<Pet | null>(null);
  // El formulario de mascota (RF-20, RF-21) deja aquí su aviso al guardar.
  const location = useLocation();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(() => {
    const saved = (location.state as { message?: string } | null)?.message;
    return saved ? { kind: "ok", text: saved } : null;
  });

  function askDelete(pet: Pet) {
    if (!canDelete(pet)) {
      setMessage({
        kind: "error",
        text:
          pet.status === "adoptada"
            ? `No se puede eliminar a ${pet.name}: ya fue adoptada y su historial debe conservarse.`
            : `No se puede eliminar a ${pet.name}: tiene una adopción aprobada. Cancélala primero si quieres retirarla.`,
      });
      return;
    }
    setMessage(null);
    setDeleting(pet);
  }

  function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    // Eliminar la oculta de la app y de esta lista; su historial se conserva (RF-22).
    removePet(target.id);
    setPets((list) => list.filter((p) => p.id !== target.id));
    setMessage({
      kind: "ok",
      text: `${target.name} ya no aparece en la app. Su historial se conserva.`,
    });
    setDeleting(null);
  }

  return (
    <ShelterAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Patitas Felices</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Mis mascotas
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
          >
            Las mascotas de tu refugio. Solo las <strong>disponibles</strong> aparecen en la app para los
            adoptantes.
          </p>
        </div>
        <Link
          to="/refugio/mascotas/nueva"
          className="anim-fade-up inline-flex items-center rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85"
        >
          Agregar mascota
        </Link>
      </div>

      {/* El mensaje de la última acción; "alert" para los errores y "status" para los avisos normales. */}
      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`anim-fade-up mt-6 rounded-2xl px-5 py-3 text-sm font-bold ${
            message.kind === "error" ? "bg-ink text-background" : "bg-accent"
          }`}
        >
          {message.text}
        </p>
      )}

      {pets.length === 0 ? (
        <section className="anim-fade-up mt-8 rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft backdrop-blur">
          <h2 className="font-heading text-2xl font-bold">Aún no tienes mascotas</h2>
          <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
            Agrega la primera para que los adoptantes la vean en la app.
          </p>
          <Link
            to="/refugio/mascotas/nueva"
            className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85"
          >
            Agregar mascota
          </Link>
        </section>
      ) : (
        <ul
          aria-label="Lista de mascotas"
          style={{ animationDelay: "240ms" }}
          className="anim-fade-up mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {pets.map((pet) => (
            <li key={pet.id} className="flex flex-col overflow-hidden rounded-[1.75rem] bg-white/70 shadow-soft backdrop-blur">
              <img
                src={pet.photo}
                alt={`Foto de ${pet.name}`}
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-heading text-2xl font-bold">{pet.name}</h2>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_BADGE[pet.status].className}`}>
                    {STATUS_BADGE[pet.status].label}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-ink/70">
                  {pet.species} · {pet.size} · {pet.sex}
                </p>
                <p className="text-sm text-ink/60">{ageLabel(pet.ageYears, pet.ageMonths)}</p>

                <div className="mt-5 flex gap-2 pt-1">
                  <Link
                    to={`/refugio/mascotas/${pet.id}/editar`}
                    className={`${buttonBase} bg-accent hover:bg-accent-warm`}
                  >
                    Editar<span className="sr-only"> a {pet.name}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => askDelete(pet)}
                    aria-disabled={!canDelete(pet)}
                    className={`${buttonBase} border-2 border-ink/80 hover:bg-cards-2/40 ${
                      canDelete(pet) ? "" : "opacity-50"
                    }`}
                  >
                    Eliminar<span className="sr-only"> a {pet.name}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `¿Eliminar a ${deleting.name}?` : ""}
        confirmLabel="Eliminar"
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      >
        <p>
          Dejará de aparecer en la app y en tu lista. Su historial se conserva, pero no podrás volver a
          publicarla desde aquí.
        </p>
      </ConfirmDialog>
    </ShelterAdminLayout>
  );
}