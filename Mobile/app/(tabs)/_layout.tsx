import { Tabs, Redirect } from "expo-router";
import { Compass, FileText, HandHeart, Sprout, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useApp } from "../../src/state";
import { fonts, useTheme } from "../../src/theme";

export default function TabsLayout() {
  const { c } = useTheme();
  const { sesion } = useApp();
  if (!sesion) return <Redirect href="/bienvenida" />; // RF-06: sin sesión no hay pantallas con datos.

  const icon = (Icon: any) => ({ focused }: { focused: boolean }) => (
    <View style={{ width: 52, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: focused ? c.cards : "transparent" }}>
      <Icon size={20} color={focused ? "#2E2836" : c.muted} strokeWidth={2.2} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.ink,
        tabBarInactiveTintColor: c.muted,
        tabBarLabelStyle: { fontFamily: fonts.bodyBlack, fontSize: 11 },
        tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border, height: 68, paddingTop: 6, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="explorar" options={{ title: "Explorar", tabBarIcon: icon(Compass) }} />
      <Tabs.Screen name="solicitudes" options={{ title: "Solicitudes", tabBarIcon: icon(FileText) }} />
      <Tabs.Screen name="seguimiento" options={{ title: "Seguimiento", tabBarIcon: icon(Sprout) }} />
      <Tabs.Screen name="donar" options={{ title: "Donar", tabBarIcon: icon(HandHeart) }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: icon(User) }} />
    </Tabs>
  );
}
