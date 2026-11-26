import React from "react";
import { View } from "react-native";
import { Badge, Card, Empty, Header, Screen, T } from "../src/components/ui";
import { fechaCorta, mxn, refugioPorId } from "../src/data";
import { useApp } from "../src/state";

// Historial de donaciones y total donado (RF-55).
export default function Donaciones() {
  const { donaciones } = useApp();
  const total = donaciones.reduce((s, d) => s + d.monto, 0);
  return (
    <Screen>
      <Header title="Mis donaciones" />
      <Card tone="cream">
        <T v="eyebrow" style={{ color: "#2E2836" }}>Total donado</T>
        <T v="h1" style={{ color: "#2E2836" }}>{mxn(total)} MXN</T>
      </Card>
      {donaciones.length === 0 ? (
        <Empty title="Aún no has donado" text="Cuando hagas una donación aparecerá aquí." />
      ) : (
        donaciones.map((d) => (
          <Card key={d.id} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <T v="h3">{refugioPorId(d.refugioId).nombre}</T>
              <T v="muted">{fechaCorta(d.fecha)}</T>
              <Badge label={d.tipo} tone="pink" />
            </View>
            <T v="h3">{mxn(d.monto)}</T>
          </Card>
        ))
      )}
    </Screen>
  );
}
