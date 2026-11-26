import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PanelHeader from "@/components/panel/PanelHeader";
import { primaryButtonClass } from "@/components/auth/styles";

/* Datos de ejemplo. Cuando haya backend se reemplazan por los de la solicitud real. */
const DEMO = {
  shelterName: "Huellitas del Norte",
  city: "Hermosillo",
  responsible: "María López",
  email: "maria@correo.com",
  sentOn: "18 de noviembre de 2026",
  moreInfoMessage:
    "El comprobante de domicilio se ve borroso y no se alcanza a leer la dirección. Sube una foto o un PDF más claro y reenvía tu solicitud.",
  rejectionReason:
    "El documento que respalda la existencia del refugio no corresponde a la organización registrada.",
  suspensionReason:
    "Falta actualizar la dirección del refugio y los datos de contacto. Corrígelos para reactivar tu cuenta.",
};

/* Estados del refugio (RN-01). */
type StatusKey = "correo" | "pendiente" | "informacion" | "rechazado" | "activo" | "suspendido";

const STATUS_KEYS: StatusKey[] = [
  "correo",
  "pendiente",
  "informacion",
  "rechazado",
  "activo",
  "suspendido",
];

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons = {
  mail: (
    <Svg>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 8 6 8-6" />
    </Svg>
  ),
  clock: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  edit: (
    <Svg>
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </Svg>
  ),
  cross: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </Svg>
  ),
  check: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.8 2.8L16.5 9.5" />
    </Svg>
  ),
  pause: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6M14 9v6" />
    </Svg>
  ),
};

type StatusConfig = {
  label: string;
  title: string;
  badgeClass: string;
  icon: ReactNode;
  reasonTitle?: string;
  reasonText?: string;
};

const STATUSES: Record<StatusKey, StatusConfig> = {
  correo: {
    label: "Correo por confirmar",
    title: "Confirma tu correo para continuar",
    badgeClass: "bg-accent text-ink",
    icon: icons.mail,
  },
  pendiente: {
    label: "Pendiente de verificación",
    title: "Tu solicitud está en revisión",
    badgeClass: "bg-accent text-ink",
    icon: icons.clock,
  },
  informacion: {
    label: "Información adicional requerida",
    title: "Necesitamos que corrijas o completes algo",
    badgeClass: "bg-accent-warm text-ink",
    icon: icons.edit,
    reasonTitle: "Qué debes corregir",
    reasonText: DEMO.moreInfoMessage,
  },
  rechazado: {
    label: "Rechazada",
    title: "Tu solicitud no fue aprobada",
    badgeClass: "bg-ink text-background",
    icon: icons.cross,
    reasonTitle: "Motivo del rechazo",
    reasonText: DEMO.rejectionReason,
  },
  activo: {
    label: "Activo",
    title: "¡Tu refugio fue aprobado!",
    badgeClass: "bg-cards text-ink",
    icon: icons.check,
  },
  suspendido: {
    label: "Suspendido",
    title: "Tu refugio está suspendido",
    badgeClass: "bg-ink text-background",
    icon: icons.pause,
    reasonTitle: "Motivo de la suspensión",
    reasonText: DEMO.suspensionReason,
  },
};

/* Pasos de la barra de progreso. Suspendido no la muestra. */
const STEP_LABELS = ["Correo confirmado", "En revisión", "Decisión"];
type StepState = "done" | "current" | "upcoming" | "rejected";

function stepState(status: StatusKey, index: number): StepState {
  switch (status) {
    case "correo":
      return index === 0 ? "current" : "upcoming";
    case "pendiente":
    case "informacion":
      return index === 0 ? "done" : index === 1 ? "current" : "upcoming";
    case "rechazado":
      return index === 2 ? "rejected" : "done";
    default:
      return "done";
  }
}

const stepCircle: Record<StepState, string> = {
  done: "bg-ink text-background",
  current: "border-2 border-ink bg-white text-ink",
  upcoming: "bg-white/60 text-ink/50",
  rejected: "bg-ink text-background",
};

const stepText: Record<StepState, string> = {
  done: "completado",
  current: "paso actual",
  upcoming: "pendiente",
  rejected: "no aprobado",
};

function Stepper({ status }: { status: StatusKey }) {
  return (
    <ol className="mt-8 flex" aria-label="Progreso de tu solicitud">
      {STEP_LABELS.map((label, index) => {
        const state = stepState(status, index);
        const last = index === STEP_LABELS.length - 1;
        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className="relative flex-1 text-center"
          >
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-4 h-0.5 w-full ${
                  stepState(status, index + 1) === "upcoming" ? "bg-ink/20" : "bg-ink"
                }`}
              />
            )}
            <span
              className={`relative z-10 mx-auto flex size-8 items-center justify-center rounded-full text-sm font-extrabold ${stepCircle[state]}`}
            >
              {state === "done" ? "✓" : state === "rejected" ? "✕" : index + 1}
            </span>
            <span className="mt-2 block px-1 text-xs font-bold leading-4 text-ink/80 sm:text-sm">
              {label}
              <span className="sr-only"> ({stepText[state]})</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Description({ status }: { status: StatusKey }) {
  switch (status) {
    case "correo":
      return (
        <p>
          Te enviamos un enlace a <strong className="break-all">{DEMO.email}</strong>. Es de un solo
          uso y vence en 1 hora. Mientras no lo confirmes, tu solicitud no llega al equipo de
          PetMatch.
        </p>
      );
    case "pendiente":
      return (
        <p>
          El equipo de PetMatch está revisando tus datos, documentos y fotos. Te avisaremos por
          correo y aquí mismo cuando haya una decisión. No necesitas hacer nada por ahora.
        </p>
      );
    case "informacion":
      return (
        <p>
          Revisa el mensaje del equipo, haz los cambios y reenvía tu solicitud. Volverá a quedar en
          revisión.
        </p>
      );
    case "rechazado":
      return (
        <p>
          El equipo revisó tu solicitud y decidió no aprobarla. La solicitud quedó cerrada y tu
          refugio no puede publicar mascotas.
        </p>
      );
    case "activo":
      return (
        <p>
          Ya eres Administrador de tu refugio. Puedes publicar tus mascotas, recibir solicitudes de
          adopción y vincular tu cuenta de Stripe para recibir donaciones.
        </p>
      );
    case "suspendido":
      return (
        <p>
          Mientras dure la suspensión, tu refugio y sus mascotas no aparecen en la app y no recibes
          solicitudes ni donaciones nuevas. Tu información y tu historial se conservan.
        </p>
      );
  }
}

function Actions({ status }: { status: StatusKey }) {
  switch (status) {
    case "correo":
      return (
        <button
          type="button"
          // Aquí se reenviará el correo de confirmación (RF-02).
          className={primaryButtonClass}
        >
          Reenviar correo de confirmación
        </button>
      );
    case "informacion":
      return (
        <button
          type="button"
          // Aquí se abrirá el formulario para corregir los datos o documentos y reenviar (RF-16).
          className={primaryButtonClass}
        >
          Corregir y reenviar solicitud
        </button>
      );
    case "activo":
      return (
        // Ruta del panel del Admin de Refugio, pendiente de crear.
        <Link to="/panel" className={primaryButtonClass}>
          Ir al panel de mi refugio
        </Link>
      );
    default:
      return null;
  }
}

export default function ShelterRequestStatusPage() {
  const [params] = useSearchParams();
  const requested = params.get("estado") as StatusKey | null;
  // Mientras no haya backend, el estado se elige con ?estado=... (por defecto: pendiente).
  const status: StatusKey = requested && STATUS_KEYS.includes(requested) ? requested : "pendiente";
  const config = STATUSES[status];
  const action = <Actions status={status} />;
  const hasAction = ["correo", "informacion", "activo"].includes(status);

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-cards to-cards-2 text-ink">
      <PanelHeader userLabel={`Representante · ${DEMO.responsible}`} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-4 sm:px-10">
        <p className="anim-fade-up eyebrow text-ink/70" style={{ animationDelay: "100ms" }}>
          Mi solicitud
        </p>
        <h1
          style={{ animationDelay: "180ms" }}
          className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Estado de tu solicitud
        </h1>
        <p
          style={{ animationDelay: "260ms" }}
          className="anim-fade-up mt-3 text-base leading-7 text-ink/70"
        >
          Registro del refugio <strong>{DEMO.shelterName}</strong>
        </p>

        <section
          key={status}
          aria-live="polite"
          style={{ animationDelay: "340ms" }}
          className="anim-fade-up mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-10"
        >
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${config.badgeClass}`}
          >
            {config.icon}
            {config.label}
          </span>

          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {config.title}
          </h2>
          <div className="mt-3 text-base leading-7 text-ink/75">
            <Description status={status} />
          </div>

          {config.reasonText && (
            <div className="mt-6 rounded-2xl border-2 border-ink/80 bg-white p-5">
              <p className="text-sm font-extrabold">{config.reasonTitle}</p>
              <p className="mt-2 leading-7">{config.reasonText}</p>
              <p className="mt-3 text-xs text-ink/55">Mensaje del equipo de PetMatch</p>
            </div>
          )}

          {status !== "suspendido" && <Stepper status={status} />}

          {hasAction && <div className="mt-8 max-w-sm">{action}</div>}

          {(status === "rechazado" || status === "suspendido") && (
            <p className="mt-8 text-sm leading-6 text-ink/70">
              ¿Tienes dudas? Escríbenos a{" "}
              <a
                href="mailto:hola@petmatch.mx"
                className="font-extrabold text-ink underline underline-offset-4"
              >
                hola@petmatch.mx
              </a>
              .
            </p>
          )}
        </section>

        <section
          aria-labelledby="datos-solicitud"
          style={{ animationDelay: "440ms" }}
          className="anim-fade-up mt-6 rounded-[2rem] bg-white/50 p-6 sm:p-8"
        >
          <h2 id="datos-solicitud" className="font-heading text-2xl font-bold">
            Datos de tu solicitud
          </h2>
          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              ["Refugio", DEMO.shelterName],
              ["Ciudad", DEMO.city],
              ["Responsable", DEMO.responsible],
              ["Correo de acceso", DEMO.email],
              ["Fecha de envío", DEMO.sentOn],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  {term}
                </dt>
                <dd className="mt-1 break-words font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Solo en desarrollo: cambia el estado para revisar cada pantalla. */}
        {import.meta.env.DEV && (
          <nav
            aria-label="Vista previa de estados (solo desarrollo)"
            className="mt-8 rounded-2xl border-2 border-dashed border-ink/40 p-4 text-sm"
          >
            <p className="font-extrabold">Vista previa de estados (solo desarrollo)</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {STATUS_KEYS.map((key) => (
                <li key={key}>
                  <Link
                    to={`/mi-solicitud?estado=${key}`}
                    className={`rounded-full px-3 py-1.5 font-bold transition-colors ${
                      key === status ? "bg-ink text-background" : "bg-white/70 hover:bg-white"
                    }`}
                  >
                    {key}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>
    </div>
  );
}