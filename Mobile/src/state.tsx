import React, { createContext, useContext, useState } from "react";
import type { Perfil } from "./compat";
import {
  Apadrinamiento,
  DONACIONES_INICIALES,
  ENTREVISTAS_INICIALES,
  Entrevista,
  Donacion,
  HITOS_INICIALES,
  Hito,
  PERFIL_EJEMPLO,
  SOLICITUDES,
  Solicitud,
} from "./data";

type Estado = {
  sesion: boolean;
  nuevaCuenta: boolean;
  perfil: Perfil | null;
  solicitudes: Solicitud[];
  hitos: Hito[];
  donaciones: Donacion[];
  entrevistas: Entrevista[];
  apadrinamientos: Apadrinamiento[];
  iniciarSesion: () => void;
  registrar: () => void;
  cerrarSesion: () => void;
  guardarPerfil: (p: Perfil) => void;
  agregarSolicitud: (s: Solicitud) => void;
  completarHito: (dias: number) => void;
  agregarDonacion: (d: Donacion, apad?: Apadrinamiento) => void;
  cancelarApadrinamiento: (id: string) => void;
};

const Ctx = createContext<Estado>(null as unknown as Estado);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState(false);
  const [nuevaCuenta, setNueva] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES);
  const [hitos, setHitos] = useState(HITOS_INICIALES);
  const [donaciones, setDonaciones] = useState(DONACIONES_INICIALES);
  const [apadrinamientos, setApad] = useState<Apadrinamiento[]>([
    { id: "a1", refugioId: "sol", monto: 100 },
  ]);

  const value: Estado = {
    sesion,
    nuevaCuenta,
    perfil,
    solicitudes,
    hitos,
    donaciones,
    entrevistas: ENTREVISTAS_INICIALES,
    apadrinamientos,
    iniciarSesion: () => {
      setSesion(true);
      if (!nuevaCuenta && !perfil) setPerfil(PERFIL_EJEMPLO);
    },
    registrar: () => {
      setNueva(true);
      setPerfil(null);
    },
    cerrarSesion: () => setSesion(false),
    guardarPerfil: setPerfil,
    agregarSolicitud: (s) => setSolicitudes((x) => [s, ...x]),
    completarHito: (d) =>
      setHitos((hs) => hs.map((h) => (h.dias === d ? { ...h, completadoEn: new Date() } : h))),
    agregarDonacion: (d, a) => {
      setDonaciones((x) => [d, ...x]);
      if (a) setApad((x) => [a, ...x]);
    },
    cancelarApadrinamiento: (id) => setApad((x) => x.filter((a) => a.id !== id)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
