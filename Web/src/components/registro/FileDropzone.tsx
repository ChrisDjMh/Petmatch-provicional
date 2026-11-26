import { useEffect, useState, type DragEvent, type Ref } from "react";

type FileDropzoneProps = {
  id: string;
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  /** Marca en rojo los archivos que no cumplen formato o tamaño. */
  isInvalid?: (file: File) => boolean;
  /** Texto de apoyo debajo de la zona, por ejemplo "Llevas 2 de 3 fotos". */
  status?: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function usePreviewUrl(file: File) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url;
}

function FileRow({ file, invalid, onRemove }: { file: File; invalid: boolean; onRemove: () => void }) {
  const url = usePreviewUrl(file);
  const extension = file.name.split(".").pop()?.slice(0, 4).toUpperCase() ?? "";
  return (
    <li
      className={`anim-error flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 ${
        invalid ? "ring-2 ring-ink" : ""
      }`}
    >
      {url ? (
        <img src={url} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cards-2 text-xs font-extrabold">
          {extension}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{file.name}</p>
        <p className="text-xs text-ink/60">
          {invalid && "⚠ Revisa este archivo · "}
          {formatSize(file.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar ${file.name}`}
        className="rounded-full px-3 py-1.5 text-sm font-extrabold text-ink/70 transition-colors hover:bg-cards-2/60 hover:text-ink"
      >
        Quitar
      </button>
    </li>
  );
}

function PhotoTile({ file, invalid, onRemove }: { file: File; invalid: boolean; onRemove: () => void }) {
  const url = usePreviewUrl(file);
  return (
    <li
      className={`anim-error relative aspect-square overflow-hidden rounded-2xl bg-white ${
        invalid ? "ring-2 ring-ink" : ""
      }`}
    >
      {url ? (
        <img src={url} alt={`Vista previa de ${file.name}`} className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center p-2 text-center text-xs font-bold">
          {file.name}
        </span>
      )}
      {invalid && (
        <span className="absolute inset-x-0 bottom-0 bg-ink px-2 py-1 text-xs font-bold text-background">
          ⚠ Revisa este archivo
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar ${file.name}`}
        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-ink/80 text-xs font-bold text-background transition hover:bg-ink"
      >
        ✕
      </button>
    </li>
  );
}

/* Zona para adjuntar archivos: clic o arrastrar, con vista previa y botón para quitar. */
export default function FileDropzone({
  id,
  label,
  hint,
  accept,
  multiple = false,
  files,
  onChange,
  onBlur,
  inputRef,
  error,
  isInvalid,
  status,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    if (!multiple) {
      onChange([incoming[0]]);
      return;
    }
    const seen = new Set(files.map(fileKey));
    onChange([...files, ...incoming.filter((file) => !seen.has(fileKey(file)))]);
  }

  function remove(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-extrabold">{label}</p>

      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed px-5 py-7 text-center transition-colors focus-within:border-ink ${
          dragging
            ? "border-ink bg-white"
            : error
              ? "border-ink bg-white/80"
              : "border-ink/35 bg-white/60 hover:bg-white"
        }`}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sr-only"
          onBlur={onBlur}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <svg
          viewBox="0 0 24 24"
          className="size-8 text-ink/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 16V5m0 0-4 4m4-4 4 4" />
          <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
        </svg>
        <span className="mt-1 font-extrabold">
          {multiple ? "Elige tus fotos" : files.length > 0 ? "Cambiar archivo" : "Elige un archivo"}
        </span>
        <span className="text-sm text-ink/65">o arrástralo aquí</span>
        <span className="mt-1 text-xs text-ink/55">{hint}</span>
      </label>

      {error ? (
        <p id={`${id}-error`} className="anim-error mt-2 text-sm font-bold">
          ⚠ {error}
        </p>
      ) : (
        status && <p className="mt-2 text-sm text-ink/65">{status}</p>
      )}

      {files.length > 0 &&
        (multiple ? (
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {files.map((file, index) => (
              <PhotoTile
                key={fileKey(file)}
                file={file}
                invalid={isInvalid?.(file) ?? false}
                onRemove={() => remove(index)}
              />
            ))}
          </ul>
        ) : (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <FileRow
                key={fileKey(file)}
                file={file}
                invalid={isInvalid?.(file) ?? false}
                onRemove={() => remove(index)}
              />
            ))}
          </ul>
        ))}
    </div>
  );
}