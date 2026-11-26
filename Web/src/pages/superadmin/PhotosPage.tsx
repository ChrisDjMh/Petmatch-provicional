import { useMemo, useState, type ChangeEvent } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { initialAdminPhotos, PHOTO_TYPE_LABEL, type AdminPhoto, type PhotoOwnerType } from "@/data/fotosAdmin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const inputClass = "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<AdminPhoto[]>(initialAdminPhotos);
  const [type, setType] = useState<"todos" | PhotoOwnerType>("todos");
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminPhoto | null>(null);
  const [notice, setNotice] = useState("");


  const visible = useMemo(() => photos.filter((photo) => {
    const matchesType = type === "todos" || photo.ownerType === type;
    const term = search.trim().toLocaleLowerCase("es");
    const matchesSearch = !term || `${photo.ownerName} ${photo.label} ${photo.fileName}`.toLocaleLowerCase("es").includes(term);
    return matchesType && matchesSearch;
  }), [photos, search, type]);

  function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setNotice("Formato no válido. Selecciona una imagen JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice("La imagen supera el máximo de 5 MB.");
      return;
    }
    const ownerType = type === "todos" ? "refugio" : type;
    const url = URL.createObjectURL(file);
    const newPhoto: AdminPhoto = {
      id: `foto-${Date.now()}`,
      ownerType,
      ownerId: "nuevo",
      ownerName: "Nuevo registro de imagen",
      label: `Imagen agregada a ${PHOTO_TYPE_LABEL[ownerType].toLowerCase()}`,
      url,
      fileName: file.name,
      localFile: true,
    };
    setPhotos((current) => [newPhoto, ...current]);
    setNotice("Imagen agregada a la vista previa. En este prototipo no se carga a un servidor.");
  }

  function replacePhoto(photoId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setNotice("Formato no válido. Selecciona una imagen JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice("La imagen supera el máximo de 5 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotos((current) => current.map((photo) => {
      if (photo.id !== photoId) return photo;
      if (photo.localFile && photo.url.startsWith("blob:")) URL.revokeObjectURL(photo.url);
      return { ...photo, url, fileName: file.name, localFile: true };
    }));
    setNotice("Imagen reemplazada en la vista previa. No se carga a un servidor.");
  }

  function removePhoto() {
    if (!pendingDelete) return;
    const removed = pendingDelete;
    setPhotos((current) => current.filter((photo) => photo.id !== removed.id));
    if (removed.localFile && removed.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
    setPendingDelete(null);
    setNotice(`Se quitó el archivo «${removed.fileName}» de los datos de esta sesión.`);
  }

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Contenido</p>
          <h1 className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Fotos</h1>
          <p className="anim-fade-up mt-3 max-w-2xl text-base leading-7 text-ink/70">
            Consulta y administra las imágenes asociadas a refugios, mascotas y usuarios.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background transition hover:opacity-90">
          Agregar imagen
          <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={addPhoto} />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <label htmlFor="photo-search" className="mb-2 block text-sm font-extrabold">Buscar</label>
          <input id="photo-search" className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre de refugio, mascota o usuario" />
        </div>
        <div>
          <label htmlFor="photo-type" className="mb-2 block text-sm font-extrabold">Tipo de registro</label>
          <select id="photo-type" className={inputClass} value={type} onChange={(event) => setType(event.target.value as "todos" | PhotoOwnerType)}>
            <option value="todos">Todos</option>
            <option value="refugio">Refugios</option>
            <option value="mascota">Mascotas</option>
            <option value="usuario">Usuarios</option>
          </select>
        </div>
      </div>

      {notice && <p role="status" className="mt-4 rounded-2xl bg-accent/70 px-4 py-3 text-sm font-semibold">{notice}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-ink/65">
        <span>{visible.length} {visible.length === 1 ? "imagen" : "imágenes"}</span>
        <span>JPG, PNG o WEBP · máximo 5 MB</span>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-[2rem] bg-white/70 px-6 py-16 text-center font-semibold text-ink/65">No hay imágenes que coincidan con la búsqueda.</div>
      ) : (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((photo) => (
            <li key={photo.id} className="overflow-hidden rounded-[1.75rem] bg-white/80 shadow-soft">
              <div className="aspect-[4/3] overflow-hidden bg-cards-2">
                <img src={photo.url} alt={photo.label} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold">{PHOTO_TYPE_LABEL[photo.ownerType]}</span>
                    <h2 className="mt-3 truncate font-heading text-lg font-bold">{photo.ownerName}</h2>
                    <p className="mt-1 text-sm text-ink/65">{photo.label}</p>
                    <p className="mt-2 truncate text-xs font-semibold text-ink/45">{photo.fileName}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <label className="cursor-pointer rounded-full border-2 border-ink/15 px-3 py-2.5 text-center text-sm font-extrabold transition hover:bg-cards-2">
                    Reemplazar
                    <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => replacePhoto(photo.id, event)} />
                  </label>
                  <button type="button" onClick={() => setPendingDelete(photo)} className="rounded-full border-2 border-ink/15 px-3 py-2.5 text-sm font-extrabold transition hover:border-red-500 hover:bg-red-50 hover:text-red-700">
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingDelete(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-photo-title" className="w-full max-w-md rounded-[2rem] bg-background p-6 shadow-2xl">
            <h2 id="delete-photo-title" className="font-heading text-2xl font-bold">¿Eliminar esta imagen?</h2>
            <p className="mt-3 leading-7 text-ink/70">Se quitará «{pendingDelete.fileName}» del registro mostrado en esta sesión. Esta acción no se puede deshacer aquí.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-full border-2 border-ink/20 px-5 py-3 text-sm font-extrabold">Cancelar</button>
              <button type="button" onClick={removePhoto} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background">Eliminar</button>
            </div>
          </section>
        </div>
      )}
    </SuperAdminLayout>
  );
}
