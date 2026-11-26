import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { TextAreaField } from "@/components/auth/TextField";
import { primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";

type Mode = "approve" | "reject" | "info";
type Decision = { type: Mode; message?: string };

/* ---------- Formulario con mensaje obligatorio (rechazar / pedir información, RN-17) ---------- */
type ReasonFormProps = {
  id: string;
  label: string;
  hint: string;
  emptyError: string;
  submitLabel: string;
  onSubmit: (message: string) => void;
  onCancel: () => void;
};

function ReasonForm({ id, label, hint, emptyError, submitLabel, onSubmit, onCancel }: ReasonFormProps) {
  const schema = useMemo(
    () => z.object({ message: z.string().trim().min(1, emptyError) }),
    [emptyError],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(values.message.trim()))}
      className="anim-fade-up mt-5 space-y-4"
    >
      <TextAreaField
        id={id}
        label={label}
        hint={hint}
        error={errors.message?.message}
        {...register("message")}
      />
      <button type="submit" className={primaryButtonClass}>
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} className={secondaryButtonClass}>
        Cancelar
      </button>
    </form>
  );
}

/* ---------- Resultado de la decisión ---------- */
function Result({ decision, shelterName }: { decision: Decision; shelterName: string }) {
  const config = {
    approve: {
      badge: "Aprobada",
      title: "Refugio aprobado",
      text: `${shelterName} ahora está Activo. Su responsable recibió el rol de Admin de Refugio y se le notificó por correo y en su panel.`,
    },
    reject: {
      badge: "Rechazada",
      title: "Solicitud rechazada",
      text: "La solicitud quedó cerrada y el motivo se notificó al representante:",
    },
    info: {
      badge: "Información solicitada",
      title: "Se pidió más información",
      text: "La solicitud pasó a “Información adicional requerida”. El representante verá tu mensaje y podrá corregirla y reenviarla:",
    },
  }[decision.type];

  return (
    <div role="status" className="anim-fade-up">
      <span className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-extrabold">
        {config.badge}
      </span>
      <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">{config.title}</h2>
      <p className="mt-2 leading-7 text-ink/75">{config.text}</p>

      {decision.message && (
        <blockquote className="mt-4 rounded-2xl border-2 border-ink/80 bg-white p-4 leading-7">
          {decision.message}
        </blockquote>
      )}

      {/* Con backend, la solicitud sale de la lista de pendientes (RF-12). */}
      <Link to="/admin/solicitudes" className={`${primaryButtonClass} mt-6`}>
        Volver a solicitudes pendientes
      </Link>
    </div>
  );
}

/* ---------- Panel de decisión del Super Admin (RF-14, RF-15, RF-16) ---------- */
export default function DecisionPanel({ shelterName }: { shelterName: string }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);

  // Aquí se enviará la decisión al backend y se notificará al representante (RF-57).
  function decide(next: Decision) {
    setDecision(next);
  }

  return (
    <section
      aria-labelledby="decision-titulo"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <h2 id="decision-titulo" className="font-heading text-2xl font-bold">
        Decisión
      </h2>

      {decision ? (
        <div className="mt-4">
          <Result decision={decision} shelterName={shelterName} />
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Revisa los datos, los documentos y las fotos antes de decidir.
          </p>

          {mode === null && (
            <div className="mt-5 flex flex-col gap-3">
              <button type="button" onClick={() => setMode("approve")} className={primaryButtonClass}>
                Aprobar solicitud
              </button>
              <button type="button" onClick={() => setMode("info")} className={secondaryButtonClass}>
                Pedir más información
              </button>
              <button type="button" onClick={() => setMode("reject")} className={secondaryButtonClass}>
                Rechazar solicitud
              </button>
            </div>
          )}

          {mode === "approve" && (
            <div className="anim-fade-up mt-5">
              <p className="font-extrabold">¿Aprobar el registro de {shelterName}?</p>
              <p className="mt-2 text-sm leading-6 text-ink/75">
                El refugio pasará a Activo, su responsable recibirá el rol de Admin de Refugio y se
                le notificará.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => decide({ type: "approve" })}
                  className={primaryButtonClass}
                >
                  Sí, aprobar
                </button>
                <button type="button" onClick={() => setMode(null)} className={secondaryButtonClass}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {mode === "reject" && (
            <ReasonForm
              key="reject"
              id="motivo-rechazo"
              label="Motivo del rechazo"
              hint="Es obligatorio. El representante lo verá al iniciar sesión y por correo."
              emptyError="Escribe el motivo del rechazo para poder continuar."
              submitLabel="Rechazar solicitud"
              onSubmit={(message) => decide({ type: "reject", message })}
              onCancel={() => setMode(null)}
            />
          )}

          {mode === "info" && (
            <ReasonForm
              key="info"
              id="mensaje-informacion"
              label="¿Qué debe corregir o completar?"
              hint="Es obligatorio. El representante verá este mensaje y podrá reenviar su solicitud corregida."
              emptyError="Escribe qué debe corregir o completar el refugio para poder continuar."
              submitLabel="Pedir más información"
              onSubmit={(message) => decide({ type: "info", message })}
              onCancel={() => setMode(null)}
            />
          )}
        </>
      )}
    </section>
  );
}