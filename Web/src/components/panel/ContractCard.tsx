import { useState } from "react";
import { Link } from "react-router-dom";
import { generateContract, getContractDate } from "@/data/contratos";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

/* Paso siguiente de una solicitud aprobada: generar el contrato (RF-38) y abrirlo. */
export default function ContractCard({ requestId, adopter }: { requestId: string; adopter: string }) {
  const [generatedAt, setGeneratedAt] = useState(getContractDate(requestId));
  const [justCreated, setJustCreated] = useState(false);

  return (
    <section
      aria-labelledby="contract-title"
      className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      <h2 id="contract-title" className="font-heading text-2xl font-bold">
        Contrato de adopción
      </h2>

      {generatedAt ? (
        <>
          <p role="status" className="mt-2 text-sm leading-6 text-ink/75">
            {justCreated
              ? `Contrato generado. Se avisó a ${adopter} en su teléfono y ya puede consultarlo en la app.`
              : `Generado el ${dateFormat.format(new Date(generatedAt))}. ${adopter} puede consultarlo en la app.`}
          </p>
          <Link
            to={`/refugio/adopciones/${requestId}/contrato`}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85"
          >
            Ver contrato
          </Link>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            Genera el contrato con los datos del adoptante, de la mascota y del refugio. Es un registro
            digital: no requiere firma ni tiene validez legal.
          </p>
          <button
            type="button"
            onClick={() => {
              setGeneratedAt(generateContract(requestId));
              setJustCreated(true);
            }}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]"
          >
            Generar contrato
          </button>
        </>
      )}
    </section>
  );
}