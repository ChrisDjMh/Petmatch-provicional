import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextAreaField } from "@/components/auth/TextField";
import ConfirmDialog from "@/components/panel/ConfirmDialog";

export type AdoptionDecision = { action: "approve" | "reject"; text?: string };

const MIN = 10;
const MAX = 500;

/* El motivo es obligatorio al rechazar (RF-37, RN-17). */
const schema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Escribe el motivo del rechazo.")
    .min(MIN, `Escribe al menos ${MIN} caracteres para que el adoptante lo entienda.`)
    .max(MAX, `Máximo ${MAX} caracteres.`),
});

const primary =
  "flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";

function RejectForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ text: string }>({ resolver: zodResolver(schema), defaultValues: { text: "" } });
  const length = watch("text").length;

  return (
    <form onSubmit={handleSubmit(({ text }) => onSubmit(text.trim()))} noValidate className="space-y-4">
      <TextAreaField
        id="adoption-reject-text"
        label="Motivo del rechazo"
        rows={5}
        maxLength={MAX + 100}
        placeholder="Explica por qué no se aprueba la solicitud."
        hint={`${length}/${MAX} · El adoptante lo verá en la app.`}
        error={errors.text?.message}
        {...register("text")}
      />
      <button type="submit" className={primary}>
        Rechazar solicitud
      </button>
    </form>
  );
}

export default function AdoptionDecisionPanel({
  adopter,
  pet,
  canApprove,
  onDecide,
}: {
  adopter: string;
  pet: string;
  /** Solo se puede aprobar si la mascota sigue Disponible (RN-04). */
  canApprove: boolean;
  onDecide: (decision: AdoptionDecision) => void;
}) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [pending, setPending] = useState<AdoptionDecision | null>(null);

  const options = [
    { action: "approve" as const, label: "Aprobar", hint: `${pet} pasa a "En proceso de adopción".`, disabled: !canApprove },
    { action: "reject" as const, label: "Rechazar", hint: "Requiere un motivo.", disabled: false },
  ];

  return (
    <section
      aria-labelledby="adoption-decision-title"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <h2 id="adoption-decision-title" className="font-heading text-2xl font-bold">
        Decisión
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Revisa las respuestas y los criterios antes de decidir.
      </p>

      <fieldset className="mt-5">
        <legend className="sr-only">Elige una acción</legend>
        <div className="grid gap-3">
          {options.map((option) => (
            <label key={option.action} className={option.disabled ? "cursor-not-allowed" : "cursor-pointer"}>
              <input
                type="radio"
                name="adoption-decision"
                value={option.action}
                disabled={option.disabled}
                checked={action === option.action}
                onChange={() => setAction(option.action)}
                className="peer sr-only"
              />
              <span
                className={`block rounded-2xl border-2 border-transparent bg-white p-4 transition peer-checked:border-ink peer-checked:bg-accent peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                  option.disabled ? "opacity-50" : "hover:bg-white/80"
                }`}
              >
                <span className="block font-extrabold">{option.label}</span>
                <span className="mt-1 block text-sm text-ink/65">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {!canApprove && (
        <p className="mt-3 rounded-2xl bg-cards-2/40 p-3 text-sm leading-6">
          {pet} ya tiene una adopción aprobada, así que no se puede aprobar otra solicitud. Puedes
          rechazarla o dejarla pendiente por si la primera se cancela.
        </p>
      )}

      <div className="mt-6">
        {action === "approve" && (
          <button type="button" className={primary} onClick={() => setPending({ action: "approve" })}>
            Aprobar solicitud
          </button>
        )}
        {action === "reject" && (
          <RejectForm onSubmit={(text) => setPending({ action: "reject", text })} />
        )}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.action === "approve" ? "¿Aprobar la solicitud?" : "¿Rechazar la solicitud?"}
        confirmLabel="Confirmar"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) onDecide(pending);
          setPending(null);
        }}
      >
        {pending?.action === "approve" ? (
          <p>
            <strong>{pet}</strong> pasará a "En proceso de adopción" y se avisará a {adopter} en su teléfono.
          </p>
        ) : (
          <>
            <p>
              Se rechazará la solicitud de <strong>{adopter}</strong> y se le enviará este motivo:
            </p>
            <blockquote className="rounded-2xl bg-cards-2/40 p-4 text-ink">{pending?.text}</blockquote>
          </>
        )}
      </ConfirmDialog>
    </section>
  );
}