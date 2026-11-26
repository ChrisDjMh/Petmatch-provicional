import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { evaluar, MINIMO_COMPATIBLE } from "../../src/compat";
import { Badge, Button, Card, Header, PetPhoto, Screen, T } from "../../src/components/ui";
import { edadTexto, MASCOTAS, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";

export default function FichaRefugio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { perfil } = useApp();
  const ref = refugioPorId(id);
  const lista = MASCOTAS.filter((m) => m.refugioId === id && m.estado === "Disponible" && perfil && evaluar(perfil, m.req).cumplidos >= MINIMO_COMPATIBLE);
  const puedeDonar = ref.activo && ref.stripeVinculada; // RF-47, RN-13

  return (
    <Screen footer={puedeDonar ? <Button label="Donar a este refugio" variant="light" onPress={() => router.push(`/donar/monto?tipo=unica&refugio=${id}`)} /> : undefined}>
      <Header />
      {!puedeDonar && <Card tone="cream"><T v="muted" style={{ color: "#2E2836" }}>Este refugio aún no puede recibir donaciones.</T></Card>}
      <T v="eyebrow">Refugio</T>
      <T v="h1">{ref.nombre}</T>
      <T v="muted">{ref.ciudad}</T>
      <T v="body">{ref.descripcion}</T>
      <T v="h2" style={{ marginTop: 8 }}>Mascotas compatibles contigo</T>
      {lista.length === 0 ? (
        <Card tone="cream"><T v="muted">Este refugio no tiene mascotas compatibles con tu perfil por ahora.</T></Card>
      ) : (
        lista.map((m, i) => (
          <Pressable key={m.id} onPress={() => router.push(`/mascota/${m.id}`)}>
            <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10 }}>
              <View style={{ width: 84 }}><PetPhoto especie={m.especie} height={84} radius={16} tone={i} /></View>
              <View style={{ flex: 1, gap: 4 }}>
                <T v="h3">{m.nombre}</T>
                <T v="muted">{m.especie} · {edadTexto(m.edadMeses)}</T>
                <Badge label={`${evaluar(perfil!, m.req).cumplidos}/6`} tone="cream" />
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
