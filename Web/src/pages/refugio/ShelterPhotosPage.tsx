import { useRef, useState, type ChangeEvent } from "react";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import ConfirmDialog from "@/components/panel/ConfirmDialog";

type ShelterPhoto = { id: string; url: string; name: string; file?: File };
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const initialPhotos: ShelterPhoto[] = [
  { id: "ref-photo-1", url: "/ejemplo/foto-1.svg", name: "Instalaciones principales" },
  { id: "ref-photo-2", url: "/ejemplo/foto-2.svg", name: "Área de convivencia" },
  { id: "ref-photo-3", url: "/ejemplo/foto-3.svg", name: "Espacio de descanso" },
];

// Almacenamiento simulado en memoria: conserva cambios al navegar entre pantallas,
// pero se reinicia al recargar o cerrar la pestaña. No sustituye al backend.
let shelterPhotosSession: ShelterPhoto[] = initialPhotos;

export default function ShelterPhotosPage() {
  const [photos, setPhotos] = useState<ShelterPhoto[]>(shelterPhotosSession);
  const [pendingDelete, setPendingDelete] = useState<ShelterPhoto | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Elige una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("La imagen supera el límite de 5 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotos((current) => {
      const next = [...current, { id: `ref-photo-${Date.now()}`, url, name: file.name, file }];
      shelterPhotosSession = next;
      return next;
    });
    setError("");
    setNotice("La foto se agregó a la galería de demostración.");
  }

  function replacePhoto(event: ChangeEvent<HTMLInputElement>, current: ShelterPhoto) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { setError("Elige una imagen JPG, PNG o WebP."); return; }
    if (file.size > MAX_BYTES) { setError("La imagen supera el límite de 5 MB."); return; }
    const url = URL.createObjectURL(file);
    if (current.file) URL.revokeObjectURL(current.url);
    setPhotos((items) => {
      const next = items.map((photo) => photo.id === current.id ? { ...photo, url, name: file.name, file } : photo);
      shelterPhotosSession = next;
      return next;
    });
    setError("");
    setNotice(`Se reemplazó “${current.name}” en la galería de demostración.`);
  }

  function deletePhoto() {
    if (!pendingDelete) return;
    if (pendingDelete.file) URL.revokeObjectURL(pendingDelete.url);
    setPhotos((current) => {
      const next = current.filter((photo) => photo.id !== pendingDelete.id);
      shelterPhotosSession = next;
      return next;
    });
    setNotice(`Se quitó “${pendingDelete.name}” de la galería de demostración.`);
    setPendingDelete(null);
  }

  return (
    <ShelterAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="anim-fade-up eyebrow text-ink/70">Patitas Felices</p>
          <h1 className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Fotos del refugio</h1>
          <p className="anim-fade-up mt-3 max-w-2xl text-base leading-7 text-ink/70">
            Mantén actualizada la galería pública de tu refugio con imágenes de tus instalaciones y actividades.
          </p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85">
          Agregar foto
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={addPhoto} className="sr-only" />
      </div>

      {notice && <p role="status" className="mt-6 rounded-2xl bg-accent p-4 text-sm font-bold">{notice}</p>}
      {error && <p role="alert" className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold">{error}</p>}
      <p className="mt-6 text-sm font-bold text-ink/70">{photos.length} {photos.length === 1 ? "foto" : "fotos"} en la galería</p>

      {photos.length === 0 ? (
        <div className="mt-4 rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-soft">
          <h2 className="font-heading text-2xl font-bold">Aún no hay fotos</h2>
          <p className="mt-2 text-ink/70">Agrega imágenes para mostrar tu refugio.</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 rounded-full bg-ink px-6 py-3 font-extrabold text-background">Agregar primera foto</button>
        </div>
      ) : (
        <ul aria-label="Fotos del refugio" className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-[1.75rem] bg-white/80 shadow-soft">
              <img src={photo.url} alt={photo.name} className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-extrabold">{photo.name}</p>
                  <p className="text-xs text-ink/60">Foto {index + 1}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <label className="cursor-pointer rounded-full border-2 border-ink/70 px-3 py-2 text-xs font-extrabold transition hover:bg-cards-2/40">
                    Reemplazar
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => replacePhoto(event, photo)} className="sr-only" />
                  </label>
                  <button type="button" onClick={() => setPendingDelete(photo)} className="rounded-full border-2 border-ink/70 px-3 py-2 text-xs font-extrabold transition hover:bg-cards-2/40">
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-xs leading-5 text-ink/60">JPG, PNG o WebP · Máximo 5 MB por imagen. Los cambios se conservan mientras la pestaña siga abierta; al recargar se restauran los datos de ejemplo. No se suben archivos a un servidor.</p>

      <ConfirmDialog open={pendingDelete !== null} title="¿Eliminar esta foto?" confirmLabel="Eliminar foto" onCancel={() => setPendingDelete(null)} onConfirm={deletePhoto}>
        <p>La foto se quitará de la galería visible en esta sesión. No se modifica ningún archivo remoto.</p>
      </ConfirmDialog>
    </ShelterAdminLayout>
  );
}
