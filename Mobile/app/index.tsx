import { Redirect } from "expo-router";
import { useApp } from "../src/state";

// Splash: con sesión → Explorar; sin sesión → Bienvenida (RF-03).
export default function Index() {
  const { sesion, perfil } = useApp();
  if (!sesion) return <Redirect href="/bienvenida" />;
  if (!perfil) return <Redirect href="/perfil-compatibilidad" />;
  return <Redirect href="/explorar" />;
}
