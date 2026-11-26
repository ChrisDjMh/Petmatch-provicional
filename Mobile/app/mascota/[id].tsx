import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { evaluar } from "../../src/compat";
import { Badge, Button, Card, Header, PetPhoto, Screen, T } from "../../src/components/ui";
import { edadTexto, mascotaPorId, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

export default function DetalleMascota() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { c } = useTheme();
  const { perfil } = useApp();
  const m = mascotaPorId(id);
  if (!m) return null;
  const ref = refugioPorId(m.refugioId);
  const ev = perfil ? evaluar(perfil, m.req) : null;
  const disponible = m.estado === "Disponible";

  return (
    <Screen
      footer={
        <Button
          label={disponible ? "Solicitar adopción" : "No disponible"}
          disabled={!disponible}
          onPress={() => router.push(`/solicitar/${m.id}`)}
        />
      }
    >
      <Header />
      {/* Carrusel de 1 a 5 fotos (RF-20) */}
      <View>
        <PetPhoto especie={m.especie} height={260} radius={28} />
        <View style={{ flexDirection: "row", gap: 6, justifyContent: "center", marginTop: 10 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ width: i === 0 ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i === 0 ? c.cards : c.border }} />
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <T v="h1">{m.nombre}</T>
        {ev && <Badge label={`${ev.cumplidos}/6`} tone={ev.cumplidos === 6 ? "success" : "cream"} />}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Badge label={m.especie} tone="pink" />
        <Badge label={m.sexo} tone="pink" />
        <Badge label={m.tamano} tone="pink" />
        <Badge label={edadTexto(m.edadMeses)} tone="pink" />
        <Badge label={`Actividad ${m.actividad.toLowerCase()}`} tone="pink" />
      </View>

      <Card onPress={() => router.push(`/refugio/${ref.id}`)} tone="cream">
        <T v="eyebrow" style={{ color: c.ink }}>Refugio</T>
        <T v="h3">{ref.nombre}</T>
        <T v="muted">{ref.ciudad}</T>
      </Card>

      <View style={{ gap: 6 }}>
        <T v="eyebrow">Sobre {m.nombre}</T>
        <T v="body">{m.descripcion}</T>
      </View>

      <View style={{ gap: 10 }}>
        <T v="eyebrow">¿Es compatible contigo?</T>
        {ev ? (
          ev.criterios.map((k) => (
            <Card key={k.clave} tone={k.cumple ? "plain" : "plain"} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: k.cumple ? c.surface : c.dangerSoft, padding: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: k.cumple ? c.successSoft : c.danger, alignItems: "center", justifyContent: "center" }}>
                {k.cumple ? <Check size={18} color={c.success} strokeWidth={3} /> : <X size={18} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View style={{ flex: 1 }}>
                <T v="label">{k.titulo}</T>
                <T v="muted">Pide: {k.pide}</T>
                <T v="muted" style={!k.cumple ? { color: c.danger } : undefined}>Tú: {k.ofreces}</T>
              </View>
            </Card>
          ))
        ) : (
          <Card tone="cream">
            <T v="muted">Completa tu perfil de compatibilidad para ver qué criterios cumples.</T>
            <Button label="Completar perfil" onPress={() => router.push("/perfil-compatibilidad")} />
          </Card>
        )}
      </View>
    </Screen>
  );
}
