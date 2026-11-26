import { useRouter } from "expo-router";
import { CalendarClock, CalendarCheck, CalendarX } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Badge, Card, Empty, T, Tone } from "./ui";
import { Entrevista, fechaHora, infoMascota, tituloEntrevista } from "../data";
import { useApp } from "../state";
import { useTheme } from "../theme";

const tono: Record<Entrevista["estado"], Tone> = { Programada: "cream", Realizada: "success", Cancelada: "neutral" };

// Lista de entrevistas: pendientes primero (por fecha) y luego el historial.
export function EntrevistasLista() {
  const router = useRouter();
  const { c } = useTheme();
  const { entrevistas, solicitudes } = useApp();
  const pendientes = entrevistas.filter((e) => e.estado === "Programada").sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  const historial = entrevistas.filter((e) => e.estado !== "Programada").sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  const Item = ({ e }: { e: Entrevista }) => {
    const s = solicitudes.find((x) => x.id === e.solicitudId);
    const m = s ? infoMascota(s.mascotaId) : undefined;
    const Icono = e.estado === "Programada" ? CalendarClock : e.estado === "Realizada" ? CalendarCheck : CalendarX;
    return (
      <Pressable onPress={() => router.push(`/entrevista/${e.id}`)}>
        <Card style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: e.estado === "Programada" ? c.accent : c.surfaceAlt, alignItems: "center", justifyContent: "center" }}>
            <Icono size={24} color={c.ink} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <T v="h3">{tituloEntrevista(e)}</T>
            <T v="muted">{m?.nombre} · {fechaHora(e.fecha)}</T>
            <Badge label={e.estado} tone={tono[e.estado]} />
          </View>
        </Card>
      </Pressable>
    );
  };

  if (entrevistas.length === 0)
    return <Empty title="No tienes entrevistas" text="Cuando un refugio agende una entrevista contigo, la verás aquí." />;

  return (
    <View style={{ gap: 12 }}>
      <T v="eyebrow">Pendientes</T>
      {pendientes.length === 0 ? <T v="muted">No tienes entrevistas pendientes.</T> : pendientes.map((e) => <Item key={e.id} e={e} />)}
      {historial.length > 0 && (
        <>
          <T v="eyebrow" style={{ marginTop: 8 }}>Historial</T>
          {historial.map((e) => <Item key={e.id} e={e} />)}
        </>
      )}
    </View>
  );
}
