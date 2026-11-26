import { useRouter } from "expo-router";
import { CalendarClock, ChevronRight, HandCoins, Repeat, SlidersHorizontal, LogOut } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Button, Card, Screen, Sheet, T } from "../../src/components/ui";
import { mxn } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

export default function Perfil() {
  const router = useRouter();
  const { c } = useTheme();
  const { donaciones, apadrinamientos, entrevistas, cerrarSesion } = useApp();
  const [salir, setSalir] = useState(false);
  const total = donaciones.reduce((s, d) => s + d.monto, 0);

  const Fila = ({ Icon, titulo, extra, onPress }: { Icon: any; titulo: string; extra?: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <Icon size={22} color={c.ink} />
        <View style={{ flex: 1 }}>
          <T v="label">{titulo}</T>
          {extra ? <T v="muted">{extra}</T> : null}
        </View>
        <ChevronRight size={20} color={c.muted} />
      </Card>
    </Pressable>
  );

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T v="eyebrow">Tu cuenta</T>
        <T v="h1">Perfil</T>
      </View>
      <Card tone="pink" style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.cards, alignItems: "center", justifyContent: "center" }}>
          <T v="h2" style={{ color: "#2E2836" }}>A</T>
        </View>
        <View style={{ flex: 1 }}>
          <T v="h3" style={{ color: c.ink }}>Adoptante</T>
          <T v="muted" style={{ color: c.muted }}>adoptante@correo.com</T>
        </View>
      </Card>
      <Fila Icon={SlidersHorizontal} titulo="Mi perfil de compatibilidad" onPress={() => router.push("/perfil-compatibilidad?editar=1")} />
      <Fila Icon={CalendarClock} titulo="Mis entrevistas" extra={`${entrevistas.filter((e) => e.estado === "Programada").length} pendientes`} onPress={() => router.push("/entrevistas")} />
      <Fila Icon={HandCoins} titulo="Mis donaciones" extra={`Total donado: ${mxn(total)}`} onPress={() => router.push("/donaciones")} />
      <Fila Icon={Repeat} titulo="Mis apadrinamientos" extra={`${apadrinamientos.length} ${apadrinamientos.length === 1 ? "activo" : "activos"}`} onPress={() => router.push("/apadrinamientos")} />
      <Button label="Cerrar sesión" variant="secondary" icon={<LogOut size={18} color={c.ink} />} onPress={() => setSalir(true)} style={{ marginTop: 8 }} />

      <Sheet visible={salir} onClose={() => setSalir(false)} title="¿Cerrar sesión?">
        <T v="muted">Tendrás que iniciar sesión de nuevo para ver tus solicitudes y seguimientos.</T>
        <Button label="Cerrar sesión" onPress={() => { setSalir(false); cerrarSesion(); router.dismissAll(); router.replace("/bienvenida"); }} />
        <Button label="Cancelar" variant="secondary" onPress={() => setSalir(false)} />
      </Sheet>
    </Screen>
  );
}
