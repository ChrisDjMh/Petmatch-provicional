import { useRouter } from "expo-router";
import { SlidersHorizontal, TriangleAlert } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { evaluar, MINIMO_COMPATIBLE } from "../../src/compat";
import { Badge, Button, Card, Chip, ChipRow, Empty, PetPhoto, Screen, Sheet, T } from "../../src/components/ui";
import { edadTexto, grupoEdad, MASCOTAS, REFUGIOS, refugioPorId } from "../../src/data";
import { useApp } from "../../src/state";
import { useTheme } from "../../src/theme";

type Filtros = { especie?: string; tamano?: string; edad?: string; sexo?: string; actividad?: string; refugio?: string };

function Grupo({ titulo, opciones, valor, onChange, nombres }: { titulo: string; opciones: string[]; valor?: string; onChange: (v?: string) => void; nombres?: Record<string, string> }) {
  return (
    <View style={{ gap: 8 }}>
      <T v="label">{titulo}</T>
      <ChipRow>
        {opciones.map((o) => (
          <Chip key={o} label={nombres?.[o] ?? o} active={valor === o} onPress={() => onChange(valor === o ? undefined : o)} />
        ))}
      </ChipRow>
    </View>
  );
}

export default function Explorar() {
  const router = useRouter();
  const { c } = useTheme();
  const { perfil } = useApp();
  const [f, setF] = useState<Filtros>({});
  const [abierto, setAbierto] = useState(false);
  const [permisoNotif, setPermisoNotif] = useState(true); // RNF-14: se explica antes de pedir el permiso
  const [borrador, setBorrador] = useState<Filtros>({});

  const lista = useMemo(() => {
    if (!perfil) return [];
    return MASCOTAS.filter((m) => m.estado === "Disponible" && refugioPorId(m.refugioId).activo)
      .filter((m) => (!f.especie || m.especie === f.especie) && (!f.tamano || m.tamano === f.tamano) && (!f.edad || grupoEdad(m.edadMeses) === f.edad) && (!f.sexo || m.sexo === f.sexo) && (!f.actividad || m.actividad === f.actividad) && (!f.refugio || m.refugioId === f.refugio))
      .map((m) => ({ m, ev: evaluar(perfil, m.req) }))
      .filter((x) => x.ev.cumplidos >= MINIMO_COMPATIBLE)
      .sort((a, b) => b.ev.cumplidos - a.ev.cumplidos);
  }, [perfil, f]);

  const activos = Object.entries(f).filter(([, v]) => v) as [keyof Filtros, string][];
  const etiqueta = (k: keyof Filtros, v: string) => (k === "refugio" ? refugioPorId(v).nombre : v);
  const conteoBorrador = useMemo(() => {
    if (!perfil) return 0;
    const g = borrador;
    return MASCOTAS.filter((m) => m.estado === "Disponible" && refugioPorId(m.refugioId).activo && (!g.especie || m.especie === g.especie) && (!g.tamano || m.tamano === g.tamano) && (!g.edad || grupoEdad(m.edadMeses) === g.edad) && (!g.sexo || m.sexo === g.sexo) && (!g.actividad || m.actividad === g.actividad) && (!g.refugio || m.refugioId === g.refugio) && evaluar(perfil, m.req).cumplidos >= MINIMO_COMPATIBLE).length;
  }, [borrador, perfil]);

  return (
    <Screen>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, gap: 4 }}>
          <T v="eyebrow">Descubre</T>
          <T v="h1">Tus mejores matches</T>
        </View>
        <Pressable
          onPress={() => { setBorrador(f); setAbierto(true); }}
          accessibilityLabel="Filtros"
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: activos.length ? c.cards : c.surfaceAlt, alignItems: "center", justifyContent: "center" }}
        >
          <SlidersHorizontal size={22} color={activos.length ? "#2E2836" : c.ink} />
        </Pressable>
      </View>

      {activos.length > 0 && (
        <ChipRow>
          {activos.map(([k, v]) => (
            <Chip key={k} label={`${etiqueta(k, v)}  ✕`} active onPress={() => setF({ ...f, [k]: undefined })} />
          ))}
        </ChipRow>
      )}

      {!perfil ? (
        <Card tone="cream">
          <T v="h3">Completa tu perfil para ver tus matches</T>
          <T v="muted">Con seis respuestas calculamos qué mascotas son compatibles contigo.</T>
          <Button label="Completar perfil" variant="primary" onPress={() => router.push("/perfil-compatibilidad")} />
        </Card>
      ) : lista.length === 0 ? (
        <Empty title="Ninguna mascota cumple por ahora" text="Prueba ajustando los filtros o actualizando tu perfil de compatibilidad.">
          <Button label="Ajustar filtros" onPress={() => { setBorrador(f); setAbierto(true); }} />
          <Button label="Editar mi perfil" variant="secondary" onPress={() => router.push("/perfil-compatibilidad?editar=1")} />
        </Empty>
      ) : (
        lista.map(({ m, ev }, i) => {
          const falta = 6 - ev.cumplidos;
          return (
            <Pressable key={m.id} onPress={() => router.push(`/mascota/${m.id}`)}>
              <Card style={{ padding: 10, gap: 10 }}>
                <View>
                  <PetPhoto especie={m.especie} height={170} tone={i} />
                  <View style={{ position: "absolute", top: 10, right: 10 }}>
                    <Badge label={`${ev.cumplidos}/6`} tone={ev.cumplidos === 6 ? "success" : "cream"} />
                  </View>
                </View>
                <View style={{ paddingHorizontal: 6, paddingBottom: 6, gap: 2 }}>
                  <T v="h3">{m.nombre} · {m.especie}</T>
                  <T v="muted">{edadTexto(m.edadMeses)} · {refugioPorId(m.refugioId).nombre}</T>
                  {falta > 0 && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                      <TriangleAlert size={16} color={c.danger} />
                      <T v="muted" style={{ color: c.danger }}>{falta} {falta === 1 ? "criterio no cumplido" : "criterios no cumplidos"}</T>
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })
      )}

      <Sheet visible={permisoNotif} onClose={() => setPermisoNotif(false)} title="Activar notificaciones">
        <T v="muted">PetMatch te avisa cuando un refugio resuelva tu solicitud, agende una entrevista contigo (un día antes a las 12:00 p. m. y 3 horas antes), haya un contrato disponible, llegue un hito de seguimiento o se confirme una donación.</T>
        <T v="muted">Si no las activas, el resto de la app seguirá funcionando.</T>
        <Button label="Activar notificaciones" onPress={() => setPermisoNotif(false)} />
        <Button label="Ahora no" variant="secondary" onPress={() => setPermisoNotif(false)} />
      </Sheet>

      <Sheet visible={abierto} onClose={() => setAbierto(false)} title="Filtros">
        <Grupo titulo="Refugio" nombres={Object.fromEntries(REFUGIOS.map((r) => [r.id, r.nombre]))} opciones={REFUGIOS.filter((r) => r.activo).map((r) => r.id)} valor={borrador.refugio} onChange={(v) => setBorrador({ ...borrador, refugio: v })} />
        <Grupo titulo="Especie" opciones={["Perro", "Gato", "Otra"]} valor={borrador.especie} onChange={(v) => setBorrador({ ...borrador, especie: v })} />
        <Grupo titulo="Tamaño" opciones={["Pequeño", "Mediano", "Grande"]} valor={borrador.tamano} onChange={(v) => setBorrador({ ...borrador, tamano: v })} />
        <Grupo titulo="Edad" opciones={["Cachorro", "Joven", "Adulto", "Senior"]} valor={borrador.edad} onChange={(v) => setBorrador({ ...borrador, edad: v })} />
        <Grupo titulo="Sexo" opciones={["Macho", "Hembra"]} valor={borrador.sexo} onChange={(v) => setBorrador({ ...borrador, sexo: v })} />
        <Grupo titulo="Nivel de actividad" opciones={["Bajo", "Medio", "Alto"]} valor={borrador.actividad} onChange={(v) => setBorrador({ ...borrador, actividad: v })} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button label="Limpiar" variant="secondary" style={{ flex: 1 }} onPress={() => setBorrador({})} />
          <Button label={`Ver ${conteoBorrador} resultados`} style={{ flex: 2 }} onPress={() => { setF(borrador); setAbierto(false); }} />
        </View>
      </Sheet>
    </Screen>
  );
}
