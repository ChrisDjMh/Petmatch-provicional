import { useState } from "react";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import ReasonDialog from "@/components/panel/ReasonDialog";
import { completedMilestones, registerDelivery } from "@/data/entregas";
import {
  buildMilestones,
  MILESTONE_STATE_LABEL,
  todayStr,
  type MilestoneState,
} from "@/lib/hitos";

const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });
const fmt = (date: string) => dayFormat.format(new Date(`${date}T12:00:00`));

const STATE_BADGE: Record<MilestoneState, string> = {
  pendiente: "bg-white",
  disponible: "bg-accent",
  completado: "bg-ink text-background",
  vencido: "bg-ink text-background",
};

const primary =
  "flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";

/* Registro de la entrega (RF-39) y cancelación de la adopción aprobada antes de entregar (RF-40). */
export default function DeliveryCard({
  requestId,
  pet,
  adopter,
  otherPending,
  deliveryDate,
  onDelivered,
  onCancel,
}: {
  requestId: string;
  pet: string;
  adopter: string;
  /** Otras solicitudes pendientes por la misma mascota: se cierran al registrar la entrega (RN-11). */
  otherPending: number;
  deliveryDate: string | undefined;
  onDelivered: (date: string) => void;
  onCancel: (reason: string) => void;
}) {
  const today = todayStr();
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  function validate() {
    // RF-39: la fecha puede ser la de hoy o una anterior, nunca una futura.
    if (!date) return "Elige la fecha de entrega.";
    if (date > today) return "La fecha de entrega no puede ser futura. Elige hoy o una fecha anterior.";
    return "";
  }

  function submit() {
    const message = validate();
    setError(message);
    if (!message) setConfirming(true);
  }

  // Entrega ya registrada: se muestran los cinco hitos que se generaron (RF-41).
  if (deliveryDate) {
    const milestones = buildMilestones(deliveryDate, completedMilestones[requestId] ?? []);
    return (
      <section
        aria-labelledby="delivery-title"
        className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
      >
        <h2 id="delivery-title" className="font-heading text-2xl font-bold">
          Entrega y seguimiento
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/75">
          Entregada el {fmt(deliveryDate)}. Estos son los cinco hitos de seguimiento.
        </p>
        <ul className="mt-4 space-y-2">
          {milestones.map((m) => (
            <li key={m.days} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
              <div>
                <p className="font-extrabold">Hito de {m.days} días</p>
                <p className="text-sm text-ink/65">{fmt(m.dueDate)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${STATE_BADGE[m.state]}`}>
                {MILESTONE_STATE_LABEL[m.state]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const errorId = "delivery-date-error";

  return (
    <section
      aria-labelledby="delivery-title"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <h2 id="delivery-title" className="font-heading text-2xl font-bold">
        Registrar la entrega
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/75">
        Hazlo cuando {pet} ya esté con {adopter}. Desde esa fecha se cuentan los hitos de seguimiento.
      </p>

      <div className="mt-5">
        <label htmlFor="delivery-date" className="mb-2 block text-sm font-extrabold">
          Fecha de entrega
        </label>
        <input
          id="delivery-date"
          type="date"
          value={date}
          max={today}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setDate(event.target.value);
            setError("");
          }}
          className={`w-full rounded-2xl border-2 bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink ${
            error ? "border-ink" : "border-transparent"
          }`}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm font-bold">
            <span aria-hidden="true">▲ </span>
            {error}
          </p>
        )}
      </div>

      <button type="button" className={`${primary} mt-5`} onClick={submit}>
        Registrar entrega
      </button>

      <div className="mt-6 border-t border-ink/10 pt-5">
        <p className="text-sm leading-6 text-ink/70">
          ¿Ya no se va a concretar? Puedes cancelar la adopción antes de registrar la entrega.
        </p>
        <button
          type="button"
          onClick={() => setCancelling(true)}
          className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-ink/80 px-6 py-3 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]"
        >
          Cancelar adopción
        </button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="¿Registrar la entrega?"
        confirmLabel="Registrar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          registerDelivery(requestId, date);
          setConfirming(false);
          onDelivered(date);
        }}
      >
        <p>
          <strong>{pet}</strong> pasará a Adoptada y quedará registrada su entrega el {date ? fmt(date) : ""}.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Se generan los cinco hitos de seguimiento.</li>
          <li>
            {otherPending === 0
              ? `No hay otras solicitudes pendientes por ${pet}.`
              : `Se cierran como rechazadas las otras ${otherPending} ${
                  otherPending === 1 ? "solicitud pendiente" : "solicitudes pendientes"
                } por ${pet} y se avisa a sus autores.`}
          </li>
        </ul>
        <p>No se puede deshacer.</p>
      </ConfirmDialog>

      <ReasonDialog
        open={cancelling}
        title={`Cancelar la adopción de ${pet}`}
        description={`${pet} volverá a estar disponible y se avisará a ${adopter}.`}
        label="Motivo de la cancelación"
        hint="El adoptante lo verá en la app."
        submitLabel="Cancelar adopción"
        requiredMessage="Escribe el motivo de la cancelación."
        audience="el adoptante"
        onSubmit={(text) => {
          setCancelling(false);
          onCancel(text);
        }}
        onCancel={() => setCancelling(false)}
      />
    </section>
  );
}