import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/compartidos/Footer";
import Hero from "./components/principal/Hero";
import Navbar from "./components/compartidos/Navbar";
import Section from "./components/compartidos/Section";
import ShelterSteps from "./components/principal/ShelterSteps";
import LoginPage from "@/pages/LoginPage";

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
          <div className="relative overflow-hidden rounded-[2.75rem] bg-accent px-6 py-16 sm:px-12 lg:px-20 lg:py-20">
            <div className="absolute -right-14 -top-24 size-72 rounded-full border-[44px] border-cards-2/50" />
            <div className="absolute -bottom-24 right-48 size-44 rounded-full bg-accent-warm/70" />
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
        </Section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}