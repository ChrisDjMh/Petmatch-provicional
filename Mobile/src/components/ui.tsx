import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, PawPrint } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts, useTheme } from "../theme";

// ---------- Texto ----------
type Variant = "h1" | "h2" | "h3" | "body" | "muted" | "eyebrow" | "label";
export function T({
  v = "body",
  style,
  children,
  ...rest
}: { v?: Variant; style?: StyleProp<TextStyle>; children?: React.ReactNode } & React.ComponentProps<typeof Text>) {
  const { c } = useTheme();
  const map: Record<Variant, TextStyle> = {
    h1: { fontFamily: fonts.h, fontSize: 28, color: c.ink, lineHeight: 32, letterSpacing: -0.5 },
    h2: { fontFamily: fonts.hSemi, fontSize: 22, color: c.ink, lineHeight: 26 },
    h3: { fontFamily: fonts.hSemi, fontSize: 18, color: c.ink },
    body: { fontFamily: fonts.bodySemi, fontSize: 15, color: c.ink, lineHeight: 21 },
    muted: { fontFamily: fonts.body, fontSize: 14, color: c.muted, lineHeight: 20 },
    eyebrow: { fontFamily: fonts.bodyBlack, fontSize: 12, color: c.cards, letterSpacing: 1.9, textTransform: "uppercase" },
    label: { fontFamily: fonts.bodyBlack, fontSize: 14, color: c.ink },
  };
  return (
    <Text {...rest} style={[map[v], style]}>
      {children}
    </Text>
  );
}

// ---------- Pantalla ----------
export function Screen({
  children,
  scroll = true,
  footer,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
  padded?: boolean;
}) {
  const { c } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ padding: padded ? 20 : 0, paddingBottom: 32, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: padded ? 20 : 0, gap: 16 }}>{children}</View>
      )}
      {footer ? (
        <View style={{ padding: 16, paddingBottom: 20, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.background }}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function Header({ title, back = true, right }: { title?: string; back?: boolean; right?: React.ReactNode }) {
  const router = useRouter();
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 }}>
      {back ? (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          accessibilityLabel="Regresar"
          style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: c.border, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft size={20} color={c.ink} />
        </Pressable>
      ) : null}
      {title ? (
        <T v="h2" style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </T>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right}
    </View>
  );
}

// ---------- Botones ----------
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "light" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const bg = variant === "primary" ? c.ink : variant === "light" ? c.accent : variant === "danger" ? c.danger : "transparent";
  const fg = variant === "primary" ? c.background : variant === "danger" ? "#FFFFFF" : c.ink;
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off }}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: 999,
          backgroundColor: bg,
          borderWidth: variant === "secondary" ? 2 : 0,
          borderColor: c.ink,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingHorizontal: 24,
          opacity: off ? 0.4 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon}
      <Text style={{ fontFamily: fonts.bodyBlack, fontSize: 16, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function LinkText({ children, onPress }: { children: string; onPress?: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={{ fontFamily: fonts.bodyBlack, fontSize: 15, color: c.ink, textDecorationLine: "underline", textAlign: "center" }}>
        {children}
      </Text>
    </Pressable>
  );
}

// ---------- Campos ----------
export function Field({
  label,
  error,
  hint,
  secure,
  ...rest
}: { label: string; error?: string; hint?: string; secure?: boolean } & TextInputProps) {
  const { c } = useTheme();
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <T v="label">{label}</T>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 2,
          borderColor: error ? c.danger : focus ? c.ink : c.border,
          borderRadius: 16,
          backgroundColor: c.surface,
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          {...rest}
          secureTextEntry={secure && !show}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor={c.muted}
          style={{
            flex: 1,
            minHeight: 52,
            fontFamily: fonts.bodySemi,
            fontSize: 16,
            color: c.ink,
            textAlignVertical: rest.multiline ? "top" : "center",
            paddingTop: rest.multiline ? 14 : 0,
          }}
        />
        {secure ? (
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={10} accessibilityLabel="Mostrar u ocultar contraseña">
            {show ? <EyeOff size={20} color={c.muted} /> : <Eye size={20} color={c.muted} />}
          </Pressable>
        ) : null}
      </View>
      {error ? <T v="muted" style={{ color: c.danger }}>{error}</T> : hint ? <T v="muted">{hint}</T> : null}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 38,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: active ? c.cards : c.border,
        backgroundColor: active ? c.cards : "transparent",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontFamily: fonts.bodyBlack, fontSize: 14, color: active ? "#2E2836" : c.ink }}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>;
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={() => onChange(!checked)} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: c.ink,
          backgroundColor: checked ? c.ink : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked ? <Text style={{ color: c.background, fontFamily: fonts.bodyBlack }}>✓</Text> : null}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

// ---------- Superficies ----------
export function Card({ children, style, onPress, tone }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tone?: "pink" | "cream" | "peach" | "plain" }) {
  const { c } = useTheme();
  const bg = tone === "pink" ? c.cards2 : tone === "cream" ? c.accent : tone === "peach" ? c.warm : c.surface;
  const Comp: any = onPress ? Pressable : View;
  return (
    <Comp
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          borderRadius: 24,
          borderWidth: tone && tone !== "plain" ? 0 : 1,
          borderColor: c.border,
          padding: 16,
          gap: 8,
          shadowColor: c.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </Comp>
  );
}

export type Tone = "neutral" | "cream" | "peach" | "success" | "danger" | "pink" | "lilac";
export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  const { c } = useTheme();
  const map: Record<Tone, [string, string]> = {
    neutral: [c.surfaceAlt, c.ink],
    cream: [c.accent, c.ink],
    peach: [c.warm, c.ink],
    success: [c.successSoft, c.success],
    danger: [c.dangerSoft, c.danger],
    pink: [c.cards2, c.ink],
    lilac: [c.cards, "#2E2836"],
  };
  const [bg, fg] = map[tone];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, alignSelf: "flex-start" }}>
      <Text style={{ fontFamily: fonts.bodyBlack, fontSize: 12.5, color: fg }}>{label}</Text>
    </View>
  );
}

export function Banner({ tone, children }: { tone: "danger" | "cream" | "success"; children: React.ReactNode }) {
  const { c } = useTheme();
  const bg = tone === "danger" ? c.dangerSoft : tone === "success" ? c.successSoft : c.accent;
  const fg = tone === "danger" ? c.danger : tone === "success" ? c.success : c.ink;
  return (
    <View style={{ backgroundColor: bg, borderRadius: 16, padding: 14, gap: 10 }}>
      {typeof children === "string" ? (
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: fg }}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function PetPhoto({ especie, height = 180, radius = 20, tone = 0 }: { especie: string; height?: number; radius?: number; tone?: number }) {
  const { c } = useTheme();
  const bgs = [c.cards2, c.accent, c.warm, c.cards];
  return (
    <View style={{ height, borderRadius: radius, backgroundColor: bgs[tone % bgs.length], alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Text style={{ fontSize: height * 0.4 }}>{especie === "Perro" ? "🐶" : especie === "Gato" ? "🐱" : "🐰"}</Text>
    </View>
  );
}

export function Empty({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: "center", gap: 12, paddingVertical: 32, paddingHorizontal: 12 }}>
      <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: c.cards2, alignItems: "center", justifyContent: "center" }}>
        <PawPrint size={40} color={c.ink} />
      </View>
      <T v="h2" style={{ textAlign: "center" }}>{title}</T>
      <T v="muted" style={{ textAlign: "center" }}>{text}</T>
      <View style={{ gap: 10, alignSelf: "stretch", marginTop: 8 }}>{children}</View>
    </View>
  );
}

export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }} onPress={onClose} />
      <View style={{ backgroundColor: c.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "88%" }}>
        <View style={{ alignItems: "center", paddingTop: 10 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: c.border }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {title ? <T v="h2">{title}</T> : null}
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

export function Stepper({ value, onChange, min, max, suffix }: { value: number; onChange: (n: number) => void; min: number; max: number; suffix?: string }) {
  const { c } = useTheme();
  const b = (label: string, d: number) => (
    <Pressable
      onPress={() => onChange(Math.min(max, Math.max(min, value + d)))}
      style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: c.ink, alignItems: "center", justifyContent: "center" }}
      accessibilityLabel={d > 0 ? "Aumentar" : "Disminuir"}
    >
      <Text style={{ fontFamily: fonts.bodyBlack, fontSize: 22, color: c.ink }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "center" }}>
      {b("−", -1)}
      <T v="h1" style={{ minWidth: 90, textAlign: "center" }}>{value}{suffix ?? ""}</T>
      {b("+", 1)}
    </View>
  );
}

export const estadoTone = (e: string): Tone =>
  ({ Pendiente: "cream", Aprobada: "success", Rechazada: "danger", Cancelada: "neutral" } as Record<string, Tone>)[e] ?? "neutral";
