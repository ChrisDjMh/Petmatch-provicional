import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { TextField } from "@/components/auth/TextField";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import { SelectField } from "@/components/panel/FormControls";
import {
  NAME_MAX,
  NAME_MIN,
  nameTaken,
  removeCategory,
  saveCategory,
  shelterOptions,
  useCategories,
  type Category,
} from "@/data/categorias";

const MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png"];

const primary =
  "inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";
const actionBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-[0.98]";

type Errors = { shelter?: string; name?: string; photo?: string };

function CategoryForm({
  editing,
  fixedShelterId,
  list,
  onSaved,
  onCancel,
}: {
  editing: Category | null;
  fixedShelterId?: string;
  list: Category[];
  onSaved: (category: Category, wasEditing: boolean) => void;
  onCancel: () => void;
}) {
  const shelters = shelterOptions();
  // Al editar, el refugio de la categoría siempre debe aparecer en la lista, aunque ya no esté activo.
  const names = Array.from(new Set([...shelters.map((s) => s.name), ...(editing ? [editing.shelterName] : [])]));
  const [shelterName, setShelterName] = useState(editing?.shelterName ?? "");
  const [name, setName] = useState(editing?.name ?? "");
  const [photo, setPhoto] = useState(editing?.photo ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const shelterId =
    fixedShelterId ?? shelters.find((s) => s.name === shelterName)?.id ?? editing?.shelterId;

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, photo: `«${file.name}» no tiene un formato válido. Sube una imagen JPG o PNG.` }));
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, photo: `«${file.name}» pesa más de 5 MB. Sube una versión más ligera.` }));
      return;
    }
    // Vista previa local. Con backend la foto se sube a Storage al guardar.
    setPhoto(URL.createObjectURL(file));
    setErrors((e) => ({ ...e, photo: undefined }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    const trimmed = name.trim();

    if (!fixedShelterId && !shelterId) found.shelter = "Elige el refugio de la categoría.";
    if (trimmed.length < NAME_MIN) found.name = `Escribe un nombre de al menos ${NAME_MIN} caracteres.`;
    else if (trimmed.length > NAME_MAX) found.name = `Máximo ${NAME_MAX} caracteres.`;
    else if (shelterId && nameTaken(list, shelterId, trimmed, editing?.id)) {
      found.name = "Ese refugio ya tiene una categoría con este nombre.";
    }
    if (!photo) found.photo = "Elige una foto para la categoría.";

    setErrors(found);
    if (Object.keys(found).length > 0 || !shelterId) return;
    onSaved(saveCategory(editing?.id ?? null, { shelterId, name: trimmed, photo }), editing !== null);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-5 space-y-5">
      {!fixedShelterId && (
        <SelectField
          id="category-shelter"
          label="Refugio"
          placeholder="Elige un refugio"
          options={names}
          value={shelterName}
          onChange={(e) => setShelterName(e.target.value)}
          error={errors.shelter}
        />
      )}

      <TextField
        id="category-name"
        label="Nombre de la categoría"
        placeholder="Por ejemplo: Perros"
        autoComplete="off"
        maxLength={NAME_MAX + 10}
        hint={`${name.trim().length}/${NAME_MAX}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <div>
        <p className="mb-2 text-sm font-extrabold">Foto de la categoría</p>
        <div className="flex flex-wrap items-center gap-4">
          {photo ? (
            <img src={photo} alt="Vista previa de la foto" className="size-24 rounded-2xl object-cover" />
          ) : (
            <div
              aria-hidden="true"
              className="flex size-24 items-center justify-center rounded-2xl bg-cards-2/40 text-xs font-bold text-ink/60"
            >
              Sin foto
            </div>
          )}
          <label className="cursor-pointer rounded-full border-2 border-ink/80 px-5 py-2.5 text-sm font-extrabold transition hover:bg-cards-2/40 focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2">
            {photo ? "Cambiar foto" : "Elegir foto"}
            <input type="file" accept="image/jpeg,image/png" onChange={choosePhoto} className="sr-only" />
          </label>
        </div>
        {errors.photo ? (
          <p className="anim-error mt-2 text-sm font-bold">⚠ {errors.photo}</p>
        ) : (
          <p className="mt-2 text-sm text-ink/65">JPG o PNG, de máximo 5 MB.</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border-2 border-ink/80 px-6 py-3 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]"
        >
          Volver
        </button>
        <button type="submit" className={primary}>
          {editing ? "Guardar cambios" : "Agregar categoría"}
        </button>
      </div>
    </form>
  );
}

function CategoryDialog({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="category-dialog-title"
      className="m-auto max-h-[90vh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] bg-white p-8 text-ink shadow-soft backdrop:bg-ink/60"
    >
      {open && (
        <>
          <h2 id="category-dialog-title" className="font-heading text-2xl font-bold">
            {title}
          </h2>
          {children}
        </>
      )}
    </dialog>
  );
}

/* Altas, cambios y bajas de categorías. Sirve para el Super Admin (todas las categorías, de todos los
   refugios) y para el Admin de Refugio (pasando su "shelterId", solo las suyas). */
export default function CategoriesManager({ shelterId }: { shelterId?: string }) {
  const all = useCategories();
  const scope = shelterId ? all.filter((c) => c.shelterId === shelterId) : all;

  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [notice, setNotice] = useState("");

  const shelterNames = Array.from(new Set(all.map((c) => c.shelterName))).sort((a, b) => a.localeCompare(b, "es"));
  const visible = scope.filter((c) => !filter || c.shelterName === filter);

  function confirmDelete() {
    if (!deleting) return;
    removeCategory(deleting.id);
    setNotice(`Eliminaste la categoría ${deleting.name}${shelterId ? "" : ` de ${deleting.shelterName}`}.`);
    setDeleting(null);
  }

  function saved(category: Category, wasEditing: boolean) {
    setNotice(
      wasEditing
        ? `Guardaste los cambios de la categoría ${category.name}.`
        : `Agregaste la categoría ${category.name}${shelterId ? "" : ` a ${category.shelterName}`}.`,
    );
    setCreating(false);
    setEditing(null);
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        {!shelterId ? (
          <div className="w-full sm:max-w-xs">
            <SelectField
              id="categories-filter"
              label="Refugio"
              placeholder="Todos los refugios"
              options={shelterNames}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        ) : (
          <span />
        )}
        <button type="button" onClick={() => setCreating(true)} className={primary}>
          Agregar categoría
        </button>
      </div>

      {notice && (
        <p role="status" className="anim-fade-up mt-6 rounded-2xl bg-accent p-4 text-sm font-bold leading-6">
          {notice}
        </p>
      )}

      <p role="status" className="mt-6 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 categoría" : `${visible.length} categorías`}
      </p>

      <section
        aria-label="Lista de categorías"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            {filter ? "Este refugio aún no tiene categorías." : "Aún no hay categorías. Agrega la primera."}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((c) => (
              <li key={c.id} className="overflow-hidden rounded-2xl bg-white">
                <img src={c.photo} alt={`Foto de la categoría ${c.name}`} loading="lazy" className="aspect-4/3 w-full object-cover" />
                <div className="p-5">
                  <p className="font-heading text-xl font-bold">{c.name}</p>
                  {!shelterId && <p className="mt-0.5 text-sm font-semibold text-ink/70">{c.shelterName}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      className={`${actionBase} border-2 border-ink/80 hover:bg-cards-2/40`}
                    >
                      Editar<span className="sr-only"> la categoría {c.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(c)}
                      className={`${actionBase} bg-white/60 hover:bg-cards-2/40`}
                    >
                      Eliminar<span className="sr-only"> la categoría {c.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CategoryDialog
        open={creating || editing !== null}
        title={editing ? "Editar categoría" : "Agregar categoría"}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <CategoryForm
          editing={editing}
          fixedShelterId={shelterId}
          list={all}
          onSaved={saved}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      </CategoryDialog>

      <ConfirmDialog
        open={deleting !== null}
        title="¿Eliminar la categoría?"
        confirmLabel="Eliminar"
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      >
        <p>
          Se eliminará <strong>{deleting?.name}</strong> y su foto. Esta acción no se puede deshacer.
        </p>
      </ConfirmDialog>
    </>
  );
}