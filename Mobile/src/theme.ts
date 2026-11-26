import { useColorScheme } from "react-native";

// Tokens tomados de la web (src/index.css) + variante oscura.
export const light = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#FAF6FD",
  ink: "#2E2836",
  muted: "rgba(46,40,54,0.62)",
  border: "rgba(46,40,54,0.14)",
  cards: "#C5A9E8",
  cards2: "#FDD9EF",
  accent: "#FFEBB8",
  warm: "#FFD8BC",
  success: "#2F9E6B",
  successSoft: "#DDF3E8",
  danger: "#C94B5E",
  dangerSoft: "#FBE3E7",
  shadow: "#2E2836",
};

export const dark: typeof light = {
  background: "#1B1722",
  surface: "#262033",
  surfaceAlt: "#2E2740",
  ink: "#F4F0FA",
  muted: "rgba(244,240,250,0.62)",
  border: "rgba(244,240,250,0.16)",
  cards: "#C5A9E8",
  cards2: "#4A2F45",
  accent: "#4D4326",
  warm: "#4D3526",
  success: "#5CCB97",
  successSoft: "#1F3B30",
  danger: "#F08A98",
  dangerSoft: "#43232B",
  shadow: "#000000",
};

export type Colors = typeof light;

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { c: isDark ? dark : light, isDark };
}

export const fonts = {
  h: "Fredoka_700Bold",
  hSemi: "Fredoka_600SemiBold",
  body: "Nunito_400Regular",
  bodySemi: "Nunito_600SemiBold",
  bodyBold: "Nunito_700Bold",
  bodyBlack: "Nunito_800ExtraBold",
};
