import { useRouter } from "expo-router";
import React, { useState } from "react";
import { EntrevistasLista } from "../../src/components/EntrevistasLista";
import { Pressable, View } from "react-native";
import { Badge, Button, Card, Chip, ChipRow, Empty, estadoTone, PetPhoto, Screen, T } from "../../src/components/ui";
import { fechaCorta, infoMascota, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";

export default function Solicitudes() {
  const router = useRouter();
  const { solicitudes, entrevistas } = useApp();
  const [vista, setVista] = useState<"solicitudes" | "entrevistas">("solicitudes");
  const pendientes = entrevistas.filter((e) => e.estado === "Programada").length;
  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T v="eyebrow">Adopciones</T>
        <T v="h1">{vista === "solicitudes" ? "Mis solicitudes" : "Mis entrevistas"}</T>
      </View>
      <ChipRow>
        <Chip label="Solicitudes" active={vista === "solicitudes"} onPress={() => setVista("solicitudes")} />
        <Chip label={pendientes ? `Entrevistas (${pendientes})` : "Entrevistas"} active={vista === "entrevistas"} onPress={() => setVista("entrevistas")} />
      </ChipRow>
      {vista === "entrevistas" ? (
        <EntrevistasLista />
      ) : solicitudes.length === 0 ? (
        <Empty title="Aún no has enviado solicitudes" text="Cuando solicites adoptar una mascota la verás aquí.">
          <Button label="Explorar mascotas" onPress={() => router.push("/explorar")} />
        </Empty>
      ) : (
        solicitudes.map((s, i) => {
          const m = infoMascota(s.mascotaId);
          return (
            <Pressable key={s.id} onPress={() => router.push(`/solicitud/${s.id}`)}>
              <Card style={{ flexDirection: "row", gap: 12, alignItems: "center", padding: 10 }}>
                <View style={{ width: 72 }}><PetPhoto especie={m.especie} height={72} radius={16} tone={i} /></View>
                <View style={{ flex: 1, gap: 4 }}>
                  <T v="h3">{m.nombre}</T>
                  <T v="muted">{refugioPorId(m.refugioId).nombre} · {fechaCorta(s.fecha)}</T>
                  <Badge label={s.estado} tone={estadoTone(s.estado)} />
                </View>
              </Card>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

