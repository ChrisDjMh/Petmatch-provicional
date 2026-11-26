import { Link, useSearchParams } from "react-router-dom";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { shelterRegistrationRequests } from "@/data/solicitudesRegistro";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const reviewButtonClass =
  "inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";

export default function PendingRequestsPage() {
  const [params] = useSearchParams();
  // Solo en desarrollo: ?vacio=1 muestra la pantalla sin solicitudes.
  const showEmpty = import.meta.env.DEV && params.get("vacio") === "1";

  // De la más antigua a la más reciente (RF-12).
  const requests = showEmpty
    ? []
    : [...shelterRegistrationRequests].sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
      );

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70" style={{ animationDelay: "100ms" }}>
            Registro de refugios
          </p>
          <h1
            style={{ animationDelay: "180ms" }}
            className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Solicitudes pendientes
          </h1>
          <p
            style={{ animationDelay: "260ms" }}
            className="anim-fade-up mt-3 max-w-xl text-base leading-7 text-ink/70"
          >
            Refugios que confirmaron su correo y esperan una decisión, de la más antigua a la más
            reciente.
          </p>
        </div>

        <span
          style={{ animationDelay: "260ms" }}
          className="anim-fade-up inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-extrabold"
        >
          {requests.length === 1 ? "1 pendiente" : `${requests.length} pendientes`}
        </span>
      </div>

      <section
        aria-label="Lista de solicitudes pendientes"
        style={{ animationDelay: "340ms" }}
        className="anim-fade-up mt-8 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {requests.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-2xl">
              ✓
            </span>
            <h2 className="mt-5 font-heading text-2xl font-bold">No hay solicitudes pendientes</h2>
            <p className="mx-auto mt-2 max-w-md leading-7 text-ink/70">
              Cuando un refugio confirme su correo y envíe su solicitud, aparecerá aquí.
            </p>
          </div>
        ) : (
          <>
            {/* Tabla en pantallas medianas y grandes */}
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">
                Solicitudes de registro de refugios pendientes de verificación
              </caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">
                    Refugio
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Ciudad
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Fecha de envío
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t border-ink/10">
                    <th scope="row" className="px-4 py-4 font-heading text-lg font-bold">
                      {request.shelterName}
                    </th>
                    <td className="px-4 py-4 font-semibold text-ink/80">{request.city}</td>
                    <td className="px-4 py-4 font-semibold text-ink/80">
                      {dateFormat.format(new Date(request.sentAt))}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/admin/solicitudes/${request.id}`} className={reviewButtonClass}>
                        Revisar
                        <span className="sr-only"> solicitud de {request.shelterName}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tarjetas en celular */}
            <ul className="space-y-3 md:hidden">
              {requests.map((request) => (
                <li key={request.id} className="rounded-2xl bg-white p-5">
                  <p className="font-heading text-xl font-bold">{request.shelterName}</p>
                  <p className="mt-1 text-sm font-semibold text-ink/70">{request.city}</p>
                  <p className="mt-0.5 text-sm text-ink/60">
                    Enviada el {dateFormat.format(new Date(request.sentAt))}
                  </p>
                  <Link
                    to={`/admin/solicitudes/${request.id}`}
                    className={`${reviewButtonClass} mt-4 w-full`}
                  >
                    Revisar
                    <span className="sr-only"> solicitud de {request.shelterName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Solo en desarrollo: alterna entre la lista y el estado vacío. */}
      {import.meta.env.DEV && (
        <nav
          aria-label="Vista previa (solo desarrollo)"
          className="mt-8 rounded-2xl border-2 border-dashed border-ink/40 p-4 text-sm"
        >
          <p className="font-extrabold">Vista previa (solo desarrollo)</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[
              { label: "Con solicitudes", to: "/admin/solicitudes", active: !showEmpty },
              { label: "Sin solicitudes", to: "/admin/solicitudes?vacio=1", active: showEmpty },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`rounded-full px-3 py-1.5 font-bold transition-colors ${
                    item.active ? "bg-ink text-background" : "bg-white/70 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </SuperAdminLayout>
  );
}