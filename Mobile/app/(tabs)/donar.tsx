import { useRouter } from "expo-router";
import { Gift, HandHeart, Repeat } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Card, Screen, T } from "../../src/components/ui";
import { REFUGIOS } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

export default function Donar() {
  const router = useRouter();
  const { c } = useTheme();
  const { solicitudes } = useApp();
  const adopcion = solicitudes.find((s) => s.entregada);
  const elegibles = REFUGIOS.filter((r) => r.activo && r.stripeVinculada);

  const Opcion = ({ Icon, titulo, desc, tipo, tone }: { Icon: any; titulo: string; desc: string; tipo: string; tone: "pink" | "cream" | "peach" }) => (
    <Card tone={tone} onPress={() => router.push(`/donar/monto?tipo=${tipo}`)} style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.background, alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} color={c.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <T v="h3" style={{ color: c.ink }}>{titulo}</T>
        <T v="muted" style={{ color: c.muted }}>{desc}</T>
      </View>
    </Card>
  );

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T v="eyebrow">Ayuda a un refugio</T>
        <T v="h1">Donar</T>
        <T v="muted">Las donaciones son voluntarias y el 100 % llega al refugio. PetMatch no cobra comisión.</T>
      </View>
      <Opcion Icon={HandHeart} titulo="Donación única" desc="Un aporte de una sola vez" tipo="unica" tone="pink" />
      <Opcion Icon={Repeat} titulo="Apadrinar" desc="Un cargo mensual a un refugio o mascota" tipo="mensual" tone="cream" />
      {adopcion && <Opcion Icon={Gift} titulo="Donación post-adopción" desc="Agradece al refugio donde adoptaste" tipo="post" tone="peach" />}

      <T v="h2" style={{ marginTop: 8 }}>Refugios que reciben donaciones</T>
      {elegibles.map((r) => (
        <Card key={r.id} onPress={() => router.push(`/donar/monto?tipo=unica&refugio=${r.id}`)}>
          <T v="h3">{r.nombre}</T>
          <T v="muted">{r.ciudad}</T>
        </Card>
      ))}
    </Screen>
  );
}
