import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "../src/state";
import { useTheme } from "../src/theme";

export default function RootLayout() {
  const [loaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const { c, isDark } = useTheme();
  if (!loaded) return <View style={{ flex: 1, backgroundColor: c.background }} />;
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background }, animation: "slide_from_right" }}>
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
