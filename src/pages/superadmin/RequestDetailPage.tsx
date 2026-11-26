import { Link, useParams } from "react-router-dom";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import DecisionPanel from "@/components/solicitudes/DecisionPanel";
import DocumentRow from "@/components/solicitudes/DocumentRow";
import PhotoGallery from "@/components/solicitudes/PhotoGallery";
import { findRegistrationRequest } from "@/data/solicitudesRegistro";
import { primaryButtonClass } from "@/components/auth/styles";

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const cardClass = "rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8";

function BackLink() {
  return (
    <Link
      to="/admin/solicitudes"
      className="inline-flex items-center gap-2 text-sm font-extrabold underline-offset-4 hover:underline"
    >
      <span aria-hidden="true">←</span> Volver a solicitudes pendientes
    </Link>
  );
}

function DataItem({ label, children, wide = false }: { label: string; children: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">{label}</dt>
      <dd className="mt-1 font-semibold leading-7">{children}</dd>
    </div>
  );
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const request = findRegistrationRequest(id);

  if (!request) {
    return (
      <SuperAdminLayout>
        <BackLink />
        <section className={`${cardClass} mt-6 text-center`}>
          <h1 className="font-heading text-3xl font-bold">No encontramos esta solicitud</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-ink/70">
            Puede que ya se haya resuelto o que el enlace no sea correcto.
          </p>
          <Link to="/admin/solicitudes" className={`${primaryButtonClass} mx-auto mt-6 max-w-xs`}>
            Ver solicitudes pendientes
          </Link>
        </section>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="anim-fade-up" style={{ animationDelay: "60ms" }}>
        <BackLink />
      </div>

      <header className="mt-5">
        <p className="anim-fade-up eyebrow text-ink/70" style={{ animationDelay: "100ms" }}>
          Solicitud de registro
        </p>
        <h1
          style={{ animationDelay: "180ms" }}
          className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          {request.shelterName}
        </h1>
        <div
          style={{ animationDelay: "260ms" }}
          className="anim-fade-up mt-4 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-extrabold">
            Pendiente de verificación
          </span>
          <span className="text-sm font-semibold text-ink/70">
            Enviada el {dateFormat.format(new Date(request.sentAt))} · {request.city}
          </span>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <section
            aria-labelledby="datos-titulo"
            style={{ animationDelay: "320ms" }}
            className={`anim-fade-up ${cardClass}`}
          >
            <h2 id="datos-titulo" className="font-heading text-2xl font-bold">
              Datos de la solicitud
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <DataItem label="Refugio">{request.shelterName}</DataItem>
              <DataItem label="Ciudad">{request.city}</DataItem>
              <DataItem label="Responsable">{request.responsible}</DataItem>
              <DataItem label="Correo del responsable">{request.email}</DataItem>
              <DataItem label="Teléfono">{request.phone}</DataItem>
              <DataItem label="Dirección" wide>
                {request.address}
              </DataItem>
              <DataItem label="Descripción" wide>
                {request.description}
              </DataItem>
            </dl>
          </section>

          <section
            aria-labelledby="documentos-titulo"
            style={{ animationDelay: "400ms" }}
            className={`anim-fade-up ${cardClass}`}
          >
            <h2 id="documentos-titulo" className="font-heading text-2xl font-bold">
              Documentos
            </h2>
            <p className="mt-1 text-sm text-ink/65">
              Puedes abrirlos en otra pestaña o descargarlos.
            </p>
            <ul className="mt-5 space-y-3">
              {request.documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="fotos-titulo"
            style={{ animationDelay: "480ms" }}
            className={`anim-fade-up ${cardClass}`}
          >
            <h2 id="fotos-titulo" className="font-heading text-2xl font-bold">
              Fotos del refugio
            </h2>
            <p className="mt-1 text-sm text-ink/65">
              {request.photos.length} fotos. Toca una para verla en grande.
            </p>
            <div className="mt-5">
              <PhotoGallery photos={request.photos} />
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-6">
          <DecisionPanel shelterName={request.shelterName} />
        </div>
      </div>
    </SuperAdminLayout>
  );
}