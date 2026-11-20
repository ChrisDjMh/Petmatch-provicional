import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-12 text-background sm:px-8 lg:px-12">
      <Reveal direction="fade">
      <div className="mx-auto max-w-[1344px]">
        <div className="flex flex-col justify-between gap-10 border-b border-background/20 pb-10 md:flex-row md:items-center">
          <div>
            <Link to="/" className="font-heading text-3xl font-bold">
              PetMatch
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-background/65">
              Tecnología que conecta refugios responsables con hogares listos para adoptar.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-bold sm:flex-row sm:gap-8">
            <a href="/aviso-de-privacidad" className="transition-colors hover:text-accent">
              Aviso de privacidad
            </a>
            <a href="mailto:hola@petmatch.mx" className="transition-colors hover:text-accent">
              hola@petmatch.mx
            </a>
          </div>
        </div>
        <p className="pt-7 text-xs text-background/50">
          © 2026 PetMatch. Todos los derechos reservados.
        </p>
      </div>
      </Reveal>
    </footer>
  );
}