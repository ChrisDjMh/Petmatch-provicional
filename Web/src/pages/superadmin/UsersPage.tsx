import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import SuperAdminLayout from "@/components/panel/SuperAdminLayout";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import { initialUsers, type UserRecord, type EmailStatus, type Experience, type Commitment } from "@/data/usuarios";

const inputClass = "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";
const blankUser = (): Omit<UserRecord, "id"> => ({ name: "", email: "", emailStatus: "pendiente", birthDate: "", address: "", profilePhoto: "", rooms: 1, hoursAtHome: 8, experience: "ninguna", commitment: "medio", childrenAtHome: false, hasOtherPets: false, otherPets: "" });
const statusLabel: Record<EmailStatus, string> = { pendiente: "Pendiente", confirmado: "Confirmado" };

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"todos" | EmailStatus>("todos");
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [draft, setDraft] = useState<Omit<UserRecord, "id">>(blankUser());
  const [deleting, setDeleting] = useState<UserRecord | null>(null);
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => users.filter((user) => {
    const term = search.trim().toLocaleLowerCase("es");
    const matchesSearch = !term || `${user.id} ${user.name} ${user.email} ${user.address}`.toLocaleLowerCase("es").includes(term);
    return matchesSearch && (status === "todos" || user.emailStatus === status);
  }), [users, search, status]);

  function openCreate() { setEditing(null); setDraft(blankUser()); setNotice(""); }
  function openEdit(user: UserRecord) { setEditing(user); const { id: _id, ...fields } = user; setDraft(fields); setNotice(""); }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      setUsers((current) => current.map((user) => user.id === editing.id ? { ...draft, id: editing.id } : user));
      setNotice("Los cambios del usuario se actualizaron en esta sesión.");
    } else {
      const id = `USR-${String(Date.now()).slice(-6)}`;
      setUsers((current) => [{ ...draft, id }, ...current]);
      setNotice("Usuario agregado a los datos de esta sesión.");
    }
    (document.getElementById("user-editor") as HTMLDialogElement | null)?.close();
  }
  function removeUser() {
    if (!deleting) return;
    setUsers((current) => current.filter((user) => user.id !== deleting.id));
    setNotice(`Se eliminó ${deleting.name} de los datos de esta sesión.`);
    setDeleting(null);
  }

  return <SuperAdminLayout>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-ink/70">Administración</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Usuarios</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">Consulta y administra las cuentas y el perfil de compatibilidad de los adoptantes.</p>
      </div>
      <button type="button" onClick={() => { openCreate(); (document.getElementById("user-editor") as HTMLDialogElement | null)?.showModal(); }} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-background transition hover:opacity-90">Agregar usuario</button>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
      <div><label htmlFor="user-search" className="mb-2 block text-sm font-extrabold">Buscar usuario</label><input id="user-search" className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ID, nombre, correo o dirección" /></div>
      <div><label htmlFor="user-status" className="mb-2 block text-sm font-extrabold">Estado del correo</label><select id="user-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as "todos" | EmailStatus)}><option value="todos">Todos</option><option value="pendiente">Pendiente</option><option value="confirmado">Confirmado</option></select></div>
    </div>
    {notice && <p role="status" className="mt-4 rounded-2xl bg-accent/70 px-4 py-3 text-sm font-semibold">{notice} Los cambios no se guardan al salir o recargar.</p>}
    <div className="mt-5 flex justify-between text-sm font-bold text-ink/65"><span>{visible.length} {visible.length === 1 ? "usuario" : "usuarios"}</span><span>Solo datos de demostración</span></div>

    <section className="mt-4 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6" aria-label="Listado de usuarios">
      {visible.length === 0 ? <p className="px-4 py-12 text-center font-semibold text-ink/65">No hay usuarios que coincidan con la búsqueda.</p> : <>
        <div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><caption className="sr-only">Usuarios registrados</caption><thead><tr className="text-xs font-extrabold uppercase tracking-wider text-ink/60"><th className="px-3 py-3">Usuario</th><th className="px-3 py-3">Correo</th><th className="px-3 py-3">Edad</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3"><span className="sr-only">Acciones</span></th></tr></thead><tbody>{visible.map((user) => <tr key={user.id} className="border-t border-ink/10"><td className="px-3 py-4"><strong className="block">{user.name}</strong><span className="text-xs text-ink/55">{user.id}</span></td><td className="px-3 py-4 text-sm font-semibold">{user.email}</td><td className="px-3 py-4 text-sm">{user.birthDate ? `${Math.max(0, new Date().getFullYear() - new Date(`${user.birthDate}T00:00:00`).getFullYear())} años aprox.` : "—"}</td><td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${user.emailStatus === "confirmado" ? "bg-accent" : "bg-cards-2"}`}>{statusLabel[user.emailStatus]}</span></td><td className="px-3 py-4 text-right"><button onClick={() => { openEdit(user); (document.getElementById("user-editor") as HTMLDialogElement | null)?.showModal(); }} className="mr-2 rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-bold hover:bg-cards-2">Editar</button><button onClick={() => setDeleting(user)} className="rounded-full px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50">Eliminar</button></td></tr>)}</tbody></table></div>
        <ul className="space-y-3 md:hidden">{visible.map((user) => <li key={user.id} className="rounded-2xl bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{user.name}</p><p className="text-xs text-ink/55">{user.id}</p><p className="mt-1 break-all text-sm">{user.email}</p></div><span className="shrink-0 rounded-full bg-cards-2 px-3 py-1 text-xs font-extrabold">{statusLabel[user.emailStatus]}</span></div><div className="mt-4 flex gap-2"><button onClick={() => { openEdit(user); (document.getElementById("user-editor") as HTMLDialogElement | null)?.showModal(); }} className="flex-1 rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-bold">Editar</button><button onClick={() => setDeleting(user)} className="rounded-full px-4 py-2 text-sm font-bold text-red-700">Eliminar</button></div></li>)}</ul>
      </>}
    </section>

    <dialog id="user-editor" onClose={() => setEditing(null)} className="m-auto max-h-[90vh] w-[min(52rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] bg-cards p-6 text-ink shadow-soft backdrop:bg-ink/60 sm:p-8">
      <form onSubmit={save} className="space-y-5">
        <div><p className="eyebrow">Registro de usuario</p><h2 className="mt-2 font-heading text-2xl font-bold">{editing ? "Editar usuario" : "Agregar usuario"}</h2><p className="mt-2 text-sm text-ink/65">Los datos de contraseña y tokens de sesión no se muestran ni se modifican desde esta pantalla.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre de usuario"><input required className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Correo de usuario"><input required type="email" className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
          <Field label="Estado del correo"><select className={inputClass} value={draft.emailStatus} onChange={(e) => setDraft({ ...draft, emailStatus: e.target.value as EmailStatus })}><option value="pendiente">Pendiente</option><option value="confirmado">Confirmado</option></select></Field>
          <Field label="Fecha de nacimiento"><input required type="date" className={inputClass} value={draft.birthDate} onChange={(e) => setDraft({ ...draft, birthDate: e.target.value })} /></Field>
          <Field label="Dirección" wide><input className={inputClass} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></Field>
          <Field label="Link de foto de perfil" wide><input type="url" className={inputClass} value={draft.profilePhoto} onChange={(e) => setDraft({ ...draft, profilePhoto: e.target.value })} placeholder="https://..." /></Field>
          <Field label="Espacio de vivienda (cuartos)"><input type="number" min="0" className={inputClass} value={draft.rooms} onChange={(e) => setDraft({ ...draft, rooms: Number(e.target.value) })} /></Field>
          <Field label="Horas al día en casa"><input type="number" min="0" max="24" className={inputClass} value={draft.hoursAtHome} onChange={(e) => setDraft({ ...draft, hoursAtHome: Number(e.target.value) })} /></Field>
          <Field label="Experiencia previa"><select className={inputClass} value={draft.experience} onChange={(e) => setDraft({ ...draft, experience: e.target.value as Experience })}><option value="ninguna">Ninguna</option><option value="basica">Básica</option><option value="amplia">Amplia</option></select></Field>
          <Field label="Nivel de compromiso"><select className={inputClass} value={draft.commitment} onChange={(e) => setDraft({ ...draft, commitment: e.target.value as Commitment })}><option value="alto">Alto</option><option value="medio">Medio</option><option value="bajo">Bajo</option></select></Field>
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold"><input type="checkbox" checked={draft.childrenAtHome} onChange={(e) => setDraft({ ...draft, childrenAtHome: e.target.checked })} />Niños en casa</label>
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold"><input type="checkbox" checked={draft.hasOtherPets} onChange={(e) => setDraft({ ...draft, hasOtherPets: e.target.checked })} />Tiene otras mascotas</label>
          <Field label="Otras mascotas" wide><textarea className={inputClass} rows={2} value={draft.otherPets} onChange={(e) => setDraft({ ...draft, otherPets: e.target.value })} placeholder="Describe las otras mascotas, si aplica" /></Field>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => (document.getElementById("user-editor") as HTMLDialogElement | null)?.close()} className="rounded-full border-2 border-ink/20 px-6 py-3 font-extrabold">Cancelar</button><button type="submit" className="rounded-full bg-ink px-6 py-3 font-extrabold text-background">Guardar usuario</button></div>
      </form>
    </dialog>
    <ConfirmDialog open={!!deleting} title="Eliminar usuario" confirmLabel="Eliminar" onCancel={() => setDeleting(null)} onConfirm={removeUser}><p>¿Seguro que deseas quitar a <strong>{deleting?.name}</strong> de los datos de demostración de esta sesión?</p><p>Esta acción no se puede deshacer en la vista actual.</p></ConfirmDialog>
  </SuperAdminLayout>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-sm font-extrabold">{label}</span>{children}</label>;
}
