export type PrivacyNoticeStatus = "Publicado" | "Borrador";

export type PrivacyNotice = {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  status: PrivacyNoticeStatus;
  content: string;
  updatedAt: string;
};

// Contenido demostrativo para el prototipo. Debe sustituirse por el texto legal aprobado.
export const initialPrivacyNotices: PrivacyNotice[] = [
  {
    id: "aviso-001",
    title: "Aviso de privacidad de PetMatch",
    version: "1.0",
    effectiveDate: "2026-01-01",
    status: "Publicado",
    content:
      "Este es un texto de ejemplo para visualizar la administración del aviso de privacidad en el prototipo de PetMatch. Sustituye este contenido por el aviso legal aprobado antes de publicar la plataforma.\n\nAquí se deberá explicar qué datos personales se recopilan, para qué se utilizan, cómo se protegen y cuáles son los medios disponibles para ejercer los derechos correspondientes.",
    updatedAt: "2026-01-01",
  },
];
