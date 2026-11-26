import { useMemo, useState, type FormEvent } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import { initialPrivacyNotices, type PrivacyNotice, type PrivacyNoticeStatus } from "@/data/avisoPrivacidadAdmin";

const inputClass = "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { title: "", version: "", effectiveDate: today(), content: "", status: "Borrador" as PrivacyNoticeStatus };

export default function PrivacyNoticePage() {
  const [notices, setNotices] = useState<PrivacyNotice[]>(initialPrivacyNotices);
  const [selectedId, setSelectedId] = useState<string | null>(initialPrivacyNotices[0]?.id ?? null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [preview, setPreview] = useState<PrivacyNotice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PrivacyNotice | null>(null);
  const [notice, setNotice] = useState("");

  const selected = useMemo(() => notices.find((item) => item.id === selectedId) ?? notices[0] ?? null, [notices, selectedId]);
  const published = notices.find((item) => item.status === "Publicado");

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEdit(item: PrivacyNotice) {
    setEditingId(item.id);
    setForm({ title: item.title, version: item.version, effectiveDate: item.effectiveDate, content: item.content, status: item.status });
    setIsFormOpen(true);
  }

  function saveNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved: PrivacyNotice = {
      id: editingId ?? `aviso-${Date.now()}`,
      ...form,
      updatedAt: today(),
    };
    setNotices((current) => {
      const next = editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current];
      return saved.status === "Publicado" ? next.map((item): PrivacyNotice => item.id === saved.id ? item : { ...item, status: "Borrador" }) : next;
    });
    setSelectedId(saved.id);
    setIsFormOpen(false);
    setNotice(editingId ? "Aviso actualizado en esta sesión." : "Aviso creado en esta sesión.");
  }

  function publish(item: PrivacyNotice) {
    setNotices((current) => current.map((entry): PrivacyNotice => ({ ...entry, status: entry.id === item.id ? "Publicado" : "Borrador" })));
    setSelectedId(item.id);
    setNotice("El aviso quedó marcado como publicado en esta sesión. No se ha publicado en un servidor.");
  }

  function removeNotice() {
    if (!deleteTarget) return;
    const remaining = notices.filter((item) => item.id !== deleteTarget.id);
    setNotices(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    setDeleteTarget(null);
    setNotice("Aviso eliminado de los datos de esta sesión.");
  }

  return (
    <SuperAdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ink/70">Contenido</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Aviso de privacidad</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">Administra las versiones del aviso de privacidad de PetMatch.</p>
        </div>
        <button type="button" onClick={openCreate} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background transition hover:opacity-90">Crear aviso</button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-ink/60">Avisos registrados</p><p className="mt-2 font-heading text-3xl font-bold">{notices.length}</p></div>
        <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-ink/60">Avisos publicados</p><p className="mt-2 font-heading text-3xl font-bold">{notices.filter((item) => item.status === "Publicado").length}</p></div>
        <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-ink/60">Última actualización</p><p className="mt-2 font-heading text-xl font-bold">{published?.updatedAt ?? "Sin publicar"}</p></div>
      </div>

      {notice && <p role="status" className="mt-5 rounded-2xl bg-accent/70 px-4 py-3 text-sm font-semibold">{notice}</p>}

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="font-heading text-xl font-bold">Versiones</h2><span className="text-xs font-bold text-ink/50">{notices.length} registros</span></div>
          {notices.length === 0 ? <p className="py-10 text-center text-sm font-semibold text-ink/60">Todavía no hay avisos registrados.</p> : (
            <ul className="mt-4 space-y-3">
              {notices.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setSelectedId(item.id)} className={`w-full rounded-2xl border-2 p-4 text-left transition ${selected?.id === item.id ? "border-ink bg-cards-2" : "border-transparent bg-cards hover:border-ink/15"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-extrabold">Versión {item.version}</span><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${item.status === "Publicado" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{item.status}</span></div>
                    <p className="mt-2 font-semibold">{item.title}</p><p className="mt-1 text-xs text-ink/55">Vigente desde {item.effectiveDate} · Actualizado {item.updatedAt}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[2rem] bg-white/80 p-5 shadow-soft sm:p-6">
          {selected ? <>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow text-ink/60">Detalle del aviso</p><h2 className="mt-2 font-heading text-2xl font-bold">{selected.title}</h2><p className="mt-1 text-sm text-ink/60">Versión {selected.version} · Vigente desde {selected.effectiveDate}</p></div><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${selected.status === "Publicado" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{selected.status}</span></div>
            <div className="mt-5 max-h-80 overflow-y-auto rounded-2xl bg-cards p-5"><p className="whitespace-pre-wrap text-sm leading-7 text-ink/80">{selected.content}</p></div>
            <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setPreview(selected)} className="rounded-full border-2 border-ink/15 px-4 py-2.5 text-sm font-extrabold hover:bg-cards">Vista previa</button><button type="button" onClick={() => openEdit(selected)} className="rounded-full border-2 border-ink/15 px-4 py-2.5 text-sm font-extrabold hover:bg-cards">Editar</button>{selected.status !== "Publicado" && <button type="button" onClick={() => publish(selected)} className="rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-background">Marcar publicado</button>}<button type="button" onClick={() => setDeleteTarget(selected)} className="rounded-full border-2 border-red-200 px-4 py-2.5 text-sm font-extrabold text-red-700 hover:bg-red-50">Eliminar</button></div>
          </> : <div className="py-16 text-center"><h2 className="font-heading text-xl font-bold">Sin avisos registrados</h2><p className="mt-2 text-sm text-ink/60">Crea un aviso para comenzar a administrarlo.</p></div>}
        </section>
      </div>

      {isFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4"><form onSubmit={saveNotice} className="my-6 w-full max-w-2xl rounded-[2rem] bg-background p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-ink/60">Gestión de contenido</p><h2 className="mt-2 font-heading text-2xl font-bold">{editingId ? "Editar aviso" : "Nuevo aviso de privacidad"}</h2></div><button type="button" onClick={() => setIsFormOpen(false)} aria-label="Cerrar" className="rounded-full px-3 py-1 text-2xl hover:bg-cards">×</button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-sm font-extrabold">Título</span><input required className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Aviso de privacidad de PetMatch" /></label><label><span className="mb-2 block text-sm font-extrabold">Versión</span><input required className={inputClass} value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} placeholder="1.1" /></label><label><span className="mb-2 block text-sm font-extrabold">Fecha de vigencia</span><input required type="date" className={inputClass} value={form.effectiveDate} onChange={(event) => setForm({ ...form, effectiveDate: event.target.value })} /></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-extrabold">Contenido</span><textarea required rows={10} className={`${inputClass} resize-y`} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Escribe el contenido del aviso..." /></label><label><span className="mb-2 block text-sm font-extrabold">Estado</span><select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PrivacyNoticeStatus })}><option value="Borrador">Borrador</option><option value="Publicado">Publicado</option></select></label></div>
        <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-full border-2 border-ink/15 px-5 py-3 text-sm font-extrabold">Cancelar</button><button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background">Guardar aviso</button></div>
      </form></div>}

      {preview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4"><section role="dialog" aria-modal="true" aria-labelledby="privacy-preview-title" className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-background p-6 shadow-2xl sm:p-9"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-ink/60">Vista previa</p><h2 id="privacy-preview-title" className="mt-2 font-heading text-2xl font-bold">{preview.title}</h2><p className="mt-1 text-sm text-ink/60">Versión {preview.version} · Vigente desde {preview.effectiveDate}</p></div><button type="button" onClick={() => setPreview(null)} aria-label="Cerrar vista previa" className="rounded-full px-3 py-1 text-2xl hover:bg-cards">×</button></div><div className="mt-6 whitespace-pre-wrap text-sm leading-8 text-ink/80">{preview.content}</div></section></div>}

      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4"><section role="alertdialog" aria-modal="true" aria-labelledby="delete-notice-title" className="w-full max-w-md rounded-[2rem] bg-background p-6 shadow-2xl"><h2 id="delete-notice-title" className="font-heading text-2xl font-bold">¿Eliminar este aviso?</h2><p className="mt-3 text-sm leading-6 text-ink/70">Se eliminará «{deleteTarget.title}» de los datos de esta sesión.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-full border-2 border-ink/15 px-5 py-3 text-sm font-extrabold">Cancelar</button><button type="button" onClick={removeNotice} className="rounded-full bg-red-700 px-5 py-3 text-sm font-extrabold text-white">Eliminar</button></div></section></div>}
    </SuperAdminLayout>
  );
}
