import { useRouter } from "expo-router";
import { Check, Clock, Hourglass, TriangleAlert } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Badge, Button, Card, Empty, Screen, T, Tone } from "../../src/components/ui";
import { ADOPTADA, EstadoHito, estadoHito, fechaCorta, fechaHora, fechaHito, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

const tono: Record<EstadoHito, Tone> = {
  Próximo: "neutral",
  Disponible: "peach",
  Completado: "success",
  Vencido: "danger",
  "Completado con retraso": "success",
};

export default function Seguimiento() {
  const router = useRouter();
  const { c } = useTheme();
  const { hitos, solicitudes, entrevistas } = useApp();
  const adopcion = solicitudes.find((s) => s.entregada);

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T v="eyebrow">Después de adoptar</T>
        <T v="h1">Seguimiento</T>
      </View>
      {!adopcion ? (
        <Empty title="Aún no hay seguimientos" text="Cuando adoptes, aquí verás tus 5 hitos de seguimiento." />
      ) : (
        <>
          <Card tone="pink">
            <T v="h3">{ADOPTADA.nombre}</T>
            <T v="muted">{refugioPorId(ADOPTADA.refugioId).nombre}</T>
          </Card>
          {hitos.map((h) => {
            const e = estadoHito(h);
            const Icono = e === "Próximo" ? Clock : e === "Disponible" ? Hourglass : e === "Vencido" ? TriangleAlert : Check;
            const puede = e === "Disponible" || e === "Vencido";
            return (
              <Card key={h.dias} style={{ gap: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: e === "Vencido" ? c.dangerSoft : e.startsWith("Completado") ? c.successSoft : e === "Disponible" ? c.warm : c.surfaceAlt, alignItems: "center", justifyContent: "center" }}>
                    <Icono size={22} color={e === "Vencido" ? c.danger : e.startsWith("Completado") ? c.success : c.ink} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T v="h3">Hito de {h.dias} días</T>
                    <T v="muted">{fechaCorta(fechaHito(h))}</T>
                  </View>
                  <Badge label={e === "Completado con retraso" ? "Con retraso" : e} tone={tono[e]} />
                </View>
                {entrevistas.filter((x) => x.tipo === "hito" && x.hitoDias === h.dias && x.estado !== "Cancelada").map((x) => (
                  <Pressable key={x.id} onPress={() => router.push(`/entrevista/${x.id}`)}>
                    <Badge label={`Entrevista ${x.estado === "Realizada" ? "realizada" : "programada"}: ${fechaHora(x.fecha)}`} tone={x.estado === "Realizada" ? "success" : "cream"} />
                  </Pressable>
                ))}
                {puede && (
                  <Button label={e === "Vencido" ? "Registrar con retraso" : "Registrar"} variant={e === "Vencido" ? "secondary" : "primary"} onPress={() => router.push(`/hito/${h.dias}`)} />
                )}
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}
