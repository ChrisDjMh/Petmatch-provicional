import { useRef, useState } from "react";
import Reveal from "@/components/compartidos/Reveal";
import Section from "@/components/compartidos/Section";
/* ============================================================================
   CÓMO CAMBIAR LAS IMÁGENES DEL CARRUSEL
   ----------------------------------------------------------------------------
   1. Guarda tus fotos en la carpeta  public/pasos/  (créala si no existe).
      Ejemplo: public/pasos/paso-1.jpg, public/pasos/paso-2.jpg, ...
   2. En el arreglo STEP_IMAGES de abajo, cambia el valor de "src" por la ruta
      de tu foto, empezando con "/":  src: "/pasos/paso-1.jpg"
   3. Cambia también el "alt": una frase corta que describa la foto (accesibilidad).
   4. El orden importa: la imagen 1 va con el paso 1, la 2 con el paso 2, etc.
   5. Medida recomendada: horizontal, 1600 × 800 px (proporción 2:1), JPG o WebP,
      de preferencia menos de 300 KB cada una.
   6. Si quieres más o menos pasos, agrega o quita un objeto en STEP_IMAGES y
      otro en STEPS (más abajo). Deben quedar con la misma cantidad.
   ========================================================================== */
const STEP_IMAGES: { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=1600&q=80",
    alt: "Perro sonriendo a la cámara",
  },
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80",
    alt: "Perro dorado recostado en el pasto",
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1600&q=80",
    alt: "Gato mirando con curiosidad",
  },
  {
    src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80",
    alt: "Perro con la lengua de fuera",
  },
  {
    src: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1600&q=80",
    alt: "Gato descansando en un sillón",
  },
];

/* Textos de cada paso (mismo orden que las imágenes). */
const STEPS: { title: string; text: string }[] = [
  {
    title: "Llena el formulario",
    text: "Captura los datos de tu refugio y del responsable: nombre, correo, teléfono, ciudad, dirección y descripción, además de tu correo y contraseña de acceso.",
  },
  {
    title: "Adjunta tus documentos",
    text: "Sube la identificación oficial del responsable, el comprobante de domicilio, un documento que respalde al refugio y al menos 3 fotos. Formatos PDF, JPG o PNG de hasta 5 MB.",
  },
  {
    title: "Confirma tu correo",
    text: "Te enviamos un enlace de un solo uso con vigencia de 1 hora. Mientras no lo confirmes, tu solicitud no llega a revisión.",
  },
  {
    title: "Espera la revisión",
    text: "El equipo de PetMatch revisa tus datos y archivos. Puede aprobar, rechazar con un motivo o pedirte información adicional. Inicia sesión para ver el estado de tu solicitud.",
  },
  {
    title: "Publica tus mascotas",
    text: "Con tu refugio aprobado, vincula tu cuenta de Stripe para recibir donaciones y publica tus mascotas con sus requisitos de adopción.",
  },
];

export default function ShelterSteps() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = STEPS.length;
  const go = (index: number) => setCurrent((index + total) % total);

  return (
    <Section id="como-funciona" className="pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Registro paso a paso</p>
          <h2 className="section-title mt-4">Registra tu refugio en cinco pasos</h2>
        </div>
        <p className="max-w-md text-base leading-7 text-ink/70">
          Del formulario a tu primera mascota publicada: así es el camino para que tu refugio
          forme parte de PetMatch.
        </p>
      </Reveal>

      <Reveal delay={150}>
      <div role="group" aria-roledescription="carrusel" aria-label="Pasos para registrar tu refugio">
        <p className="sr-only" aria-live="polite">
          Paso {current + 1} de {total}: {STEPS[current].title}
        </p>

        <div
          className="relative overflow-hidden bg-cards-2"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {STEPS.map((step, index) => {
              const image = STEP_IMAGES[index];
              return (
                <div
                  key={step.title}
                  role="group"
                  aria-roledescription="diapositiva"
                  aria-label={`${index + 1} de ${total}`}
                  aria-hidden={index !== current}
                  className="relative aspect-[4/5] w-full shrink-0 sm:aspect-[16/9] lg:aspect-[2/1]"
                >
                  {image && (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/40 to-transparent" />

                  <div className="absolute inset-y-0 left-0 flex items-center p-4 sm:p-8 lg:p-12">
                    <div
                      className={`max-w-sm border border-background/30 bg-background/15 p-6 text-background backdrop-blur-md transition-all duration-700 ease-out sm:p-8 ${
                        index === current
                          ? "translate-x-0 opacity-100 delay-300"
                          : "-translate-x-8 opacity-0"
                      }`}
                    >
                    <div className="flex items-center gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-ink sm:size-11 sm:text-xl">
                        {index + 1}
                        </span>
                        <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                        {step.title}
                        </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-background/90 sm:text-base">
                        {step.text}
                    </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Paso anterior"
              className="flex size-11 items-center justify-center rounded-full bg-background/90 text-lg font-bold text-ink transition hover:scale-110 hover:bg-background active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Paso siguiente"
              className="flex size-11 items-center justify-center rounded-full bg-accent text-lg font-bold text-ink transition hover:scale-110 hover:bg-background active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        <ol
          className="mt-5 grid gap-2 sm:gap-4"
          style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
        >
          {STEPS.map((step, index) => {
            const active = index === current;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => go(index)}
                  aria-current={active ? "step" : undefined}
                  className={`w-full border-t-4 pt-3 text-left transition-colors ${
                    active ? "border-ink" : "border-ink/15 hover:border-cards"
                  }`}
                >
                  <span
                    className={`font-heading text-lg font-bold ${active ? "text-ink" : "text-cards"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`hidden text-sm font-bold sm:block ${active ? "text-ink" : "text-ink/60"}`}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <a href="/registro-refugio" className="button-primary mt-10 inline-flex">
          Registrar mi refugio
          <span aria-hidden="true">→</span>
        </a>
      </div>
      </Reveal>
    </Section>
  );
}