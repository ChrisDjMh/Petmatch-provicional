import { Link } from "react-router-dom";
import heroImage from "@/assets/petmatch-hero.png";
import InfoCard from "./InfoCard";

const iconClass = "size-7";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative min-h-[760px] overflow-hidden rounded-b-[2.5rem] bg-accent-warm sm:min-h-[800px] lg:min-h-[760px] lg:rounded-b-[4rem]">
        <img
          src={heroImage}
          alt="Gato descansando en un hogar acogedor"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(46,40,54,0.92)_0%,rgba(46,40,54,0.66)_38%,rgba(46,40,54,0.08)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/40 to-transparent" />

        <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] items-center px-5 pb-28 pt-32 sm:px-8 lg:px-12 lg:pb-20">
          <div className="max-w-2xl text-background">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] backdrop-blur-md">
              <span className="size-2 rounded-full bg-accent" />
              Adopciones con propósito
            </p>
            <h1 className="font-heading text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[5.4rem]">
              Cada mascota merece un hogar
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-background/85 sm:text-xl sm:leading-8">
              La plataforma que ayuda a refugios a encontrar familias compatibles, gestionar
              adopciones y acompañar cada nueva historia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/registro-refugio" className="button-light justify-center">
                Registrar mi refugio
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-background/50 px-6 py-3.5 font-extrabold text-background transition-colors hover:bg-background hover:text-ink"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-20 grid max-w-[1240px] gap-4 px-5 sm:px-8 md:grid-cols-3 lg:-mt-24">
        <InfoCard
          title="Para refugios"
          icon={
            <svg
              viewBox="0 0 32 32"
              className={iconClass}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 15.5 16 6l11 9.5V27H5V15.5Z" />
              <path d="M12 27v-7h8v7M11 13h10" />
            </svg>
          }
        >
          Publica tus mascotas, conoce a los candidatos y gestiona cada adopción con claridad.
        </InfoCard>
        <InfoCard
          accent
          title="Para adoptantes"
          icon={
            <svg
              viewBox="0 0 32 32"
              className={iconClass}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="8" y="3" width="16" height="26" rx="4" />
              <path d="M13 7h6M14 25h4" />
              <path d="M16 20s-5-3.2-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 21 13c0 3.8-5 7-5 7Z" />
            </svg>
          }
        >
          Descarga la app Android, completa tu perfil y encuentra a tu mascota compatible.
        </InfoCard>
        <InfoCard
          title="Seguimiento"
          icon={
            <svg
              viewBox="0 0 32 32"
              className={iconClass}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="16" cy="16" r="12" />
              <path d="M16 9v7l5 3M7 7l3 3M25 7l-3 3" />
            </svg>
          }
        >
          Acompañamos la adaptación con cinco hitos: 7, 30, 90, 180 y 365 días después de adoptar.
        </InfoCard>
      </div>
    </section>
  );
}
