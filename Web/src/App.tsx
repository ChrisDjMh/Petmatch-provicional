import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/compartidos/Footer";
import Hero from "./components/principal/Hero";
import Navbar from "./components/compartidos/Navbar";
import Reveal from "./components/compartidos/Reveal";
import Section from "./components/compartidos/Section";
import ShelterSteps from "./components/principal/ShelterSteps";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import RegisterShelterPage from "@/pages/RegisterShelterPage";
import ShelterRequestStatusPage from "@/pages/ShelterRequestStatusPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage";
import SuperAdminLoginPage from "@/pages/SuperAdminLoginPage";
import PendingRequestsPage from "@/pages/superadmin/PendingRequestsPage";
import RequestDetailPage from "@/pages/superadmin/RequestDetailPage";
import ActiveSheltersPage from "@/pages/superadmin/ActiveSheltersPage";
import DonationsPage from "@/pages/superadmin/DonationsPage";
import LogPage from "@/pages/superadmin/LogPage";
import ShelterHomePage from "@/pages/refugio/HomePage";
import ShelterPetsPage from "@/pages/refugio/PetsPage";
import ShelterAdoptionsPage from "@/pages/refugio/AdoptionsPage";
import ShelterAdoptionDetailPage from "@/pages/refugio/AdoptionDetailPage";
import ShelterContractPage from "@/pages/refugio/ContractPage";
import ShelterFollowUpPage from "@/pages/refugio/FollowUpPage";
import ShelterPetFormPage from "@/pages/refugio/PetFormPage";
import ShelterDonationsPage from "@/pages/refugio/DonationsPage";
import ShelterScheduleInterviewsPage from "@/pages/refugio/ScheduleInterviewsPage";
import ShelterAgendaPage from "@/pages/refugio/AgendaPage";
import InterviewsPage from "@/pages/superadmin/InterviewsPage";


const criteria = [
  { number: "01", label: "Espacio disponible" },
  { number: "02", label: "Tiempo en casa" },
  { number: "03", label: "Experiencia previa" },
  { number: "04", label: "Compromiso" },
  { number: "05", label: "Niños en casa" },
  { number: "06", label: "Otras mascotas" },
];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />
      <main>
        <Hero />

   
        
        <ShelterSteps />

        <Section className="pb-24 sm:pb-32">
          <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[2.75rem] bg-accent px-6 py-16 sm:px-12 lg:px-20 lg:py-20">
            <div className="anim-float absolute -right-14 -top-24 size-72 rounded-full border-[44px] border-cards-2/50" />
            <div
              className="anim-float absolute -bottom-24 right-48 size-44 rounded-full bg-accent-warm/70"
              style={{ animationDuration: "11s", animationDelay: "-3s" }}
            />
            <div className="relative max-w-3xl">
              <p className="eyebrow">Crezcamos juntos</p>
              <h2 className="section-title mt-4">¿Tienes un refugio? Súmate a PetMatch</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-ink/75">
                Publica a tus mascotas, gestiona cada solicitud y acompaña sus nuevas historias
                desde un solo lugar.
              </p>
              <a href="/registro-refugio" className="button-primary mt-8 inline-flex">
                Registrar mi refugio
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

/* Al cambiar de página: sube al inicio y la nueva página aparece con un fade. */
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div key={location.pathname} className="anim-fade-in">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LandingPage />} />
        <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />
        <Route path="/nueva-contrasena" element={<ResetPasswordPage />} />
        <Route path="/registro-refugio" element={<RegisterShelterPage />} />
        <Route path="/mi-solicitud" element={<ShelterRequestStatusPage />} />
        <Route path="/aviso-de-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/confirmar-correo" element={<ConfirmEmailPage />} />
        <Route path="/acceso-interno" element={<SuperAdminLoginPage />} />
        <Route path="/admin/solicitudes" element={<PendingRequestsPage />} />
        <Route path="/admin/solicitudes/:id" element={<RequestDetailPage />} />
        <Route path="/admin/refugios" element={<ActiveSheltersPage />} />
        <Route path="/admin/donaciones" element={<DonationsPage />} />
        <Route path="/admin/bitacora" element={<LogPage />} />
        <Route path="/refugio/inicio" element={<ShelterHomePage />} />
        <Route path="/refugio/mascotas" element={<ShelterPetsPage />} />
        <Route path="/refugio/adopciones" element={<ShelterAdoptionsPage />} />
        <Route path="/refugio/adopciones/:id" element={<ShelterAdoptionDetailPage />} />
        <Route path="/refugio/adopciones/:id/contrato" element={<ShelterContractPage />} />
        <Route path="/refugio/adopciones/seguimiento" element={<ShelterFollowUpPage />} />
        <Route path="/refugio/mascotas/nueva" element={<ShelterPetFormPage />} />
        <Route path="/refugio/mascotas/:id/editar" element={<ShelterPetFormPage />} />
        <Route path="/refugio/donaciones" element={<ShelterDonationsPage />} />
        <Route path="/refugio/entrevistas" element={<ShelterScheduleInterviewsPage />} />
        <Route path="/refugio/entrevistas/agenda" element={<ShelterAgendaPage />} />
        <Route path="/admin/entrevistas" element={<InterviewsPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}