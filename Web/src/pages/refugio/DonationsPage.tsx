import { useState, type ReactNode } from "react";
import ShelterAdminLayout from "@/components/panel/ShelterAdminLayout";
import ConfirmDialog from "@/components/panel/ConfirmDialog";
import type { DonationType } from "@/data/donaciones";
import {
  activeSponsorships,
  getAccountTail,
  getStripeStatus,
  setStripeStatus,
  shelterDonations,
  type StripeStatus,
} from "@/data/donacionesRefugio";

/* Donaciones del refugio: cuenta de Stripe (RF-47, RF-48) y dashboard de donaciones recibidas (RF-56).
   Por ahora solo frontend: la vinculación con Stripe se simula en memoria. Cuando llegue esa etapa, los puntos
   donde se conecta Stripe Connect y la API están marcados con comentarios "Aquí se...". */

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });
const monthFormat = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
const moneyFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const TYPE_ORDER: DonationType[] = ["unica", "mensual", "post-adopcion"];
const TYPE_LABEL: Record<DonationType, string> = {
  unica: "Única",
  mensual: "Apadrinamiento mensual",
  "post-adopcion": "Post-adopción",
};

const STATUS_COPY: Record<StripeStatus, { badge: string; badgeClass: string; text: string }> = {
  "sin-vincular": {
    badge: "Sin vincular",
    badgeClass: "bg-ink text-background",
    text: "Mientras no vincules tu cuenta de Stripe, los adoptantes no pueden donar a tu refugio desde la app.",
  },
  "en-proceso": {
    badge: "En proceso",
    badgeClass: "bg-white",
    text: "Empezaste el alta en Stripe, pero falta terminarla. Hasta que termine, la app no permite donar a tu refugio.",
  },
  vinculada: {
    badge: "Vinculada",
    badgeClass: "bg-accent",
    text: "Los adoptantes ya pueden donar a tu refugio desde la app. El dinero llega directo a tu cuenta de Stripe.",
  },
};

const STATUS_KEYS: StripeStatus[] = ["sin-vincular", "en-proceso", "vinculada"];

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return monthFormat.format(new Date(year, month - 1, 1));
}

/* Los últimos seis meses, del más reciente al más antiguo, contados desde la última donación. */
function recentMonths(count: number): string[] {
  const latest = shelterDonations.reduce((max, d) => (d.date > max ? d.date : max), "");
  const [year, month] = monthKey(latest).split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(year, month - 1 - i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

const MONTHS = recentMonths(6);

const selectClass =
  "w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 font-semibold text-ink shadow-sm outline-none transition-colors focus:border-ink";

const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:-translate-y-0.5 hover:bg-ink/85 active:scale-[0.98]";
const buttonSecondary =
  "inline-flex items-center justify-center rounded-full border-2 border-ink/80 px-6 py-2.5 font-extrabold transition hover:bg-white/60 active:scale-[0.98]";

function Card({ title, children, delay = "0ms" }: { title: string; children: ReactNode; delay?: string }) {
  return (
    <section
      aria-label={title}
      style={{ animationDelay: delay }}
      className="anim-fade-up rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8"
    >
      {children}
    </section>
  );
}

export default function DonationsPage() {
  const [status, setStatus] = useState<StripeStatus>(() => getStripeStatus());
  const [dialog, setDialog] = useState<"vincular" | "desvincular" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [month, setMonth] = useState("");

  function changeStatus(next: StripeStatus, text: string | null) {
    setStripeStatus(next);
    setStatus(next);
    setMessage(text);
  }

  function startLink() {
    // Aquí se creará el enlace de alta de Stripe Connect (Express, modo prueba) y se abrirá en una pestaña nueva.
    // Al volver, el backend consulta a Stripe y el panel muestra "En proceso" o "Vinculada" (RF-47).
    setDialog(null);
    changeStatus("en-proceso", "Te llevaremos a Stripe para completar el alta. Cuando termines, tu cuenta quedará vinculada.");
  }

  function unlink() {
    // Aquí el backend borra el identificador de la cuenta, cancela los apadrinamientos activos y avisa a los
    // donantes (RF-48). El historial de donaciones se conserva.
    setDialog(null);
    changeStatus("sin-vincular", "Desvinculaste tu cuenta de Stripe. La app ya no permite donar a tu refugio.");
  }

  /* ---------- Dashboard (RF-56) ---------- */
  const visible = shelterDonations
    .filter((d) => !month || monthKey(d.date) === month)
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = visible.reduce((sum, d) => sum + d.amount, 0);

  const byType = TYPE_ORDER.map((type) => {
    const items = visible.filter((d) => d.type === type);
    return { type, count: items.length, sum: items.reduce((s, d) => s + d.amount, 0) };
  });

  const byMonth = MONTHS.map((key) => {
    const sum = shelterDonations.filter((d) => monthKey(d.date) === key).reduce((s, d) => s + d.amount, 0);
    return { key, sum };
  });
  const maxMonth = Math.max(...byMonth.map((m) => m.sum), 1);

  const copy = STATUS_COPY[status];
  const sponsorships = activeSponsorships();

  return (
    <ShelterAdminLayout>
      <p className="anim-fade-up eyebrow text-ink/70">Patitas Felices</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="anim-fade-up mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Donaciones
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="anim-fade-up mt-3 max-w-2xl text-base leading-7 text-ink/70"
      >
        Vincula tu cuenta de Stripe y revisa lo que te donan. El dinero de cada donación va directo a tu cuenta:
        PetMatch no cobra comisión ni retiene fondos.
      </p>

      {message && (
        <p role="status" className="anim-fade-up mt-6 rounded-2xl bg-accent px-5 py-3 text-sm font-bold">
          {message}
        </p>
      )}

      {/* Cuenta de Stripe (RF-47, RF-48) */}
      <div className="mt-8">
        <Card title="Cuenta de Stripe" delay="200ms">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold">Cuenta de Stripe</h2>
              <p className="mt-1 text-sm font-semibold text-ink/60">Stripe en modo prueba: no se mueve dinero real.</p>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${copy.badgeClass}`}>{copy.badge}</span>
          </div>

          <p className="mt-4 max-w-2xl leading-7 text-ink/75">{copy.text}</p>

          {status === "vinculada" && (
            <p className="mt-3 text-sm font-bold text-ink/70">
              Cuenta conectada: <span className="font-extrabold">acct_••••{getAccountTail()}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {status === "sin-vincular" && (
              <button type="button" onClick={() => setDialog("vincular")} className={buttonPrimary}>
                Vincular cuenta de Stripe
              </button>
            )}
            {status === "en-proceso" && (
              <>
                <button type="button" onClick={() => setDialog("vincular")} className={buttonPrimary}>
                  Continuar el alta
                </button>
                <button
                  type="button"
                  onClick={() => changeStatus("sin-vincular", "Cancelaste el alta. Puedes empezar de nuevo cuando quieras.")}
                  className={buttonSecondary}
                >
                  Cancelar alta
                </button>
              </>
            )}
            {status === "vinculada" && (
              <button type="button" onClick={() => setDialog("desvincular")} className={buttonSecondary}>
                Desvincular cuenta
              </button>
            )}
          </div>

          {/* Solo en desarrollo: cambia el estado para revisar cada pantalla. */}
          {import.meta.env.DEV && (
            <nav
              aria-label="Vista previa de estados de Stripe (solo desarrollo)"
              className="mt-6 rounded-2xl border-2 border-dashed border-ink/40 p-4 text-sm"
            >
              <p className="font-extrabold">Vista previa de estados (solo desarrollo)</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {STATUS_KEYS.map((key) => (
                  <li key={key}>
                    <button
                      type="button"
                      aria-pressed={key === status}
                      onClick={() => changeStatus(key, null)}
                      className={`rounded-full px-3 py-1.5 font-bold transition-colors ${
                        key === status ? "bg-ink text-background" : "bg-white/70 hover:bg-white"
                      }`}
                    >
                      {STATUS_COPY[key].badge}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Card>
      </div>

      {/* Dashboard de donaciones recibidas (RF-56) */}
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Donaciones recibidas</h2>
        <div className="w-full sm:w-64">
          <label htmlFor="filter-month" className="mb-2 block text-sm font-extrabold">
            Mes
          </label>
          <select
            id="filter-month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className={`${selectClass} capitalize`}
          >
            <option value="">Todos los meses</option>
            {MONTHS.map((key) => (
              <option key={key} value={key}>
                {monthLabel(key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Totales: general y por tipo */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="anim-fade-up rounded-[1.75rem] bg-accent p-6 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/70">
            Total {month ? `de ${monthLabel(month)}` : "recibido"}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold">{moneyFormat.format(total)}</p>
          <p className="mt-1 text-sm font-semibold text-ink/70">
            {visible.length === 1 ? "1 donación" : `${visible.length} donaciones`}
          </p>
        </div>
        {byType.map((item, index) => (
          <div
            key={item.type}
            style={{ animationDelay: `${(index + 1) * 70}ms` }}
            className="anim-fade-up rounded-[1.75rem] bg-white/70 p-6 shadow-soft backdrop-blur"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">{TYPE_LABEL[item.type]}</p>
            <p className="mt-2 font-heading text-3xl font-bold">{moneyFormat.format(item.sum)}</p>
            <p className="mt-1 text-sm font-semibold text-ink/70">
              {item.count === 1 ? "1 donación" : `${item.count} donaciones`}
            </p>
          </div>
        ))}
      </div>

      {/* Totales por mes */}
      <div className="mt-6">
        <Card title="Totales por mes" delay="120ms">
          <h3 className="font-heading text-xl font-bold">Total por mes</h3>
          <ul className="mt-4 space-y-3">
            {byMonth.map((item) => {
              const selected = month === item.key;
              return (
                <li key={item.key} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[10rem_1fr_6.5rem]">
                  <span className={`text-sm capitalize ${selected ? "font-extrabold" : "font-semibold text-ink/75"}`}>
                    {monthLabel(item.key)}
                  </span>
                  <span aria-hidden="true" className="h-4 overflow-hidden rounded-full bg-white">
                    <span
                      className={`block h-full rounded-full ${selected ? "bg-ink" : "bg-ink/45"}`}
                      style={{ width: `${(item.sum / maxMonth) * 100}%` }}
                    />
                  </span>
                  <span className="text-right text-sm font-extrabold">{moneyFormat.format(item.sum)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Lista de donaciones */}
      <p role="status" className="mt-6 text-sm font-bold text-ink/70">
        {visible.length === 1 ? "1 donación" : `${visible.length} donaciones`}
      </p>
      <section
        aria-label="Lista de donaciones recibidas"
        className="anim-fade-up mt-3 rounded-[2rem] bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center font-semibold text-ink/70">
            Aún no hay donaciones en este mes. Prueba con otro mes.
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <caption className="sr-only">Donaciones recibidas</caption>
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  <th scope="col" className="px-4 py-3">Fecha</th>
                  <th scope="col" className="px-4 py-3">Donante</th>
                  <th scope="col" className="px-4 py-3">Tipo</th>
                  <th scope="col" className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id} className="border-t border-ink/10">
                    <th scope="row" className="px-4 py-4 text-sm font-semibold text-ink/80">
                      {dateFormat.format(new Date(d.date))}
                    </th>
                    <td className="px-4 py-4 font-heading text-base font-bold">{d.donor}</td>
                    <td className="px-4 py-4 font-semibold text-ink/80">{TYPE_LABEL[d.type]}</td>
                    <td className="px-4 py-4 text-right font-extrabold">{moneyFormat.format(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="space-y-3 md:hidden">
              {visible.map((d) => (
                <li key={d.id} className="rounded-2xl bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-heading text-lg font-bold">{d.donor}</p>
                    <p className="font-heading text-xl font-bold">{moneyFormat.format(d.amount)}</p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink/70">{TYPE_LABEL[d.type]}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{dateFormat.format(new Date(d.date))}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <p className="mt-4 text-sm leading-6 text-ink/65">
        Aquí aparecen solo las donaciones exitosas. Es una vista de consulta: el dinero ya está en tu cuenta de Stripe.
      </p>

      <ConfirmDialog
        open={dialog === "vincular"}
        title="Completar el alta en Stripe"
        confirmLabel="Continuar a Stripe"
        onCancel={() => setDialog(null)}
        onConfirm={startLink}
      >
        <p>
          Stripe te pedirá los datos de tu refugio para crear tu cuenta de cobro. PetMatch no guarda tarjetas ni
          credenciales: solo el identificador de tu cuenta.
        </p>
        <p>Es una cuenta de prueba, así que no se mueve dinero real.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === "desvincular"}
        title="¿Desvincular tu cuenta de Stripe?"
        confirmLabel="Desvincular"
        onCancel={() => setDialog(null)}
        onConfirm={unlink}
      >
        <p>Tu refugio quedará sin vincular y la app dejará de permitir donaciones hasta que vuelvas a vincularla.</p>
        <p>
          {sponsorships === 0
            ? "No tienes apadrinamientos mensuales activos."
            : sponsorships === 1
              ? "Tu apadrinamiento mensual activo se cancelará y se avisará al donante."
              : `Tus ${sponsorships} apadrinamientos mensuales activos se cancelarán y se avisará a los donantes.`}{" "}
          El historial de donaciones se conserva.
        </p>
      </ConfirmDialog>
    </ShelterAdminLayout>
  );
}