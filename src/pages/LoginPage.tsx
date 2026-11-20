import Footer from "@/components/compartidos/Footer";
import Navbar from "@/components/compartidos/Navbar";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="relative overflow-hidden bg-ink p-8 text-background sm:p-12 lg:p-14">
            <div className="absolute -bottom-10 -right-10 hidden size-40 bg-cards lg:block" aria-hidden="true" />
            <div className="absolute -bottom-4 right-24 hidden size-20 bg-accent-warm lg:block" aria-hidden="true" />

            <div className="relative">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                Bienvenido de vuelta
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Tu refugio, en un solo lugar
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-background/80">
                Gestiona tus mascotas, revisa solicitudes de adopción y da seguimiento a cada
                nueva historia.
              </p>

              <p className="mt-10 max-w-sm border-t border-background/20 pt-6 text-sm leading-6 text-background/75">
                ¿Eres adoptante? Usa la app móvil de PetMatch para Android. Este panel web es solo
                para refugios y administradores.
              </p>
            </div>
          </aside>

          <section className="bg-cards-2/40 p-8 sm:p-12 lg:p-16">
            <LoginForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}