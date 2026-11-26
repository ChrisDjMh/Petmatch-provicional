import { useLocalSearchParams, useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { ESPACIO, NIVEL_COMP, NIVEL_EXP, Perfil } from "../src/compat";
import { Button, Card, ChipRow, Chip, Header, Screen, Stepper, T } from "../src/components/ui";
import { useApp } from "../src/state";
import { useTheme } from "../src/theme";

const PASOS = [
  { t: "¿Cómo es tu vivienda?", d: "Espacio disponible para la mascota." },
  { t: "¿Cuánto tiempo pasas en casa?", d: "Horas al día en las que alguien puede estar con la mascota." },
  { t: "¿Qué experiencia tienes con mascotas?", d: "Sé honesto: te ayudará a encontrar una mejor pareja." },
  { t: "¿Qué nivel de compromiso puedes asumir?", d: "Rutinas, entrenamiento y atención médica." },
  { t: "¿Hay niños en casa?", d: "Algunas mascotas no son compatibles con niños." },
  { t: "¿Tienes otras mascotas?", d: "Algunas mascotas no conviven con otras." },
];

const ESPACIO_DESC = ["", "Departamento o cuarto", "Casa sin patio", "Casa con patio o jardín"];
const COMP_DESC = ["Rutinas simples", "Paseos, juego y cuidados regulares", "Entrenamiento y atención médica constante"];

export default function PerfilCompatibilidad() {
  const router = useRouter();
  const { c } = useTheme();
  const { editar } = useLocalSearchParams<{ editar?: string }>();
  const { perfil, guardarPerfil } = useApp();
  const [p, setP] = useState<Perfil>(perfil ?? { espacio: 2, horas: 4, experiencia: 1, compromiso: 1, ninos: false, otrasMascotas: false });
  const [paso, setPaso] = useState(0);
  const modoEdicion = editar === "1";
  const set = <K extends keyof Perfil>(k: K, v: Perfil[K]) => setP((x) => ({ ...x, [k]: v }));

  const Opcion = ({ activo, titulo, desc, onPress }: { activo: boolean; titulo: string; desc?: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <Card tone={activo ? "pink" : "plain"} style={{ borderWidth: 2, borderColor: activo ? c.cards : c.border }}>
        <T v="h3">{titulo}</T>
        {desc ? <T v="muted">{desc}</T> : null}
      </Card>
    </Pressable>
  );

  const control = (i: number) => {
    switch (i) {
      case 0:
        return ([1, 2, 3] as const).map((n) => <Opcion key={n} activo={p.espacio === n} titulo={ESPACIO[n]} desc={ESPACIO_DESC[n]} onPress={() => set("espacio", n)} />);
      case 1:
        return (
          <View style={{ gap: 12 }}>
            <Stepper value={p.horas} onChange={(n) => set("horas", n)} min={0} max={24} suffix=" h" />
            <Slider minimumValue={0} maximumValue={24} step={1} value={p.horas} onValueChange={(v) => set("horas", v)} minimumTrackTintColor={c.cards} maximumTrackTintColor={c.border} thumbTintColor={c.ink} />
          </View>
        );
      case 2:
        return ([0, 1, 2] as const).map((n) => <Opcion key={n} activo={p.experiencia === n} titulo={NIVEL_EXP[n]} onPress={() => set("experiencia", n)} />);
      case 3:
        return ([0, 1, 2] as const).map((n) => <Opcion key={n} activo={p.compromiso === n} titulo={NIVEL_COMP[n]} desc={COMP_DESC[n]} onPress={() => set("compromiso", n)} />);
      case 4:
        return (
          <ChipRow>
            <Chip label="Sí" active={p.ninos} onPress={() => set("ninos", true)} />
            <Chip label="No" active={!p.ninos} onPress={() => set("ninos", false)} />
          </ChipRow>
        );
      default:
        return (
          <ChipRow>
            <Chip label="Sí" active={p.otrasMascotas} onPress={() => set("otrasMascotas", true)} />
            <Chip label="No" active={!p.otrasMascotas} onPress={() => set("otrasMascotas", false)} />
          </ChipRow>
        );
    }
  };

  const guardar = () => {
    guardarPerfil(p);
    if (modoEdicion) router.back();
    else router.replace("/explorar");
  };

  if (modoEdicion)
    return (
      <Screen footer={<Button label="Guardar cambios" onPress={guardar} />}>
        <Header title="Mi perfil de compatibilidad" />
        {PASOS.map((s, i) => (
          <View key={i} style={{ gap: 10 }}>
            <T v="h3">{s.t}</T>
            {control(i)}
          </View>
        ))}
      </Screen>
    );

  const ultimo = paso === PASOS.length - 1;
  return (
    <Screen
      footer={
        <View style={{ flexDirection: "row", gap: 12 }}>
          {paso > 0 && <Button label="Atrás" variant="secondary" onPress={() => setPaso(paso - 1)} style={{ flex: 1 }} />}
          <Button label={ultimo ? "Guardar y ver mis matches" : "Siguiente"} onPress={() => (ultimo ? guardar() : setPaso(paso + 1))} style={{ flex: 2 }} />
        </View>
      }
    >
      <View style={{ flexDirection: "row", gap: 6 }}>
        {PASOS.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= paso ? c.cards : c.border }} />
        ))}
      </View>
      <T v="eyebrow">Paso {paso + 1} de {PASOS.length}</T>
      <T v="h1">{PASOS[paso].t}</T>
      <T v="muted">{PASOS[paso].d}</T>
      <View style={{ gap: 12, marginTop: 8 }}>{control(paso)}</View>
    </Screen>
  );
}
