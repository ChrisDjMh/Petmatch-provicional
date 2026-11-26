import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Banner, Button, Checkbox, Chip, ChipRow, Field, Header, Screen, Stepper, T } from "../../src/components/ui";
import { mascotaPorId } from "../../src/data";
import { useApp } from "../../src/state";

const VIVIENDAS = ["Casa", "Departamento", "Otro"];

export default function Solicitar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { solicitudes, agregarSolicitud } = useApp();
  const m = mascotaPorId(id);
  const [motivo, setMotivo] = useState("");
  const [vivienda, setVivienda] = useState<string>();
  const [personas, setPersonas] = useState(2);
  const [acepto, setAcepto] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<null | "ok" | "no-disponible">(null);
  if (!m) return null;
  const pendiente = solicitudes.find((s) => s.mascotaId === id && s.estado === "Pendiente"); // RN-10

  const enviar = () => {
    const e: Record<string, string> = {};
    if (motivo.trim().length < 10) e.motivo = "Cuéntanos con un poco más de detalle por qué quieres adoptar.";
    if (!vivienda) e.vivienda = "Elige el tipo de vivienda.";
    setErr(e);
    if (Object.keys(e).length) return;
    if (m.estado !== "Disponible") return setResultado("no-disponible"); // RF-33
    agregarSolicitud({ id: `s${Date.now()}`, mascotaId: id, fecha: new Date(), estado: "Pendiente", contrato: false, entregada: false, motivo, vivienda: vivienda!, personas });
    setResultado("ok");
  };

  if (resultado === "ok")
    return (
      <Screen footer={<Button label="Ver mis solicitudes" onPress={() => router.replace("/solicitudes")} />}>
        <Header back={false} />
        <View style={{ alignItems: "center", gap: 12, paddingTop: 40 }}>
          <T style={{ fontSize: 72 }}>🎉</T>
          <T v="h1" style={{ textAlign: "center" }}>Solicitud enviada</T>
          <T v="muted" style={{ textAlign: "center" }}>Te avisaremos cuando el refugio decida sobre la adopción de {m.nombre}.</T>
        </View>
      </Screen>
    );

  if (resultado === "no-disponible")
    return (
      <Screen footer={<Button label="Volver a Explorar" onPress={() => router.replace("/explorar")} />}>
        <Header back={false} />
        <View style={{ alignItems: "center", gap: 12, paddingTop: 40 }}>
          <T style={{ fontSize: 72 }}>😿</T>
          <T v="h1" style={{ textAlign: "center" }}>{m.nombre} ya no está disponible</T>
          <T v="muted" style={{ textAlign: "center" }}>No se envió tu solicitud. Mira otras mascotas compatibles contigo.</T>
        </View>
      </Screen>
    );

  if (pendiente)
    return (
      <Screen footer={<Button label="Ver mi solicitud" onPress={() => router.replace(`/solicitud/${pendiente.id}`)} />}>
        <Header title="Solicitar adopción" />
        <Banner tone="cream">Ya tienes una solicitud pendiente para {m.nombre}. Puedes solicitar otras mascotas, pero no la misma dos veces.</Banner>
      </Screen>
    );

  return (
    <Screen footer={<Button label="Enviar solicitud" disabled={!acepto} onPress={enviar} />}>
      <Header title={`Solicitar a ${m.nombre}`} />
      <Field label="¿Por qué quieres adoptar?" multiline numberOfLines={4} value={motivo} onChangeText={setMotivo} error={err.motivo} placeholder="Cuéntanos tu motivo" style={{ minHeight: 100 }} />
      <View style={{ gap: 8 }}>
        <T v="label">Tipo de vivienda</T>
        <ChipRow>{VIVIENDAS.map((v) => <Chip key={v} label={v} active={vivienda === v} onPress={() => setVivienda(v)} />)}</ChipRow>
        {err.vivienda ? <T v="muted" style={{ color: "#C94B5E" }}>{err.vivienda}</T> : null}
      </View>
      <View style={{ gap: 8 }}>
        <T v="label">Personas en tu hogar</T>
        <Stepper value={personas} onChange={setPersonas} min={1} max={20} />
      </View>
      <Checkbox checked={acepto} onChange={setAcepto}>
        <T v="body">Acepto el seguimiento post-adopción (días 7, 30, 90, 180 y 365 después de la entrega).</T>
      </Checkbox>
    </Screen>
  );
}
