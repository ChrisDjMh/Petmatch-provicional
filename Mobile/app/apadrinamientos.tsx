import React, { useState } from "react";
import { View } from "react-native";
import { Button, Card, Empty, Header, Screen, Sheet, T } from "../src/components/ui";
import { mascotaPorId, mxn, refugioPorId } from "../src/data";
import { useApp } from "../src/state";

// Apadrinamientos activos y cancelación (RF-50).
export default function Apadrinamientos() {
  const { apadrinamientos, cancelarApadrinamiento } = useApp();
  const [cancelar, setCancelar] = useState<string | null>(null);
  return (
    <Screen>
      <Header title="Mis apadrinamientos" />
      {apadrinamientos.length === 0 ? (
        <Empty title="No tienes apadrinamientos activos" text="Apadrina a un refugio o mascota desde la pestaña Donar." />
      ) : (
        apadrinamientos.map((a) => (
          <Card key={a.id}>
            <T v="h3">{a.mascotaId ? `${mascotaPorId(a.mascotaId)?.nombre} · ` : ""}{refugioPorId(a.refugioId).nombre}</T>
            <T v="muted">{mxn(a.monto)} MXN al mes</T>
            <View style={{ marginTop: 6 }}>
              <Button label="Cancelar apadrinamiento" variant="secondary" onPress={() => setCancelar(a.id)} />
            </View>
          </Card>
        ))
      )}
      <Sheet visible={!!cancelar} onClose={() => setCancelar(null)} title="¿Cancelar apadrinamiento?">
        <T v="muted">Ya no se harán cargos mensuales.</T>
        <Button label="Sí, cancelar" variant="danger" onPress={() => { cancelarApadrinamiento(cancelar!); setCancelar(null); }} />
        <Button label="Mantener" variant="secondary" onPress={() => setCancelar(null)} />
      </Sheet>
    </Screen>
  );
}
