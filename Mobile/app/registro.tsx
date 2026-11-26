import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Checkbox, Field, Header, LinkText, Screen, Sheet, T } from "../src/components/ui";
import { useApp } from "../src/state";

export default function Registro() {
  const router = useRouter();
  const { registrar } = useApp();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [aviso, setAviso] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});

  const enviar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "Escribe tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(correo)) e.correo = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    else if (correo.startsWith("repetido")) e.correo = "Este correo ya está registrado. Inicia sesión o usa otro.";
    if (pass.length < 8) e.pass = "La contraseña debe tener al menos 8 caracteres.";
    if (!acepto) e.acepto = "Debes aceptar el aviso de privacidad para crear tu cuenta.";
    setErr(e);
    if (Object.keys(e).length) return;
    registrar();
    router.replace("/confirmar-correo");
  };

  return (
    <Screen>
      <Header />
      <View style={{ gap: 6 }}>
        <T v="h1">Crea tu cuenta</T>
        <T v="muted">Solo necesitamos tres datos para empezar.</T>
      </View>
      <Field label="Nombre" placeholder="Tu nombre" value={nombre} onChangeText={setNombre} error={err.nombre} />
      <Field label="Correo electrónico" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} error={err.correo} />
      <Field label="Contraseña" placeholder="Mínimo 8 caracteres" secure value={pass} onChangeText={setPass} error={err.pass} hint="Mínimo 8 caracteres." />
      <View style={{ gap: 6 }}>
        <Checkbox checked={acepto} onChange={setAcepto}>
          <T v="body">
            Acepto el{" "}
            <T v="body" style={{ textDecorationLine: "underline", fontWeight: "800" }} onPress={() => setAviso(true)}>
              aviso de privacidad
            </T>
          </T>
        </Checkbox>
        {err.acepto ? <T v="muted" style={{ color: "#C94B5E" }}>{err.acepto}</T> : null}
      </View>
      <Button label="Crear cuenta" onPress={enviar} />
      <View style={{ alignItems: "center", gap: 6 }}>
        <T v="muted">¿Ya tienes cuenta?</T>
        <LinkText onPress={() => router.replace("/login")}>Iniciar sesión</LinkText>
      </View>

      <Sheet visible={aviso} onClose={() => setAviso(false)} title="Aviso de privacidad">
        <T v="muted">
          PetMatch solo solicita tu nombre, correo y contraseña para crear tu cuenta, además de los datos que escribas en tu perfil de compatibilidad, tus solicitudes y tu seguimiento post-adopción. Los datos de pago los procesa únicamente Stripe y PetMatch nunca los guarda.
        </T>
        <T v="muted">El texto definitivo del aviso lo proporcionará el equipo administrador.</T>
        <Button label="Entendido" onPress={() => setAviso(false)} />
      </Sheet>
    </Screen>
  );
}
