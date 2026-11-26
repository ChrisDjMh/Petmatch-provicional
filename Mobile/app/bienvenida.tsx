import { useRouter } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { Button, Screen, T } from "../src/components/ui";

export default function Bienvenida() {
  const router = useRouter();
  return (
    <Screen
      scroll={false}
      footer={
        <View style={{ gap: 12 }}>
          <Button label="Crear cuenta" onPress={() => router.push("/registro")} />
          <Button label="Iniciar sesión" variant="secondary" onPress={() => router.push("/login")} />
        </View>
      }
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
        <Image source={require("../assets/petmatch-hero.png")} style={{ width: 280, height: 280, borderRadius: 40 }} resizeMode="cover" />
        <T v="eyebrow">Adopta con compatibilidad</T>
        <T v="h1" style={{ textAlign: "center", fontSize: 34, lineHeight: 38 }}>PetMatch</T>
        <T v="muted" style={{ textAlign: "center", fontSize: 16 }}>
          Encuentra a la mascota que mejor encaja con tu estilo de vida.
        </T>
      </View>
    </Screen>
  );
}
