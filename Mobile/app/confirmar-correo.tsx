import { useLocalSearchParams, useRouter } from "expo-router";
import { MailCheck, MailX, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Banner, Button, Header, Screen, T } from "../src/components/ui";
import { useTheme } from "../src/theme";

// El enlace del correo abre esta pantalla con ?estado=ok | vencido (RF-02).
export default function ConfirmarCorreo() {
  const router = useRouter();
  const { c } = useTheme();
  const { estado = "pendiente" } = useLocalSearchParams<{ estado?: string }>();
  const [espera, setEspera] = useState(0);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((e) => e - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const reenviar = () => {
    setEnviado(true);
    setEspera(30);
  };

  const Icono = estado === "ok" ? MailCheck : estado === "vencido" ? MailX : Mail;
  return (
    <Screen
      footer={
        <View style={{ gap: 12 }}>
          {estado === "ok" && <Button label="Iniciar sesión" onPress={() => router.replace("/login")} />}
          {estado === "vencido" && <Button label="Pedir otro enlace" onPress={() => { reenviar(); router.setParams({ estado: "pendiente" }); }} />}
          {estado === "pendiente" && (
            <>
              <Button label={espera > 0 ? `Reenviar correo (${espera} s)` : "Reenviar correo"} variant="secondary" disabled={espera > 0} onPress={reenviar} />
              <Button label="Ya confirmé, iniciar sesión" onPress={() => router.replace("/login")} />
            </>
          )}
        </View>
      }
    >
      <Header back={estado === "pendiente"} />
      <View style={{ alignItems: "center", gap: 14, paddingTop: 24 }}>
        <View style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: estado === "vencido" ? c.dangerSoft : estado === "ok" ? c.successSoft : c.cards2, alignItems: "center", justifyContent: "center" }}>
          <Icono size={52} color={estado === "vencido" ? c.danger : estado === "ok" ? c.success : c.ink} />
        </View>
        {estado === "pendiente" && (
          <>
            <T v="h1" style={{ textAlign: "center" }}>Confirma tu correo</T>
            <T v="muted" style={{ textAlign: "center" }}>
              Te enviamos un enlace de confirmación. Ábrelo desde tu correo; vence en 1 hora y solo funciona una vez.
            </T>
          </>
        )}
        {estado === "ok" && (
          <>
            <T v="h1" style={{ textAlign: "center" }}>Correo confirmado</T>
            <T v="muted" style={{ textAlign: "center" }}>Tu cuenta está lista. Ya puedes iniciar sesión.</T>
          </>
        )}
        {estado === "vencido" && (
          <>
            <T v="h1" style={{ textAlign: "center" }}>El enlace ya no sirve</T>
            <T v="muted" style={{ textAlign: "center" }}>Este enlace ya se usó o tiene más de 1 hora. Pide uno nuevo para confirmar tu correo.</T>
          </>
        )}
      </View>
      {enviado && estado === "pendiente" && <Banner tone="success">Listo, te enviamos otro correo.</Banner>}
    </Screen>
  );
}
