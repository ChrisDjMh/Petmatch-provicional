import type { Ref } from "react";

/* Selector de fotos de una mascota (RF-20, RF-21): de 1 a 5, JPG o PNG, máximo 5 MB cada una.
   Muestra tanto las fotos que la mascota ya tiene (al editar) como las nuevas que se agregan. La primera es la
   principal, y cualquier otra se puede mover al primer lugar. */

export const MAX_PET_PHOTOS = 5;
export const MIN_PET_PHOTOS = 1;
export const PET_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PET_PHOTO_TYPES = ["image/jpeg", "image/png"];
export const PET_PHOTO_ACCEPT = ".jpg,.jpeg,.png";

export type PetPhotoItem = {
  id: string;
  /** Dirección para mostrarla: una URL guardada o la vista previa de un archivo nuevo. */
  url: string;
  name: string;
  /** Solo las fotos nuevas traen archivo; las que ya estaban guardadas no. */
  file?: File;
};

/** Mensaje en español si la foto nueva no cumple el formato o el tamaño; null si está bien. */
export function photoProblem(item: PetPhotoItem): string | null {
  const file = item.file;
  if (!file) return null;
  if (!PET_PHOTO_TYPES.includes(file.type)) {
    return `«${file.name}» no tiene un formato válido. Sube una foto JPG o PNG.`;
  }
  if (file.size > PET_PHOTO_MAX_BYTES) {
    return `«${file.name}» pesa más de 5 MB. Sube una versión más ligera.`;
  }
  return null;
}

let counter = 0;
function newId() {
  counter += 1;
  return `foto-nueva-${Date.now()}-${counter}`;
}

/** Convierte las fotos que ya tiene una mascota (URLs) en elementos del selector. */
export function itemsFromUrls(urls: string[]): PetPhotoItem[] {
  return urls.map((url, index) => ({ id: `foto-guardada-${index}-${url}`, url, name: `Foto ${index + 1}` }));
}

type PetPhotoPickerProps = {
  id: string;
  items: PetPhotoItem[];
  onChange: (items: PetPhotoItem[]) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
};

export default function PetPhotoPicker({ id, items, onChange, onBlur, inputRef, error }: PetPhotoPickerProps) {
  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const added: PetPhotoItem[] = Array.from(list).map((file) => ({
      id: newId(),
      // La vista previa no se libera: la mascota guardada sigue usando esta dirección mientras la página
      // esté abierta. Con backend se sube el archivo y se guarda la URL de Storage.
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    onChange([...items, ...added]);
  }

  function remove(photoId: string) {
    onChange(items.filter((item) => item.id !== photoId));
  }

  function makeMain(photoId: string) {
    const chosen = items.find((item) => item.id === photoId);
    if (!chosen) return;
    onChange([chosen, ...items.filter((item) => item.id !== photoId)]);
  }

  const full = items.length >= MAX_PET_PHOTOS;
  const describedBy = error ? `${id}-error` : `${id}-status`;

  return (
    <div>
      <p className="mb-2 text-sm font-extrabold">Fotos de la mascota</p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => {
          const problem = photoProblem(item);
          return (
            <li
              key={item.id}
              className={`anim-error relative aspect-square overflow-hidden rounded-2xl bg-white ${
                problem ? "ring-2 ring-ink" : ""
              }`}
            >
              <img src={item.url} alt={`Vista previa de ${item.name}`} className="size-full object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Quitar ${item.name}`}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-ink/80 text-xs font-bold text-background transition hover:bg-ink"
              >
                ✕
              </button>
              {problem ? (
                <span className="absolute inset-x-0 bottom-0 bg-ink px-2 py-1 text-xs font-bold text-background">
                  ⚠ Revisa esta foto
                </span>
              ) : (
                index > 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(item.id)}
                    className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold transition hover:bg-white"
                  >
                    Hacer principal
                    <span className="sr-only"> la foto {index + 1}</span>
                  </button>
                )
              )}
            </li>
          );
        })}

        {!full && (
          <li className="aspect-square">
            <label
              htmlFor={id}
              className={`flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-3 text-center transition-colors focus-within:border-ink ${
                error ? "border-ink bg-white/80" : "border-ink/35 bg-white/60 hover:bg-white"
              }`}
            >
              <input
                id={id}
                ref={inputRef}
                type="file"
                accept={PET_PHOTO_ACCEPT}
                multiple
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                className="sr-only"
                onBlur={onBlur}
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <svg
                viewBox="0 0 24 24"
                className="size-7 text-ink/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-sm font-extrabold">Agregar fotos</span>
            </label>
          </li>
        )}
      </ul>

      <p id={`${id}-status`} className="mt-3 text-sm text-ink/65">
        {items.length} de {MAX_PET_PHOTOS} fotos · de 1 a 5 · JPG o PNG · máximo 5 MB cada una. La primera es la
        que se ve en la lista y en la app.
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="anim-error mt-2 text-sm font-bold">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}