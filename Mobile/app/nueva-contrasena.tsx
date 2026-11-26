import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Banner, Button, Field, Header, Screen, T } from "../src/components/ui";

// El enlace del correo abre esta pantalla; ?estado=vencido simula un enlace usado o vencido (RF-05).
export default function NuevaContrasena() {
  const router = useRouter();
  const { estado } = useLocalSearchParams<{ estado?: string }>();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});

  const guardar = () => {
    const e: Record<string, string> = {};
    if (a.length < 8) e.a = "La contraseña debe tener al menos 8 caracteres.";
    if (b !== a) e.b = "Las contraseñas no coinciden. Escríbela igual en ambos campos.";
    setErr(e);
    if (!Object.keys(e).length) router.replace("/login");
  };

  if (estado === "vencido")
    return (
      <Screen footer={<Button label="Pedir otro enlace" onPress={() => router.replace("/olvide-contrasena")} />}>
        <Header back={false} />
        <T v="h1">El enlace ya no sirve</T>
        <Banner tone="danger">Este enlace ya se usó o tiene más de 1 hora. Pide uno nuevo para cambiar tu contraseña.</Banner>
      </Screen>
    );

  return (
    <Screen>
      <Header back={false} />
      <View style={{ gap: 6 }}>
        <T v="h1">Nueva contraseña</T>
        <T v="muted">Elige una contraseña de al menos 8 caracteres. La anterior dejará de funcionar.</T>
      </View>
      <Field label="Nueva contraseña" secure value={a} onChangeText={setA} error={err.a} placeholder="Mínimo 8 caracteres" />
      <Field label="Confirma la contraseña" secure value={b} onChangeText={setB} error={err.b} placeholder="Repite la contraseña" />
      <Button label="Guardar contraseña" onPress={guardar} />
    </Screen>
  );
}
