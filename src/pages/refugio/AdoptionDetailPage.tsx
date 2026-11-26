import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import AdoptionDecisionPanel, { type AdoptionDecision } from "@/components/panel/AdoptionDecisionPanel";
import ContractCard from "@/components/panel/ContractCard";
import DeliveryCard from "@/components/panel/DeliveryCard";
import { adoptionRequests, getAdoptionDetail, type AdoptionStatus } from "@/data/adopciones";
import { getDeliveryDate } from "@/data/entregas";
import { evaluateCompatibility, MIN_CRITERIA } from "@/lib/compatibilidad";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

const STATUS_BADGE: Record<AdoptionStatus, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-accent" },
  aprobada: { label: "Aprobada", className: "bg-ink text-background" },
  rechazada: { label: "Rechazada", className: "bg-white" },
  cancelada: { label: "Cancelada", className: "bg-white/60 text-ink/70" },
};

const backLinkClass = "inline-flex items-center gap-2 text-sm font-extrabold underline-offset-4 hover:underline";

export default function AdoptionDetailPage() {
  const { id = "" } = useParams();
  const request = getAdoptionDetail(id);
  // Por ahora solo frontend: nada se guarda; con backend se enviará a la API (RF-37, RF-39, RF-40).
  const [decision, setDecision] = useState<AdoptionDecision | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | undefined>(getDeliveryDate(id));
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  if (!request) {
    return (
      <ShelterAdminLayout>
        <div role="status" className="rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft">
          <h1 className="font-heading text-3xl font-bold">No encontramos esta solicitud</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-ink/70">
            Puede que el enlace no sea correcto o que la solicitud no sea de tu refugio.
          </p>
          <Link
            to="/refugio/adopciones"
            className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85"
          >
            Volver a adopciones
          </Link>
        </div>
      </ShelterAdminLayout>
    );
  }

  const { criteria, metCount, compatible } = evaluateCompatibility(request.profile, request.petRequirements);
  const status: AdoptionStatus =
    cancelReason !== null
      ? "cancelada"
      : decision
        ? decision.action === "approve"
          ? "aprobada"
          : "rechazada"
        : request.status;
  const reason = cancelReason ?? decision?.text ?? request.decisionReason;
  const delivered = status === "aprobada" && deliveryDate !== undefined;
  const badge = delivered ? { label: "Entregada", className: "bg-ink text-background" } : STATUS_BADGE[status];

  // RN-11: al registrar la entrega se cierran las demás solicitudes pendientes por la misma mascota.
  const otherPending = adoptionRequests.filter(
    (r) => r.pet === request.pet && r.status === "pendiente" && r.id !== request.id,
  ).length;

  const answers = [
    { label: "Tipo de vivienda", value: request.housingType },
    { label: "Personas en el hogar", value: String(request.householdSize) },
    { label: "Acepta el seguimiento", value: request.acceptsFollowUp ? "Sí" : "No" },
    { label: "Correo", value: request.email },
  ];

  return (
    <ShelterAdminLayout>
      <Link to="/refugio/adopciones" className={backLinkClass}>
        <span aria-hidden="true">←</span> Volver a adopciones
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Solicitud de adopción</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {request.adopter} quiere adoptar a {request.pet}
          </h1>
          <p style={{ animationDelay: "160ms" }} className="anim-fade-up mt-3 text-ink/70">
            Enviada el {dateFormat.format(new Date(request.sentAt))}
          </p>
        </div>
        <span className={`anim-fade-up inline-flex rounded-full px-4 py-2 text-sm font-extrabold ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div style={{ animationDelay: "240ms" }} className="anim-fade-up space-y-10 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <section aria-labelledby="answers-title">
            <h2 id="answers-title" className="font-heading text-2xl font-bold">
              Respuestas del adoptante
            </h2>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {answers.map((a) => (
                <div key={a.label}>
                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">{a.label}</dt>
                  <dd className="mt-1 break-words font-semibold">{a.value}</dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  Motivo para adoptar
                </dt>
                <dd className="mt-1 leading-7 text-ink/85">{request.motive}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="criteria-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="criteria-title" className="font-heading text-2xl font-bold">
                Compatibilidad
              </h2>
              <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${compatible ? "bg-accent" : "bg-ink text-background"}`}>
                Cumple {metCount} de 6
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Lo que pide {request.pet} contra lo que ofrece {request.adopter} al enviar la solicitud.{" "}
              {compatible
                ? `Cumple el mínimo de ${MIN_CRITERIA} criterios.`
                : `No llega al mínimo de ${MIN_CRITERIA} criterios.`}
            </p>
            <ul className="mt-4 space-y-3">
              {criteria.map((c) => (
                <li key={c.key} className="flex items-start gap-4 rounded-2xl bg-white p-4">
                  {/* El resultado va con símbolo y texto, no solo con color. */}
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      c.met ? "bg-accent" : "bg-ink text-background"
                    }`}
                  >
                    {c.met ? "✓" : "✕"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-extrabold">
                      {c.label} <span className="font-semibold text-ink/70">· {c.met ? "Cumple" : "No cumple"}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink/70">Pide: {c.required}</p>
                    <p className="text-sm text-ink/70">Ofrece: {c.offered}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Solo el panel de decisión se queda fijo al hacer scroll: las demás tarjetas son más altas que la pantalla. */}
        <aside
          style={{ animationDelay: "320ms" }}
          className={`anim-fade-up ${status === "pendiente" ? "xl:sticky xl:top-6" : ""}`}
        >
          {status === "pendiente" ? (
            <AdoptionDecisionPanel
              adopter={request.adopter}
              pet={request.pet}
              canApprove={request.petStatus === "disponible"}
              onDecide={setDecision}
            />
          ) : (
            <div className="space-y-6">
              <div role="status" className="rounded-[2rem] bg-white/70 p-8 shadow-soft backdrop-blur">
                <h2 className="font-heading text-3xl font-bold">
                  {delivered && "Adopción concretada"}
                  {status === "aprobada" && !delivered && "Solicitud aprobada"}
                  {status === "rechazada" && "Solicitud rechazada"}
                  {status === "cancelada" && "Adopción cancelada"}
                </h2>
                <p className="mt-2 leading-7 text-ink/75">
                  {delivered &&
                    `${request.pet} se entregó el ${dayFormat.format(new Date(`${deliveryDate}T12:00:00`))} y ya está Adoptada.`}
                  {status === "aprobada" &&
                    !delivered &&
                    (decision
                      ? `${request.pet} pasó a "En proceso de adopción" y se avisó a ${request.adopter}.`
                      : "Esta solicitud ya fue aprobada.")}
                  {status === "rechazada" && "El adoptante recibió el motivo en su teléfono."}
                  {status === "cancelada" &&
                    (cancelReason !== null
                      ? `${request.pet} volvió a estar disponible y se avisó a ${request.adopter}.`
                      : "La adopción se canceló antes de registrar la entrega.")}
                </p>
                {reason && (
                  <blockquote className="mt-4 rounded-2xl bg-cards-2/40 p-4 text-sm leading-6">{reason}</blockquote>
                )}
                <Link
                  to="/refugio/adopciones"
                  className="mt-7 flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85"
                >
                  Volver a adopciones
                </Link>
              </div>
              {status === "aprobada" && <ContractCard requestId={request.id} adopter={request.adopter} />}
              {status === "aprobada" && (
                <DeliveryCard
                  requestId={request.id}
                  pet={request.pet}
                  adopter={request.adopter}
                  otherPending={otherPending}
                  deliveryDate={deliveryDate}
                  onDelivered={setDeliveryDate}
                  onCancel={setCancelReason}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </ShelterAdminLayout>
  );
}