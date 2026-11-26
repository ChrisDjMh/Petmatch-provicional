import { Link } from "react-router-dom";
import AdoptionTabs from "@/components/panel/AdoptionTabs";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { adoptionRequests } from "@/data/adopciones";
import { CURRENT_SHELTER } from "@/data/entrevistas";

const statusLabels = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
} as const;
const statusClasses = {
  pendiente: "bg-amber-100 text-amber-900",
  aprobada: "bg-accent text-ink",
  rechazada: "bg-rose-100 text-rose-900",
  cancelada: "bg-ink/10 text-ink/70",
} as const;
const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });

export default function AdoptionsPage() {
  const requests = [...adoptionRequests].sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  return (
    <ShelterAdminLayout>
      <p className="eyebrow text-ink/70">Gestión de solicitudes</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Adopciones</h1>
      <p className="mt-3 max-w-2xl leading-7 text-ink/70">
        Consulta las solicitudes de adopción recibidas por {CURRENT_SHELTER.name} y revisa cada expediente.
      </p>
      <AdoptionTabs />
      <section aria-label="Solicitudes de adopción" className="mt-6 space-y-3">
        {requests.map((request) => (
          <article key={request.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/75 p-5 shadow-soft">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink/55">{request.id}</p>
              <h2 className="mt-1 font-heading text-xl font-bold">{request.pet}</h2>
              <p className="mt-1 text-sm text-ink/70">Solicitante: <strong className="text-ink">{request.adopter}</strong></p>
              <p className="mt-1 text-xs text-ink/60">Enviada el {dateFormat.format(new Date(request.sentAt))}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${statusClasses[request.status]}`}>{statusLabels[request.status]}</span>
              <Link to={`/refugio/adopciones/${request.id}`} className="rounded-full border-2 border-ink/80 px-4 py-2 text-sm font-extrabold transition hover:bg-cards-2/40">Ver solicitud</Link>
            </div>
          </article>
        ))}
      </section>
    </ShelterAdminLayout>
  );
}
