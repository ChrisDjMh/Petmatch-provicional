import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import DecisionPanel, { type Decision } from "@/components/panel/DecisionPanel";
import RequestFiles from "@/components/panel/RequestFiles";
import { getShelterRegistrationDetail } from "@/data/solicitudesRegistro";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const backLinkClass =
  "inline-flex items-center gap-2 text-sm font-extrabold underline-offset-4 hover:underline";

const RESULTS = {
  approve: {
    badge: "Aprobada",
    icon: "✓",
    title: "Solicitud aprobada",
    text: (shelter: string, email: string) =>
      `${shelter} ya es un refugio activo. Avisamos a ${email}.`,
  },
  reject: {
    badge: "Rechazada",
    icon: "✕",
    title: "Solicitud rechazada",
    text: (_shelter: string, email: string) =>
      `Enviamos el motivo a ${email}. El representante lo verá en el estado de su solicitud.`,
  },
  info: {
    badge: "Información solicitada",
    icon: "✎",
    title: "Mensaje enviado",
    text: (_shelter: string, email: string) =>
      `Enviamos tu mensaje a ${email}. La solicitud sigue abierta hasta que el refugio la corrija y la reenvíe.`,
  },
} as const;

export default function RequestDetailPage() {
  const { id = "" } = useParams();
  const request = getShelterRegistrationDetail(id);
  // Por ahora solo frontend: la decisión no se guarda; con backend se enviará a la API (RF-13).
  const [decision, setDecision] = useState<Decision | null>(null);

  if (!request) {
    return (
      <SuperAdminLayout>
        <div role="status" className="rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft">
          <h1 className="font-heading text-3xl font-bold">No encontramos esta solicitud</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-ink/70">
            Puede que ya se haya resuelto o que el enlace no sea correcto.
          </p>
          <Link
            to="/admin/solicitudes"
            className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85"
          >
            Volver a solicitudes
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  const result = decision ? RESULTS[decision.action] : null;

  const fields: { label: string; value: string }[] = [
    { label: "Responsable", value: request.responsible },
    { label: "Correo", value: request.email },
    { label: "Teléfono", value: request.phone },
    { label: "Ciudad", value: request.city },
    { label: "Dirección", value: request.address },
  ];

  return (
    <SuperAdminLayout>
      <Link to="/admin/solicitudes" className={backLinkClass}>
        <span aria-hidden="true">←</span> Volver a solicitudes
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Solicitud de registro</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {request.shelterName}
          </h1>
          <p style={{ animationDelay: "160ms" }} className="anim-fade-up mt-3 text-ink/70">
            Enviada el {dateFormat.format(new Date(request.sentAt))}
          </p>
        </div>
        <span className="anim-fade-up inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-extrabold">
          {result ? result.badge : "Pendiente de verificación"}
        </span>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div
          style={{ animationDelay: "240ms" }}
          className="anim-fade-up space-y-10 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
        >
          <section aria-labelledby="data-title">
            <h2 id="data-title" className="font-heading text-2xl font-bold">
              Datos del refugio
            </h2>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.label} className={field.label === "Dirección" ? "sm:col-span-2" : ""}>
                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                    {field.label}
                  </dt>
                  <dd className="mt-1 break-words font-semibold">{field.value}</dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  Descripción
                </dt>
                <dd className="mt-1 leading-7 text-ink/85">{request.description}</dd>
              </div>
            </dl>
          </section>

          <RequestFiles documents={request.documents} photos={request.photos} />
        </div>

        <aside style={{ animationDelay: "320ms" }} className="anim-fade-up lg:sticky lg:top-6">
          {result && decision ? (
            <div role="status" className="rounded-[2rem] bg-white/70 p-8 shadow-soft backdrop-blur">
              <span className="flex size-14 items-center justify-center rounded-full bg-accent text-2xl font-bold">
                <span aria-hidden="true">{result.icon}</span>
              </span>
              <h2 className="mt-5 font-heading text-3xl font-bold">{result.title}</h2>
              <p className="mt-2 leading-7 text-ink/75">
                {result.text(request.shelterName, request.email)}
              </p>
              {decision.text && (
                <blockquote className="mt-4 rounded-2xl bg-cards-2/40 p-4 text-sm leading-6">
                  {decision.text}
                </blockquote>
              )}
              <Link
                to="/admin/solicitudes"
                className="mt-7 flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85"
              >
                Volver a solicitudes
              </Link>
            </div>
          ) : (
            <DecisionPanel
              shelterName={request.shelterName}
              email={request.email}
              onDecide={setDecision}
            />
          )}
        </aside>
      </div>
    </SuperAdminLayout>
  );
}
