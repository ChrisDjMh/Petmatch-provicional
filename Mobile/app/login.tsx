import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Banner, Button, Field, Header, LinkText, Screen, T } from "../src/components/ui";
import { useApp } from "../src/state";

type Fallo = null | "credenciales" | "sin-confirmar";

export default function Login() {
  const router = useRouter();
  const { iniciarSesion } = useApp();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [fallo, setFallo] = useState<Fallo>(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState<{ correo?: string; pass?: string }>({});

  const enviar = () => {
    const e: typeof errores = {};
    if (!/^\S+@\S+\.\S+$/.test(correo)) e.correo = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    if (!pass) e.pass = "Escribe tu contraseña.";
    setErrores(e);
    setFallo(null);
    if (Object.keys(e).length) return;
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      // Simulación de diseño: "sin-confirmar@..." → correo sin confirmar; contraseña "mal" → error.
      if (correo.startsWith("sinconfirmar")) return setFallo("sin-confirmar");
      if (pass === "mal") return setFallo("credenciales");
      iniciarSesion();
      router.replace("/");
    }, 700);
  };

  return (
    <Screen>
      <Header />
      <View style={{ gap: 6, marginTop: 4 }}>
        <T v="h1">Hola de nuevo</T>
        <T v="muted">Inicia sesión para encontrar a tu compañero ideal.</T>
      </View>

      {fallo === "credenciales" && <Banner tone="danger">Correo o contraseña incorrectos.</Banner>}
      {fallo === "sin-confirmar" && (
        <Banner tone="cream">
          <T v="body">Primero confirma tu correo. Te enviamos un enlace al registrarte.</T>
          <Button label="Reenviar correo" variant="secondary" onPress={() => router.push("/confirmar-correo")} />
        </Banner>
      )}

      <Field label="Correo electrónico" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} error={errores.correo} editable={!cargando} />
      <Field label="Contraseña" placeholder="Tu contraseña" secure value={pass} onChangeText={setPass} error={errores.pass} editable={!cargando} />
      <View style={{ alignItems: "flex-end" }}>
        <LinkText onPress={() => router.push("/olvide-contrasena")}>¿Olvidaste tu contraseña?</LinkText>
      </View>
      <Button label="Iniciar sesión" onPress={enviar} loading={cargando} />
      <View style={{ alignItems: "center", gap: 6, marginTop: 8 }}>
        <T v="muted">¿No tienes cuenta?</T>
        <LinkText onPress={() => router.replace("/registro")}>Crear cuenta</LinkText>
      </View>
    </Screen>
  );
}
