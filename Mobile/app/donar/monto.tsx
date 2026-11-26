import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Banner, Button, Chip, ChipRow, Field, Header, Screen, Sheet, T } from "../../src/components/ui";
import { ADOPTADA, MASCOTAS, mxn, REFUGIOS } from "../../src/data";
import { useApp } from "../../src/state";

const RAPIDOS = [50, 100, 200, 500];
const MIN = 20;
const MAX = 10000;

// Donación (RF-49, RF-50, RF-51, RN-13). El pago real lo hace el SDK de Stripe; aquí se simula la hoja de pago.
export default function Monto() {
  const { tipo = "unica", refugio } = useLocalSearchParams<{ tipo?: string; refugio?: string }>();
  const router = useRouter();
  const { agregarDonacion } = useApp();
  const elegibles = REFUGIOS.filter((r) => r.activo && r.stripeVinculada);
  const [refugioId, setRefugioId] = useState<string | undefined>(tipo === "post" ? ADOPTADA.refugioId : refugio);
  const [destino, setDestino] = useState<"refugio" | "mascota">("refugio");
  const [mascotaId, setMascotaId] = useState<string>();
  const [texto, setTexto] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [pago, setPago] = useState(false);
  const [tarjeta, setTarjeta] = useState("");
  const [cargando, setCargando] = useState(false);

  const monto = Number(texto.replace(/[^0-9]/g, ""));
  const mascotasRef = MASCOTAS.filter((m) => m.refugioId === refugioId && m.estado === "Disponible");
  const titulo = tipo === "mensual" ? "Apadrinar" : tipo === "post" ? "Donación post-adopción" : "Donación única";

  const continuar = () => {
    const e: Record<string, string> = {};
    if (!refugioId) e.refugio = "Elige un refugio.";
    if (tipo === "mensual" && destino === "mascota" && !mascotaId) e.mascota = "Elige una mascota.";
    if (!texto) e.monto = "Escribe o elige un monto.";
    else if (monto < MIN || monto > MAX) e.monto = `El monto debe estar entre ${mxn(MIN)} y ${mxn(MAX)} MXN.`;
    setErr(e);
    if (!Object.keys(e).length) setPago(true);
  };

  const pagar = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setPago(false);
      if (tarjeta.replace(/\s/g, "") === "4000000000000002") {
        router.replace(`/donar/resultado?ok=0&tipo=${tipo}&refugio=${refugioId}&monto=${monto}`);
        return;
      }
      agregarDonacion(
        { id: `d${Date.now()}`, fecha: new Date(), refugioId: refugioId!, tipo: tipo === "mensual" ? "Mensual" : tipo === "post" ? "Post-adopción" : "Única", monto },
        tipo === "mensual" ? { id: `a${Date.now()}`, refugioId: refugioId!, mascotaId: destino === "mascota" ? mascotaId : undefined, monto } : undefined,
      );
      router.replace(`/donar/resultado?ok=1&tipo=${tipo}&refugio=${refugioId}&monto=${monto}`);
    }, 900);
  };

  return (
    <Screen footer={<Button label="Continuar al pago" onPress={continuar} />}>
      <Header title={titulo} />
      <Banner tone="cream">El 100 % de tu donación va directo al refugio. PetMatch no cobra comisión.</Banner>

      <View style={{ gap: 8 }}>
        <T v="label">Refugio</T>
        {tipo === "post" ? (
          <T v="body">{elegibles.find((r) => r.id === ADOPTADA.refugioId)?.nombre} (donde adoptaste)</T>
        ) : (
          <ChipRow>{elegibles.map((r) => <Chip key={r.id} label={r.nombre} active={refugioId === r.id} onPress={() => { setRefugioId(r.id); setMascotaId(undefined); }} />)}</ChipRow>
        )}
        {err.refugio ? <T v="muted" style={{ color: "#C94B5E" }}>{err.refugio}</T> : null}
      </View>

      {tipo === "mensual" && (
        <View style={{ gap: 8 }}>
          <T v="label">Apadrinar a</T>
          <ChipRow>
            <Chip label="El refugio" active={destino === "refugio"} onPress={() => setDestino("refugio")} />
            <Chip label="Una mascota" active={destino === "mascota"} onPress={() => setDestino("mascota")} />
          </ChipRow>
          {destino === "mascota" && (
            refugioId ? (
              <ChipRow>{mascotasRef.map((m) => <Chip key={m.id} label={m.nombre} active={mascotaId === m.id} onPress={() => setMascotaId(m.id)} />)}</ChipRow>
            ) : (
              <T v="muted">Primero elige un refugio.</T>
            )
          )}
          {err.mascota ? <T v="muted" style={{ color: "#C94B5E" }}>{err.mascota}</T> : null}
        </View>
      )}

      <View style={{ gap: 8 }}>
        <T v="label">{tipo === "mensual" ? "Monto mensual (MXN)" : "Monto (MXN)"}</T>
        <ChipRow>{RAPIDOS.map((n) => <Chip key={n} label={mxn(n)} active={monto === n} onPress={() => setTexto(String(n))} />)}</ChipRow>
        <Field label="Otro monto" keyboardType="number-pad" value={texto} onChangeText={setTexto} placeholder="Ej. 150" error={err.monto} hint={`De ${mxn(MIN)} a ${mxn(MAX)} MXN.`} />
        {tipo === "mensual" && <T v="muted">Se cobra cada mes hasta que lo canceles desde tu perfil.</T>}
      </View>

      <Sheet visible={pago} onClose={() => !cargando && setPago(false)} title="Pagar con tarjeta">
        <Banner tone="cream">Modo de prueba: usa 4242 4242 4242 4242. PetMatch no guarda tu tarjeta.</Banner>
        <Field label="Número de tarjeta" keyboardType="number-pad" value={tarjeta} onChangeText={setTarjeta} placeholder="4242 4242 4242 4242" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Vencimiento" placeholder="MM/AA" /></View>
          <View style={{ flex: 1 }}><Field label="CVC" placeholder="123" keyboardType="number-pad" /></View>
        </View>
        <Button label={`Pagar ${mxn(monto || 0)}`} onPress={pagar} loading={cargando} />
      </Sheet>
    </Screen>
  );
}
