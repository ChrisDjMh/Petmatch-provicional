import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { Banner, Button, Chip, ChipRow, Field, Header, Screen, Sheet, T } from "../../src/components/ui";
import { ADOPTADA } from "../../src/data";
import { useApp } from "../../src/state";

const NIVELES = ["Excelente", "Buena", "Regular", "Mala"];

// Formulario de hito: salud, adaptación, comentarios y foto obligatoria (RF-43, RNF-05, RNF-14).
export default function Hito() {
  const { dias } = useLocalSearchParams<{ dias: string }>();
  const router = useRouter();
  const { completarHito } = useApp();
  const [salud, setSalud] = useState<string>();
  const [adaptacion, setAdaptacion] = useState<string>();
  const [comentarios, setComentarios] = useState("");
  const [foto, setFoto] = useState<string>();
  const [err, setErr] = useState<Record<string, string>>({});
  const [permiso, setPermiso] = useState<null | "camara" | "galeria">(null);
  const [aviso, setAviso] = useState<string>();
  const [listo, setListo] = useState(false);

  const elegir = async (tipo: "camara" | "galeria") => {
    setPermiso(null);
    setAviso(undefined);
    const perm = tipo === "camara" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setAviso(tipo === "camara" ? "Sin permiso de cámara, puedes elegir una foto de la galería." : "Sin permiso de galería, puedes tomar una foto con la cámara.");
      return;
    }
    const r = tipo === "camara" ? await ImagePicker.launchCameraAsync({ quality: 0.5 }) : await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!r.canceled) setFoto(r.assets[0].uri);
  };

  const enviar = () => {
    const e: Record<string, string> = {};
    if (!salud) e.salud = "Elige el estado de salud.";
    if (!adaptacion) e.adaptacion = "Elige cómo ha sido la adaptación.";
    if (!comentarios.trim()) e.comentarios = "Escribe un comentario sobre cómo va tu mascota.";
    if (!foto) e.foto = "La foto es obligatoria. Tómala con la cámara o elígela de la galería.";
    setErr(e);
    if (Object.keys(e).length) return;
    completarHito(Number(dias));
    setListo(true);
  };

  if (listo)
    return (
      <Screen footer={<Button label="Volver al seguimiento" onPress={() => router.replace("/seguimiento")} />}>
        <Header back={false} />
        <View style={{ alignItems: "center", gap: 12, paddingTop: 40 }}>
          <T style={{ fontSize: 72 }}>📸</T>
          <T v="h1" style={{ textAlign: "center" }}>¡Hito registrado!</T>
          <T v="muted" style={{ textAlign: "center" }}>El refugio podrá ver cómo está {ADOPTADA.nombre}. Gracias por mantenerlos al tanto.</T>
        </View>
      </Screen>
    );

  const Niveles = ({ valor, onChange }: { valor?: string; onChange: (v: string) => void }) => (
    <ChipRow>{NIVELES.map((n) => <Chip key={n} label={n} active={valor === n} onPress={() => onChange(n)} />)}</ChipRow>
  );

  return (
    <Screen footer={<Button label="Enviar hito" onPress={enviar} />}>
      <Header title={`Hito de ${dias} días`} />
      <T v="muted">Cuéntanos cómo va {ADOPTADA.nombre}.</T>
      <View style={{ gap: 8 }}>
        <T v="label">Estado de salud</T>
        <Niveles valor={salud} onChange={setSalud} />
        {err.salud ? <T v="muted" style={{ color: "#C94B5E" }}>{err.salud}</T> : null}
      </View>
      <View style={{ gap: 8 }}>
        <T v="label">Adaptación</T>
        <Niveles valor={adaptacion} onChange={setAdaptacion} />
        {err.adaptacion ? <T v="muted" style={{ color: "#C94B5E" }}>{err.adaptacion}</T> : null}
      </View>
      <Field label="Comentarios" multiline numberOfLines={4} value={comentarios} onChangeText={setComentarios} error={err.comentarios} placeholder="¿Cómo ha sido la convivencia?" style={{ minHeight: 100 }} />
      <View style={{ gap: 8 }}>
        <T v="label">Foto (obligatoria)</T>
        {foto ? <Image source={{ uri: foto }} style={{ height: 200, borderRadius: 20 }} /> : null}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button label="Tomar foto" variant="secondary" icon={<Camera size={18} color="#888" />} style={{ flex: 1, paddingHorizontal: 8 }} onPress={() => setPermiso("camara")} />
          <Button label="Galería" variant="secondary" icon={<ImageIcon size={18} color="#888" />} style={{ flex: 1, paddingHorizontal: 8 }} onPress={() => setPermiso("galeria")} />
        </View>
        {aviso ? <Banner tone="cream">{aviso}</Banner> : null}
        {err.foto ? <T v="muted" style={{ color: "#C94B5E" }}>{err.foto}</T> : null}
      </View>

      <Sheet visible={!!permiso} onClose={() => setPermiso(null)} title={permiso === "camara" ? "Permiso de cámara" : "Permiso de galería"}>
        <T v="muted">
          {permiso === "camara"
            ? "PetMatch usa la cámara solo para tomar la foto obligatoria de tu seguimiento."
            : "PetMatch accede a tu galería solo para que elijas la foto de tu seguimiento."}
        </T>
        <T v="muted">Si no lo permites, el resto de la app seguirá funcionando.</T>
        <Button label="Continuar" onPress={() => elegir(permiso!)} />
        <Button label="Ahora no" variant="secondary" onPress={() => setPermiso(null)} />
      </Sheet>
    </Screen>
  );
}
