import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextAreaField } from "@/components/auth/TextField";
import ConfirmDialog from "@/components/panel/ConfirmDialog";

export type DecisionAction = "approve" | "reject" | "info";

export type Decision = { action: DecisionAction; text?: string };

const MIN = 10;
const MAX = 500;

/* Motivo y mensaje son obligatorios (RF-13): sin texto no se puede rechazar ni pedir información. */
const reasonSchema = (empty: string) =>
  z.object({
    text: z
      .string()
      .trim()
      .min(1, empty)
      .min(MIN, `Escribe al menos ${MIN} caracteres para que el representante lo entienda.`)
      .max(MAX, `Máximo ${MAX} caracteres.`),
  });

const OPTIONS: {
  action: DecisionAction;
  label: string;
  hint: string;
  submit: string;
}[] = [
  { action: "approve", label: "Aprobar", hint: "El refugio pasa a activo.", submit: "Aprobar solicitud" },
  {
    action: "info",
    label: "Pedir más información",
    hint: "El representante corrige y reenvía.",
    submit: "Enviar mensaje",
  },
  { action: "reject", label: "Rechazar", hint: "Requiere un motivo.", submit: "Rechazar solicitud" },
];

const primary =
  "flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";

function ReasonForm({
  action,
  onSubmit,
}: {
  action: "reject" | "info";
  onSubmit: (text: string) => void;
}) {
  const isReject = action === "reject";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ text: string }>({
    resolver: zodResolver(
      reasonSchema(isReject ? "Escribe el motivo del rechazo." : "Escribe qué debe corregir o completar."),
    ),
    defaultValues: { text: "" },
  });
  const length = watch("text").length;

  return (
    <form onSubmit={handleSubmit(({ text }) => onSubmit(text.trim()))} noValidate className="space-y-4">
      <TextAreaField
        id="decision-text"
        label={isReject ? "Motivo del rechazo" : "Mensaje para el representante"}
        rows={5}
        maxLength={MAX + 100}
        placeholder={
          isReject
            ? "Explica por qué se rechaza la solicitud."
            : "Indica con claridad qué debe corregir o completar."
        }
        hint={`${length}/${MAX} · El representante lo recibirá por correo y lo verá en su solicitud.`}
        error={errors.text?.message}
        {...register("text")}
      />
      <button type="submit" className={primary}>
        {isReject ? "Rechazar solicitud" : "Enviar mensaje"}
      </button>
    </form>
  );
}

export default function DecisionPanel({
  shelterName,
  email,
  onDecide,
}: {
  shelterName: string;
  email: string;
  onDecide: (decision: Decision) => void;
}) {
  const [action, setAction] = useState<DecisionAction | null>(null);
  // Decisión lista, esperando la confirmación del Super Admin.
  const [pending, setPending] = useState<Decision | null>(null);

  const pendingLabel = pending && OPTIONS.find((o) => o.action === pending.action)?.submit;

  return (
    <section
      aria-labelledby="decision-title"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <h2 id="decision-title" className="font-heading text-2xl font-bold">
        Decisión
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Revisa los datos, los documentos y las fotos antes de decidir.
      </p>

      <fieldset className="mt-5">
        <legend className="sr-only">Elige una acción</legend>
        <div className="grid gap-3">
          {OPTIONS.map((option) => (
            <label key={option.action} className="cursor-pointer">
              <input
                type="radio"
                name="decision"
                value={option.action}
                checked={action === option.action}
                onChange={() => setAction(option.action)}
                className="peer sr-only"
              />
              <span className="block h-full rounded-2xl border-2 border-transparent bg-white p-4 transition peer-checked:border-ink peer-checked:bg-accent peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:bg-white/80">
                <span className="block font-extrabold">{option.label}</span>
                <span className="mt-1 block text-sm text-ink/65">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        {action === "approve" && (
          <button type="button" className={primary} onClick={() => setPending({ action: "approve" })}>
            Aprobar solicitud
          </button>
        )}
        {(action === "reject" || action === "info") && (
          // key: al cambiar de acción el formulario se reinicia, así no se arrastra el texto ni los errores.
          <ReasonForm
            key={action}
            action={action}
            onSubmit={(text) => setPending({ action, text })}
          />
        )}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pendingLabel ? `${pendingLabel}?` : ""}
        confirmLabel="Confirmar"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) onDecide(pending);
          setPending(null);
        }}
      >
        {pending?.action === "approve" && (
          <p>
            <strong>{shelterName}</strong> pasará a refugio activo y se avisará a {email}.
          </p>
        )}
        {pending?.action === "reject" && (
          <>
            <p>
              Se rechazará la solicitud de <strong>{shelterName}</strong> y se enviará este motivo a {email}:
            </p>
            <blockquote className="rounded-2xl bg-cards-2/40 p-4 text-ink">{pending.text}</blockquote>
          </>
        )}
        {pending?.action === "info" && (
          <>
            <p>
              La solicitud de <strong>{shelterName}</strong> quedará en espera de información y se enviará
              este mensaje a {email}:
            </p>
            <blockquote className="rounded-2xl bg-cards-2/40 p-4 text-ink">{pending.text}</blockquote>
          </>
        )}
      </ConfirmDialog>
    </section>
  );
}
