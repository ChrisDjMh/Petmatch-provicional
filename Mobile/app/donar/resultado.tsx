import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Header, Screen, T } from "../../src/components/ui";
import { mxn, refugioPorId } from "../../src/data";

export default function Resultado() {
  const { ok, tipo, refugio, monto } = useLocalSearchParams<{ ok: string; tipo: string; refugio: string; monto: string }>();
  const router = useRouter();
  const exito = ok === "1";
  return (
    <Screen
      footer={
        exito ? (
          <Button label="Ver mi historial" onPress={() => router.replace("/donaciones")} />
        ) : (
          <View style={{ gap: 12 }}>
            <Button label="Reintentar" onPress={() => router.back()} />
            <Button label="Cancelar" variant="secondary" onPress={() => router.replace("/donar")} />
          </View>
        )
      }
    >
      <Header back={false} />
      <View style={{ alignItems: "center", gap: 12, paddingTop: 32 }}>
        <T style={{ fontSize: 72 }}>{exito ? "💜" : "⚠️"}</T>
        <T v="h1" style={{ textAlign: "center" }}>{exito ? "¡Gracias por tu donación!" : "No se pudo completar el pago"}</T>
        {exito ? (
          <T v="muted" style={{ textAlign: "center" }}>
            Donaste {mxn(Number(monto))} a {refugioPorId(refugio).nombre}{tipo === "mensual" ? " (cargo mensual)" : ""}. Recibirás una notificación de confirmación.
          </T>
        ) : (
          <T v="muted" style={{ textAlign: "center" }}>Tu tarjeta fue rechazada. Revisa los datos o prueba con otra tarjeta. No se hizo ningún cobro.</T>
        )}
      </View>
    </Screen>
  );
}
