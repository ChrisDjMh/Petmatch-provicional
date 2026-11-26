import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Badge, Banner, Button, Card, estadoTone, Header, PetPhoto, Screen, T } from "../../src/components/ui";
import { Check } from "lucide-react-native";
import { fechaCorta, fechaHora, infoMascota, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

export default function DetalleSolicitud() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { c } = useTheme();
  const { solicitudes, entrevistas } = useApp();
  const s = solicitudes.find((x) => x.id === id);
  if (!s) return null;
  const entrevista = entrevistas.find((e) => e.solicitudId === s.id && e.tipo === "adopcion" && e.estado !== "Cancelada");
  const m = infoMascota(s.mascotaId);
  const ref = refugioPorId(m.refugioId);

  return (
    <Screen>
      <Header title="Mi solicitud" />
      <PetPhoto especie={m.especie} height={140} />
      <View style={{ gap: 6 }}>
        <T v="h1">{m.nombre}</T>
        <T v="muted">{ref.nombre} · {fechaCorta(s.fecha)}</T>
        <Badge label={s.estado} tone={estadoTone(s.estado)} />
      </View>

      {s.estado === "Rechazada" && <Banner tone="danger">{`Motivo del rechazo: ${s.motivoDecision}`}</Banner>}
      {s.estado === "Cancelada" && <Banner tone="cream">{`Motivo de la cancelación: ${s.motivoDecision}`}</Banner>}
      {s.estado === "Pendiente" && (
        <Banner tone="cream">
          {entrevista
            ? "El refugio agendó una entrevista en tu domicilio. Después de ella decidirá tu solicitud."
            : "El refugio está revisando tu solicitud. Si avanza, te propondrá una entrevista en tu domicilio."}
        </Banner>
      )}

      {s.estado !== "Cancelada" && (
        <Card style={{ gap: 10 }}>
          <T v="eyebrow">Proceso</T>
          {[
            { t: "Solicitud enviada", ok: true },
            { t: entrevista ? `Entrevista: ${fechaHora(entrevista.fecha)}` : "Entrevista en tu domicilio", ok: !!entrevista && entrevista.estado === "Realizada" },
            { t: s.estado === "Pendiente" ? "Decisión del refugio" : `Decisión: ${s.estado}`, ok: s.estado === "Aprobada" || s.estado === "Rechazada" },
          ].map((p, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: p.ok ? c.success : c.border, alignItems: "center", justifyContent: "center" }}>
                {p.ok ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
              </View>
              <T v="body" style={{ flex: 1, opacity: p.ok ? 1 : 0.7 }}>{p.t}</T>
            </View>
          ))}
          {entrevista && entrevista.estado === "Programada" && (
            <Button label="Ver entrevista" variant="light" onPress={() => router.push(`/entrevista/${entrevista.id}`)} />
          )}
        </Card>
      )}

      <Card>
        <T v="eyebrow">Lo que enviaste</T>
        <T v="label">Motivo</T>
        <T v="body">{s.motivo}</T>
        <T v="label">Vivienda</T>
        <T v="body">{s.vivienda}</T>
        <T v="label">Personas en el hogar</T>
        <T v="body">{s.personas}</T>
      </Card>

      {s.estado === "Aprobada" && s.contrato && <Button label="Ver contrato" onPress={() => router.push(`/contrato/${s.id}`)} />}
      {s.entregada && (
        <>
          <Button label="Ver seguimiento" variant="secondary" onPress={() => router.push("/seguimiento")} />
          <Button label="Donar a mi refugio" variant="light" onPress={() => router.push(`/donar/monto?tipo=post&refugio=${ref.id}`)} />
        </>
      )}
    </Screen>
  );
}

