import { useEffect, useRef } from "react";

export type ViewerFile = {
  title: string;
  url: string;
  fileName: string;
  kind: "pdf" | "image";
};

/* Ventana para ver un documento (PDF) o una foto sin salir de la pantalla. Usa <dialog> nativo:
   atrapa el foco, se cierra con Esc y regresa el foco al botón que la abrió. */
export default function FileViewerDialog({
  file,
  onClose,
}: {
  file: ViewerFile | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (file && !dialog.open) dialog.showModal();
    if (!file && dialog.open) dialog.close();
  }, [file]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // Clic en el fondo oscuro (fuera del contenido) cierra la ventana.
        if (event.target === ref.current) onClose();
      }}
      aria-label={file ? `Vista de ${file.title}` : undefined}
      className="m-auto w-[min(60rem,calc(100vw-2rem))] max-w-none rounded-[2rem] bg-white p-0 text-ink shadow-soft backdrop:bg-ink/60"
    >
      {file && (
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
            <h2 className="font-heading text-xl font-bold">{file.title}</h2>
            <div className="flex gap-2">
              <a
                href={file.url}
                download={file.fileName}
                className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-extrabold transition-colors hover:bg-accent-warm"
              >
                Descargar
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-background transition hover:bg-ink/85"
              >
                Cerrar
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-6">
            {file.kind === "pdf" ? (
              <iframe
                src={file.url}
                title={file.title}
                className="h-[70vh] w-full rounded-2xl border-0 bg-cards-2/30"
              />
            ) : (
              <img
                src={file.url}
                alt={file.title}
                className="mx-auto max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
              />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
