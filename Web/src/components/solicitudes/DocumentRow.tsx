import type { RequestDocument } from "@/data/solicitudesRegistro";

const primarySmall =
  "inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-background transition hover:bg-ink/85 active:scale-[0.98]";
const secondarySmall =
  "inline-flex items-center justify-center rounded-full border-2 border-ink/80 px-4 py-1.5 text-sm font-extrabold text-ink transition hover:bg-white/60 active:scale-[0.98]";

/* Un documento del registro, con opciones para verlo y descargarlo (RF-13). */
export default function DocumentRow({ doc }: { doc: RequestDocument }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
      <div className="min-w-0">
        <p className="font-extrabold">{doc.label}</p>
        <p className="mt-0.5 break-all text-sm text-ink/60">
          {doc.fileName} · {doc.format} · {doc.sizeLabel}
        </p>
      </div>
      <div className="flex gap-2">
        <a href={doc.url} target="_blank" rel="noreferrer" className={primarySmall}>
          Ver<span className="sr-only"> {doc.label}</span>
        </a>
        <a href={doc.url} download={doc.fileName} className={secondarySmall}>
          Descargar<span className="sr-only"> {doc.label}</span>
        </a>
      </div>
    </li>
  );
}