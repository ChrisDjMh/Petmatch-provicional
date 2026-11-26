import { useLocalSearchParams, useRouter } from "expo-router";
import { Bell, Home } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Badge, Banner, Button, Card, Header, Screen, T } from "../../src/components/ui";
import { fechaHora, horaTexto, infoMascota, recordatorios, refugioPorId, tituloEntrevista, fechaCorta } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

// Detalle de entrevista: fecha, lugar (domicilio del adoptante), recordatorios y a qué solicitud/hito pertenece.
export default function DetalleEntrevista() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { c } = useTheme();
  const { entrevistas, solicitudes } = useApp();
  const e = entrevistas.find((x) => x.id === id);
  const s = solicitudes.find((x) => x.id === e?.solicitudId);
  if (!e || !s) return null;
  const m = infoMascota(s.mascotaId);
  const ref = refugioPorId(m.refugioId);
  const r = recordatorios(e);
  const programada = e.estado === "Programada";

  return (
    <Screen
      footer={
        e.tipo === "adopcion" ? (
          <Button label="Ver mi solicitud" variant="secondary" onPress={() => router.push(`/solicitud/${s.id}`)} />
        ) : (
          <Button label="Ver seguimiento" variant="secondary" onPress={() => router.push("/seguimiento")} />
        )
      }
    >
      <Header title="Entrevista" />
      <View style={{ gap: 6 }}>
        <T v="eyebrow">{e.tipo === "adopcion" ? "Adopción" : "Seguimiento post-adopción"}</T>
        <T v="h1">{tituloEntrevista(e)}</T>
        <Badge label={e.estado} tone={e.estado === "Programada" ? "cream" : e.estado === "Realizada" ? "success" : "neutral"} />
      </View>

      <Card tone={programada ? "cream" : "plain"}>
        <T v="muted" style={programada ? { color: "#2E2836" } : undefined}>Fecha y hora</T>
        <T v="h2" style={programada ? { color: "#2E2836" } : undefined}>{fechaCorta(e.fecha)}</T>
        <T v="h1" style={programada ? { color: "#2E2836" } : undefined}>{horaTexto(e.fecha)}</T>
      </Card>

      <Card style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Home size={24} color={c.ink} />
        <View style={{ flex: 1 }}>
          <T v="label">En tu domicilio</T>
          <T v="muted">Personal de {ref.nombre} te visitará para conocerte{e.tipo === "adopcion" ? " y valorar tu solicitud" : ` y ver cómo va ${m.nombre}`}.</T>
        </View>
      </Card>

      <Card>
        <T v="eyebrow">Mascota y refugio</T>
        <T v="h3">{m.nombre}</T>
        <T v="muted">{ref.nombre} · {ref.ciudad}</T>
      </Card>

      {programada && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Bell size={18} color={c.ink} />
            <T v="label">Te avisaremos con notificaciones</T>
          </View>
          <T v="muted">• El día anterior a las 12:00 p. m. ({fechaCorta(r.diaAntes)})</T>
          <T v="muted">• El mismo día, 3 horas antes ({horaTexto(r.tresHorasAntes)})</T>
        </Card>
      )}

      {e.tipo === "adopcion" && programada && (
        <Banner tone="cream">Después de la entrevista, el refugio decidirá si aprueba o rechaza tu solicitud. Te avisaremos con una notificación.</Banner>
      )}
      {e.estado === "Realizada" && <Banner tone="success">Esta entrevista ya se realizó.</Banner>}
      {e.estado === "Cancelada" && <Banner tone="cream">{`Motivo de la cancelación: ${e.motivoCancelacion}`}</Banner>}
    </Screen>
  );
}
