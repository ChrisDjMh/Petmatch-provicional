import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Banner, Button, Field, Header, Screen, T } from "../src/components/ui";

export default function OlvideContrasena() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string>();
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    if (!/^\S+@\S+\.\S+$/.test(correo)) return setError("Escribe un correo válido, por ejemplo nombre@correo.com.");
    setError(undefined);
    setEnviado(true); // Mismo mensaje exista o no la cuenta (RF-05).
  };

  return (
    <Screen>
      <Header />
      <View style={{ gap: 6 }}>
        <T v="h1">Recupera tu contraseña</T>
        <T v="muted">Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.</T>
      </View>
      {enviado ? (
        <>
          <Banner tone="success">Si el correo está registrado, te enviamos un enlace. Vence en 1 hora.</Banner>
          <Button label="Volver a iniciar sesión" onPress={() => router.replace("/login")} />
        </>
      ) : (
        <>
          <Field label="Correo electrónico" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} error={error} />
          <Button label="Enviar enlace" onPress={enviar} />
        </>
      )}
    </Screen>
  );
}
