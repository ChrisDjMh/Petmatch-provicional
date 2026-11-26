import { Link, useParams } from "react-router-dom";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import { getContract } from "@/data/contratos";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

const backLinkClass = "inline-flex items-center gap-2 text-sm font-extrabold underline-offset-4 hover:underline";

function Party({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <dl className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">{row.label}</dt>
            <dd className="mt-0.5 break-words font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function ContractPage() {
  const { id = "" } = useParams();
  const contract = getContract(id);

  if (!contract) {
    return (
      <ShelterAdminLayout>
        <div role="status" className="rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft">
          <h1 className="font-heading text-3xl font-bold">Este contrato aún no está disponible</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-ink/70">
            Primero hay que aprobar la solicitud y generar el contrato desde su detalle.
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

  return (
    <ShelterAdminLayout>
      <Link to={`/refugio/adopciones/${id}`} className={backLinkClass}>
        <span aria-hidden="true">←</span> Volver a la solicitud
      </Link>

      <article
        aria-labelledby="contract-heading"
        className="anim-fade-up mx-auto mt-6 max-w-3xl rounded-[2rem] bg-white p-8 shadow-soft sm:p-12"
      >
        <header className="border-b border-ink/10 pb-6">
          <p className="eyebrow text-ink/60">PetMatch · Registro digital</p>
          <h1 id="contract-heading" className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Contrato de adopción
          </h1>
          <p className="mt-3 text-sm font-semibold text-ink/70">
            N.º {contract.number} · Generado el {dateFormat.format(new Date(contract.generatedAt))}
          </p>
        </header>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <Party
            title="Refugio"
            rows={[
              { label: "Nombre", value: contract.shelter.name },
              { label: "Responsable", value: contract.shelter.responsible },
              { label: "Dirección", value: `${contract.shelter.address}, ${contract.shelter.city}` },
            ]}
          />
          <Party
            title="Adoptante"
            rows={[
              { label: "Nombre", value: contract.adopter.name },
              { label: "Correo", value: contract.adopter.email },
              {
                label: "Hogar",
                value: `${contract.adopter.housingType} · ${contract.adopter.householdSize} ${
                  contract.adopter.householdSize === 1 ? "persona" : "personas"
                }`,
              },
            ]}
          />
        </div>

        <div className="mt-8">
          <Party
            title="Mascota"
            rows={[
              { label: "Nombre", value: contract.pet.name },
              {
                label: "Datos",
                value: `${contract.pet.species} · ${contract.pet.size} · ${contract.pet.sex} · ${contract.pet.age}`,
              },
            ]}
          />
        </div>

        <section className="mt-8" aria-labelledby="conditions-title">
          <h2 id="conditions-title" className="font-heading text-xl font-bold">
            Condiciones de adopción
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-6 leading-7 text-ink/85">
            {contract.conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ol>
          <p className="mt-4 rounded-2xl bg-accent px-5 py-3 text-sm font-bold">
            {contract.acceptsFollowUp
              ? `${contract.adopter.name} aceptó el seguimiento post-adopción al enviar su solicitud.`
              : "El adoptante no aceptó el seguimiento post-adopción."}
          </p>
        </section>

        <footer className="mt-10 rounded-2xl bg-cards-2/40 p-5 text-sm leading-6 text-ink/80">
          <strong>Aviso:</strong> este contrato es un registro digital dentro de PetMatch. No requiere firma
          y no tiene validez legal.
        </footer>
      </article>
    </ShelterAdminLayout>
  );
}