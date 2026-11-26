import { useState } from "react";
import FileViewerDialog, { type ViewerFile } from "@/components/panel/FileViewerDialog";
import type { RequestDocument, RequestPhoto } from "@/data/solicitudesRegistro";

const sizeLabel = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

const secondaryAction =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold transition-colors";

/* Documentos y fotos de la solicitud: cada archivo se puede ver en pantalla o descargar (RF-13). */
export default function RequestFiles({
  documents,
  photos,
}: {
  documents: RequestDocument[];
  photos: RequestPhoto[];
}) {
  const [viewing, setViewing] = useState<ViewerFile | null>(null);

  return (
    <>
      <section aria-labelledby="docs-title">
        <h2 id="docs-title" className="font-heading text-2xl font-bold">
          Documentos
        </h2>
        <ul className="mt-4 space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4"
            >
              <div className="min-w-0">
                <p className="font-extrabold">{doc.kind}</p>
                <p className="truncate text-sm text-ink/65">
                  {doc.fileName} · PDF · {sizeLabel(doc.sizeKb)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewing({ title: doc.kind, url: doc.url, fileName: doc.fileName, kind: "pdf" })
                  }
                  className={`${secondaryAction} bg-ink text-background hover:bg-ink/85`}
                >
                  Ver<span className="sr-only"> {doc.kind}</span>
                </button>
                <a
                  href={doc.url}
                  download={doc.fileName}
                  className={`${secondaryAction} bg-accent hover:bg-accent-warm`}
                >
                  Descargar<span className="sr-only"> {doc.kind}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="photos-title" className="mt-10">
        <h2 id="photos-title" className="font-heading text-2xl font-bold">
          Fotos del refugio <span className="text-ink/50">({photos.length})</span>
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-2xl bg-white">
              <button
                type="button"
                onClick={() =>
                  setViewing({
                    title: `Foto ${index + 1} del refugio`,
                    url: photo.url,
                    fileName: photo.fileName,
                    kind: "image",
                  })
                }
                className="group block w-full"
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1} del refugio`}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-xs font-bold text-ink/65">{sizeLabel(photo.sizeKb)}</span>
                <a
                  href={photo.url}
                  download={photo.fileName}
                  className="text-sm font-extrabold underline underline-offset-4 hover:text-ink/70"
                >
                  Descargar<span className="sr-only"> foto {index + 1}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <FileViewerDialog file={viewing} onClose={() => setViewing(null)} />
    </>
  );
}
