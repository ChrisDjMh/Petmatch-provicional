import type { ReactNode } from "react";
import Footer from "@/components/compartidos/Footer";
import Navbar from "@/components/compartidos/Navbar";
import Reveal from "@/components/compartidos/Reveal";
import Section from "@/components/compartidos/Section";

/*
  BORRADOR del aviso de privacidad, escrito a partir del SRS v1.0.
  Antes de publicarlo, completa lo que está entre [corchetes] (responsable y domicilio)
  y pide que alguien con conocimiento legal lo revise.
*/

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

const CONTACT_EMAIL = "hola@petmatch.mx";

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "responsable",
    title: "Quién es responsable de tus datos",
    body: (
      <>
        <p>
          PetMatch es una plataforma web y móvil que conecta refugios de animales con personas que
          quieren adoptar. Es un proyecto integrador del grupo IDGS 9-2 de la Universidad
          Tecnológica de San Luis Río Colorado.
        </p>
        <p>
          El responsable del tratamiento de tus datos personales es [nombre del responsable del
          proyecto], con domicilio en [domicilio]. Para cualquier asunto sobre tus datos puedes
          escribir a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-extrabold underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "datos",
    title: "Qué datos recopilamos",
    body: (
      <>
        <p className="font-extrabold">Si adoptas (app móvil):</p>
        <List
          items={[
            "Nombre, correo electrónico y contraseña. Tu contraseña nunca se guarda ni se muestra en texto plano.",
            "Tu perfil de compatibilidad: espacio de tu vivienda, horas al día en casa, experiencia con mascotas, nivel de compromiso, si hay niños en casa y si tienes otras mascotas.",
            "Al solicitar una adopción: tu motivo para adoptar, tipo de vivienda y número de personas en el hogar.",
            "Después de adoptar: estado de salud y adaptación de la mascota, comentarios y fotos de cada hito de seguimiento.",
            "Tu historial de donaciones: fecha, refugio, tipo y monto.",
          ]}
        />
        <p className="pt-2 font-extrabold">Si representas o administras un refugio (panel web):</p>
        <List
          items={[
            "Nombre del refugio y del responsable, correo, teléfono, ciudad, dirección y descripción.",
            "Documentos de registro: identificación oficial del responsable, comprobante de domicilio y un documento que respalde la existencia del refugio, además de fotos del refugio.",
            "Correo y contraseña de acceso.",
          ]}
        />
        <p className="pt-2">
          Para enviarte notificaciones a tu teléfono usamos el identificador de tu dispositivo.
          Solo pedimos los datos que necesitamos para ofrecerte el servicio.
        </p>
      </>
    ),
  },
  {
    id: "usos",
    title: "Para qué usamos tus datos",
    body: (
      <List
        items={[
          "Crear y proteger tu cuenta, confirmar tu correo y ayudarte a recuperar tu contraseña.",
          "Revisar y resolver las solicitudes de registro de refugios.",
          "Mostrarte las mascotas compatibles con tu perfil.",
          "Tramitar tu solicitud de adopción, generar el contrato digital y registrar la entrega.",
          "Darte seguimiento después de adoptar: recordatorios y formularios de cada hito.",
          "Registrar tus donaciones y mostrarte tu historial.",
          "Enviarte avisos y notificaciones sobre tus trámites.",
          "Guardar una bitácora de cambios de estado para tener trazabilidad del sistema.",
        ]}
      />
    ),
  },
  {
    id: "compartimos",
    title: "Con quién compartimos tus datos",
    body: (
      <>
        <List
          items={[
            "Refugios. Cuando envías una solicitud de adopción, el refugio dueño de esa mascota ve tus datos, tus respuestas y tu perfil de compatibilidad. Un refugio solo ve los datos de quienes solicitaron adoptar sus mascotas.",
            "Equipo de PetMatch. El Super Admin revisa los documentos y fotos de los refugios que piden registrarse. Esos documentos solo los ven el Super Admin y el propio refugio.",
            "Proveedores del servicio: Stripe (pagos), Firebase Cloud Messaging (notificaciones push) y un servicio de correo electrónico (confirmación de cuenta, recuperación de contraseña y resultado de solicitudes).",
          ]}
        />
        <p className="pt-2">
          No vendemos tus datos ni los usamos para publicidad. Solo los entregaríamos a una
          autoridad si nos lo exige la ley.
        </p>
      </>
    ),
  },
  {
    id: "pagos",
    title: "Donaciones y pagos",
    body: (
      <>
        <p>
          Las donaciones son voluntarias y se pagan con Stripe. PetMatch no guarda tu tarjeta, tus
          métodos de pago ni datos bancarios: eso vive únicamente en Stripe. Nosotros solo
          conservamos los identificadores de Stripe que necesitamos para registrar la donación.
        </p>
        <p>
          El dinero de cada donación va directo a la cuenta del refugio. PetMatch no retiene
          fondos ni cobra comisión.
        </p>
        <p>
          Por ahora, los pagos funcionan únicamente en modo de prueba: no se procesa dinero real.
        </p>
      </>
    ),
  },
  {
    id: "permisos",
    title: "Permisos de tu teléfono",
    body: (
      <p>
        La app te pide acceso a la cámara, a la galería y a las notificaciones solo cuando vas a
        usarlos por primera vez, y te explica para qué. Si los niegas, el resto de la app sigue
        funcionando.
      </p>
    ),
  },
  {
    id: "seguridad",
    title: "Cómo protegemos tus datos",
    body: (
      <List
        items={[
          "Tu contraseña nunca se guarda en texto plano.",
          "La comunicación entre las aplicaciones y el servidor va cifrada (HTTPS).",
          "Cada persona solo accede a lo que le corresponde según su rol: adoptante, refugio o Super Admin.",
          "Los documentos de registro de un refugio están protegidos y solo los leen el Super Admin y el propio refugio.",
          "La bitácora de cambios no se puede editar ni borrar.",
        ]}
      />
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    body: (
      <>
        <p>
          Puedes acceder a tus datos, corregirlos, pedir que se cancelen u oponerte a que los
          usemos (derechos ARCO), y retirar tu consentimiento cuando quieras.
        </p>
        <p>
          Para ejercerlos escribe a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-extrabold underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>{" "}
          desde el correo de tu cuenta, con tu nombre y el derecho que quieres ejercer. Te
          responderemos por el mismo medio.
        </p>
        <p>
          Algunos registros, como la bitácora de cambios de estado, no se pueden borrar para
          mantener la trazabilidad del sistema.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a este aviso",
    body: (
      <p>
        Si actualizamos este aviso, publicaremos la nueva versión en esta página con su fecha. Si
        el cambio es importante, también te avisaremos en la app o por correo.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />

      <main>
        <Section className="pb-24 pt-32 sm:pb-32 sm:pt-40">
          <div className="anim-fade-up rounded-[2.5rem] bg-linear-to-br from-cards to-cards-2 px-6 py-12 sm:px-12 sm:py-16">
            <p className="eyebrow text-ink/70">Legal</p>
            <h1 className="section-title mt-4">Aviso de privacidad</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
              En PetMatch cuidamos tus datos. Aquí te explicamos, en palabras sencillas, qué
              información pedimos, para qué la usamos y cómo puedes ejercer tus derechos.
            </p>
            <p className="mt-5 text-sm font-bold text-ink/65">Última actualización: noviembre de 2026</p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <nav aria-label="Contenido del aviso" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">
                Contenido
              </p>
              <ol className="mt-4 space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-3 rounded-xl px-3 py-2 text-sm font-bold text-ink/75 transition-colors hover:bg-cards-2/50 hover:text-ink"
                    >
                      <span className="font-heading text-cards">{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-3xl space-y-12">
              {sections.map((section, index) => (
                <Reveal key={section.id}>
                  <section id={section.id} aria-labelledby={`${section.id}-title`}>
                    <h2
                      id={`${section.id}-title`}
                      className="flex items-baseline gap-3 font-heading text-2xl font-bold sm:text-3xl"
                    >
                      <span className="text-cards">{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-3 text-base leading-7 text-ink/80">{section.body}</div>
                  </section>
                </Reveal>
              ))}
            </article>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}