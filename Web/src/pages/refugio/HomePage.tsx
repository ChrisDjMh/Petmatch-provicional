import type { ReactNode } from "react";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import {
  newAdoptionRequests,
  overdueMilestones,
  receivedDonations,
  shelterInfo,
} from "@/data/inicioRefugio";

const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long" });
const dateTimeFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const moneyFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const DONATION_TYPE = {
  unica: "Donación única",
  mensual: "Apadrinamiento mensual",
  "post-adopcion": "Donación post-adopción",
} as const;

function Section({
  id,
  title,
  count,
  emptyText,
  className = "",
  children,
}: {
  id: string;
  title: string;
  count: number;
  emptyText: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-6 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="font-heading text-2xl font-bold">
          {title}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-extrabold ${count > 0 ? "bg-accent" : "bg-white"}`}
        >
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="mt-4 rounded-2xl bg-white px-5 py-6 text-center font-semibold text-ink/70">{emptyText}</p>
      ) : (
        <ul className="mt-4 space-y-3">{children}</ul>
      )}
    </section>
  );
}

function SummaryCard({
  href,
  value,
  label,
  highlight = false,
}: {
  href: string;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  const active = highlight && value > 0;
  return (
    <a
      href={href}
      className={`group block rounded-[1.75rem] p-6 shadow-soft transition hover:-translate-y-0.5 ${
        active ? "bg-ink text-background" : "bg-white/70 backdrop-blur"
      }`}
    >
      <span className="block font-heading text-5xl font-bold">{value}</span>
      <span className={`mt-1 block text-sm font-extrabold ${active ? "text-background/85" : "text-ink/70"}`}>
        {label}
      </span>
    </a>
  );
}

export default function HomePage() {
  const overdue = overdueMilestones.length;
  const requests = newAdoptionRequests.length;
  const donations = receivedDonations.length;
  const allClear = overdue + requests + donations === 0;

  return (
    <ShelterAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">{shelterInfo.name}</p>
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
        {allClear
          ? "Todo está al día. Aquí aparecerán los avisos nuevos."
          : "Esto es lo que necesita tu atención hoy. Lo más urgente va primero."}
      </p>

      <div
        style={{ animationDelay: "240ms" }}
        className="anim-fade-up mt-8 grid gap-4 sm:grid-cols-3"
      >
        <SummaryCard href="#hitos-vencidos" value={overdue} label="Hitos vencidos" highlight />
        <SummaryCard href="#solicitudes-nuevas" value={requests} label="Solicitudes nuevas" />
        <SummaryCard href="#donaciones-recibidas" value={donations} label="Donaciones recibidas" />
      </div>

      <div style={{ animationDelay: "320ms" }} className="anim-fade-up mt-8 space-y-6">
        <Section
          id="hitos-vencidos"
          title="Hitos vencidos"
          count={overdue}
          emptyText="No hay hitos vencidos. Los seguimientos van al corriente."
        >
          {overdueMilestones.map((m) => (
            <li key={m.id} className="rounded-2xl bg-white p-5">
              <p className="font-extrabold">
                Hito de {m.days} días · {m.pet}
              </p>
              <p className="mt-1 text-sm text-ink/70">
                {m.adopter} no lo registró a tiempo. Debía hacerlo el {dayFormat.format(new Date(`${m.dueDate}T00:00:00`))}.
              </p>
            </li>
          ))}
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section
            id="solicitudes-nuevas"
            title="Solicitudes nuevas"
            count={requests}
            emptyText="No hay solicitudes de adopción por revisar."
          >
            {newAdoptionRequests.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white p-5">
                <p className="font-extrabold">
                  {r.adopter} quiere adoptar a {r.pet}
                </p>
                <p className="mt-1 text-sm text-ink/70">Enviada el {dateTimeFormat.format(new Date(r.sentAt))}</p>
              </li>
            ))}
          </Section>

          <Section
            id="donaciones-recibidas"
            title="Donaciones recibidas"
            count={donations}
            emptyText="Aún no hay donaciones nuevas."
          >
            {receivedDonations.map((d) => (
              <li key={d.id} className="rounded-2xl bg-white p-5">
                <p className="font-extrabold">
                  {moneyFormat.format(d.amount)} de {d.donor}
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  {DONATION_TYPE[d.type]} · {dateTimeFormat.format(new Date(d.date))}
                </p>
              </li>
            ))}
          </Section>
        </div>
      </div>
    </ShelterAdminLayout>
  );
}