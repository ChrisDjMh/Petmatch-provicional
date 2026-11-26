import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Card, Header, Screen, T, Banner } from "../../src/components/ui";
import { fechaCorta, infoMascota, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";

// Contrato digital de solo lectura (RF-38, RN-15).
export default function Contrato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { solicitudes } = useApp();
  const s = solicitudes.find((x) => x.id === id);
  if (!s) return null;
  const m = infoMascota(s.mascotaId);
  const ref = refugioPorId(m.refugioId);
  return (
    <Screen>
      <Header title="Contrato de adopción" />
      <Banner tone="cream">Registro digital dentro de PetMatch. No tiene validez legal ni requiere firma.</Banner>
      <Card>
        <T v="eyebrow">Adoptante</T>
        <T v="body">Tu cuenta PetMatch · Vivienda: {s.vivienda} · {s.personas} personas en el hogar</T>
        <T v="eyebrow" style={{ marginTop: 8 }}>Mascota</T>
        <T v="body">{m.nombre} ({m.especie})</T>
        <T v="eyebrow" style={{ marginTop: 8 }}>Refugio</T>
        <T v="body">{ref.nombre} · {ref.ciudad}</T>
        <T v="eyebrow" style={{ marginTop: 8 }}>Fecha</T>
        <T v="body">{fechaCorta(s.fecha)}</T>
      </Card>
      <Card>
        <T v="eyebrow">Condiciones de adopción</T>
        <T v="body">1. El adoptante se compromete a brindar cuidados, alimentación y atención médica a la mascota.</T>
        <T v="body">2. El adoptante acepta el seguimiento post-adopción en los días 7, 30, 90, 180 y 365 después de la entrega, con formulario y fotografía.</T>
        <T v="body">3. Las condiciones adicionales las define el refugio al generar el contrato.</T>
      </Card>
    </Screen>
  );
}

