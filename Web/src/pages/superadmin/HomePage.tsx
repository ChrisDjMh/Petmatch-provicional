import { Link } from "react-router-dom";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { donations } from "@/data/donaciones";
import { useInterviews } from "@/data/entrevistas";
import { logEntries } from "@/data/bitacora";
import { initialShelters } from "@/data/refugios";
import { shelterRegistrationRequests } from "@/data/solicitudesRegistro";
import { needsResult } from "@/lib/entrevistas";

const moneyFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const dateTimeFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const linkClass =
  "inline-flex items-center justify-center rounded-full border-2 border-ink/80 px-4 py-2 text-sm font-extrabold transition hover:bg-cards-2/40";

function StatCard({ to, value, label, detail }: { to: string; value: string; label: string; detail: string }) {
  return (
    <li>
      <Link
        to={to}
        className="block h-full rounded-2xl bg-white/70 p-5 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      >
        <p className="font-heading text-4xl font-bold">{value}</p>
        <p className="mt-1 font-extrabold">{label}</p>
        <p className="mt-1 text-sm text-ink/70">{detail}</p>
      </Link>
    </li>
  );
}

export default function HomePage() {
  const interviews = useInterviews();
  const now = new Date();

  const pending = shelterRegistrationRequests;
  const oldest = pending.reduce<string | null>((min, r) => (min === null || r.sentAt < min ? r.sentAt : min), null);
  const waitingDays = oldest
    ? Math.max(0, Math.floor((now.getTime() - new Date(oldest).getTime()) / (24 * 60 * 60 * 1000)))
    : 0;

  const active = initialShelters.filter((s) => s.status === "activo").length;
  const suspended = initialShelters.filter((s) => s.status === "suspendido").length;

  const paid = donations.filter((d) => d.status === "exitosa");
  const paidTotal = paid.reduce((sum, d) => sum + d.amount, 0);
  const failed = donations.filter((d) => d.status === "fallida").length;

  const scheduled = interviews.filter((i) => i.status === "programada");
  const noResult = scheduled.filter((i) => needsResult(i, now)).length;

  const latest = [...logEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // Lo que pide acción del Super Admin, en orden de importancia.
  const attention: { key: string; text: string; to: string; action: string }[] = [];
  if (pending.length > 0) {
    attention.push({
      key: "solicitudes",
      text: `${pending.length === 1 ? "1 solicitud de registro espera" : `${pending.length} solicitudes de registro esperan`} una decisión. La más antigua lleva ${waitingDays} ${waitingDays === 1 ? "día" : "días"}.`,
      to: "/admin/solicitudes",
      action: "Revisar solicitudes",
    });
  }
  if (suspended > 0) {
    attention.push({
      key: "suspendidos",
      text: `${suspended === 1 ? "1 refugio está suspendido" : `${suspended} refugios están suspendidos`}.`,
      to: "/admin/refugios",
      action: "Ver refugios",
    });
  }
  if (noResult > 0) {
    attention.push({
      key: "entrevistas",
      text: `${noResult === 1 ? "1 entrevista ya pasó" : `${noResult} entrevistas ya pasaron`} y el refugio no registró el resultado.`,
      to: "/admin/entrevistas",
      action: "Ver entrevistas",
    });
  }
  if (failed > 0) {
    attention.push({
      key: "donaciones",
      text: `${failed === 1 ? "1 donación fallida" : `${failed} donaciones fallidas`} en el historial.`,
      to: "/admin/donaciones",
      action: "Ver donaciones",
    });
  }

  return (
    <SuperAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">Panel de administración</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Inicio
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
      >
        Un vistazo a lo que pasa en PetMatch y lo que necesita tu atención hoy.
      </p>

      <ul aria-label="Resumen" className="anim-fade-up mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          to="/admin/solicitudes"
          value={String(pending.length)}
          label="Solicitudes de registro"
          detail="Refugios esperando decisión"
        />
        <StatCard
          to="/admin/refugios"
          value={String(active)}
          label="Refugios activos"
          detail={suspended === 0 ? "Ninguno suspendido" : `${suspended} suspendido${suspended === 1 ? "" : "s"}`}
        />
        <StatCard
          to="/admin/entrevistas"
          value={String(scheduled.length)}
          label="Entrevistas programadas"
          detail={noResult === 0 ? "Todas al corriente" : `${noResult} sin resultado`}
        />
        <StatCard
          to="/admin/donaciones"
          value={moneyFormat.format(paidTotal)}
          label="Donaciones exitosas"
          detail={`${paid.length} pagos registrados`}
        />
      </ul>

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-2">
        <section
          aria-labelledby="attention-title"
          className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
        >
          <h2 id="attention-title" className="font-heading text-2xl font-bold">
            Requiere atención
          </h2>
          {attention.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-white px-5 py-6 text-center font-semibold text-ink/70">
              No hay pendientes. Todo está al corriente.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {attention.map((item) => (
                <li key={item.key} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                  <p className="min-w-0 flex-1 text-sm font-semibold leading-6">{item.text}</p>
                  <Link to={item.to} className={linkClass}>
                    {item.action}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="latest-title"
          className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="latest-title" className="font-heading text-2xl font-bold">
              Últimos cambios
            </h2>
            <Link to="/admin/bitacora" className="text-sm font-extrabold underline underline-offset-4 hover:text-ink/70">
              Ver bitácora
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {latest.map((entry) => (
              <li key={entry.id} className="rounded-2xl bg-white p-4">
                <p className="text-sm font-extrabold">{entry.subject}</p>
                <p className="mt-0.5 text-sm text-ink/75">
                  {entry.from} → {entry.to}
                </p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {dateTimeFormat.format(new Date(entry.date))} · {entry.author}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SuperAdminLayout>
  );
}