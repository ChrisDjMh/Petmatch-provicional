import { useRef, useState } from "react";
import type { RequestPhoto } from "@/data/solicitudesRegistro";

/* Imagen con recuadro de respaldo por si no carga. */
function SafeImage({ photo, className }: { photo: RequestPhoto; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={photo.alt}
        className={`${className} flex items-center justify-center bg-cards-2 px-3 text-center text-sm font-bold text-ink/60`}
      >
        Foto no disponible
      </div>
    );
  }
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
}

const iconButton =
  "flex size-11 items-center justify-center rounded-full bg-white text-lg font-bold text-ink transition hover:bg-accent";

/* Fotos del refugio: miniaturas que se abren en grande y se pueden descargar (RF-13). */
export default function PhotoGallery({ photos }: { photos: RequestPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const total = photos.length;
  const photo = photos[current];

  function open(index: number) {
    setCurrent(index);
    dialogRef.current?.showModal();
  }

  const go = (index: number) => setCurrent((index + total) % total);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((item, index) => (
          <li key={item.id} className="overflow-hidden rounded-2xl bg-white">
            <button
              type="button"
              onClick={() => open(index)}
              className="group block w-full"
              aria-label={`Ver en grande: ${item.alt}`}
            >
              <SafeImage
                photo={item}
                className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
              />
            </button>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-sm font-bold text-ink/70">Foto {index + 1}</span>
              <a
                href={item.src}
                download={item.fileName}
                className="text-sm font-extrabold underline underline-offset-4 hover:text-ink/70"
              >
                Descargar<span className="sr-only"> foto {index + 1}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Foto del refugio"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(92vw,56rem)] rounded-[2rem] bg-ink p-4 text-background backdrop:bg-ink/70 sm:p-6"
      >
        <SafeImage photo={photo} className="max-h-[65vh] w-full rounded-2xl" />
        <p className="mt-4 text-sm leading-6 text-background/85">{photo.alt}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-background/70">
            Foto {current + 1} de {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Foto anterior"
              className={iconButton}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Foto siguiente"
              className={iconButton}
            >
              →
            </button>
            <a
              href={photo.src}
              download={photo.fileName}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-ink transition hover:bg-white"
            >
              Descargar
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border-2 border-background/70 px-5 py-2 text-sm font-extrabold transition hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}