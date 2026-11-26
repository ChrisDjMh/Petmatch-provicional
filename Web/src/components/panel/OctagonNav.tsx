import { useHref, useLinkClickHandler, useLocation } from "react-router-dom";

export type OctagonNavItem = {
  label: string;
  /** Texto del botón partido en líneas para que quepa dentro del triángulo. */
  lines?: string[];
  to: string;
  /** Sección aún sin pantalla: se muestra deshabilitada. */
  soon?: boolean;
};

/* "side": lado plano a la izquierda y triángulos hacia la derecha (como la referencia), de arriba abajo.
   "top":  lado plano arriba y triángulos hacia abajo, de izquierda a derecha (para celular). */
export type OctagonOrientation = "side" | "top";

/* Medio octágono: con 4 botones cada uno es un triángulo de 45° (un octágono partido a la mitad). */
const RADIUS = 200;
const PAD = 4;

function wedge(orientation: OctagonOrientation, index: number, total: number) {
  const step = Math.PI / total;
  const center =
    orientation === "side" ? { x: 0, y: RADIUS } : { x: RADIUS, y: 0 };

  // Ángulos (en pantalla, con y hacia abajo) del triángulo número "index".
  const [first, second] =
    orientation === "side"
      ? [-Math.PI / 2 + index * step, -Math.PI / 2 + (index + 1) * step]
      : [(total - index - 1) * step, (total - index) * step];

  const at = (angle: number) => ({
    x: center.x + RADIUS * Math.cos(angle),
    y: center.y + RADIUS * Math.sin(angle),
  });
  const vertices = [center, at(first), at(second)];

  // El texto va a la altura del centroide, centrado entre los dos bordes del triángulo a esa altura.
  const y = (vertices[0].y + vertices[1].y + vertices[2].y) / 3;
  const crossings: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % 3];
    if (Math.abs(a.y - b.y) > 0.001 && y >= Math.min(a.y, b.y) && y <= Math.max(a.y, b.y)) {
      crossings.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
    } else if (Math.abs(a.y - b.y) <= 0.001 && Math.abs(a.y - y) <= 0.001) {
      crossings.push(a.x, b.x);
    }
  }
  const x = (Math.min(...crossings) + Math.max(...crossings)) / 2;

  return {
    points: vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" "),
    label: { x, y },
  };
}

const fontSizeFor = (total: number) => (total > 5 ? 11 : total > 4 ? 12 : 14.5);

function WedgeLabel({
  lines,
  x,
  y,
  fontSize,
  className,
}: {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  className: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={fontSize}
      className={`pointer-events-none select-none font-body font-extrabold ${className}`}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? `${0.35 - (lines.length - 1) * 0.55}em` : "1.1em"}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

type WedgeProps = {
  item: OctagonNavItem;
  orientation: OctagonOrientation;
  index: number;
  total: number;
};

function LinkWedge({ item, orientation, index, total }: WedgeProps) {
  const href = useHref(item.to);
  const handleClick = useLinkClickHandler<HTMLAnchorElement>(item.to);
  const { pathname } = useLocation();
  const isActive = [item.to, ...(item.also ?? [])].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const shape = wedge(orientation, index, total);

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className="group outline-none"
    >
      <polygon
        points={shape.points}
        strokeWidth={3}
        strokeLinejoin="round"
        className={`stroke-white transition-colors group-focus-visible:stroke-accent group-focus-visible:[stroke-width:6] ${
          isActive ? "fill-ink" : "fill-white/60 group-hover:fill-white"
        }`}
      />
      <WedgeLabel
        lines={item.lines ?? [item.label]}
        x={shape.label.x}
        y={shape.label.y}
        fontSize={fontSizeFor(total)}
        className={isActive ? "fill-background" : "fill-ink"}
      />
    </a>
  );
}

function DisabledWedge({ item, orientation, index, total }: WedgeProps) {
  const shape = wedge(orientation, index, total);
  return (
    <g role="group" aria-label={`${item.label} (próximamente)`} className="cursor-not-allowed">
      <title>Próximamente</title>
      <polygon
        points={shape.points}
        strokeWidth={3}
        strokeLinejoin="round"
        className="fill-white/25 stroke-white"
      />
      <WedgeLabel
        lines={item.lines ?? [item.label]}
        x={shape.label.x}
        y={shape.label.y}
        fontSize={fontSizeFor(total)}
        className="fill-ink/45"
      />
    </g>
  );
}

export default function OctagonNav({
  items,
  orientation = "side",
}: {
  items: OctagonNavItem[];
  orientation?: OctagonOrientation;
}) {
  const total = items.length;
  const isSide = orientation === "side";

  // En "side" el lado plano queda justo en x = 0, para pegarlo al borde izquierdo de la pantalla.
  const viewBox = isSide
    ? `0 ${-PAD} ${RADIUS + PAD} ${RADIUS * 2 + PAD * 2}`
    : `${-PAD} ${-PAD} ${RADIUS * 2 + PAD * 2} ${RADIUS + PAD * 2}`;

  return (
    <svg
      viewBox={viewBox}
      className={`block overflow-visible drop-shadow-[0_10px_20px_rgba(46,40,54,0.18)] ${
        isSide ? "w-[204px]" : "mx-auto w-full max-w-[400px]"
      }`}
    >
      {items.map((item, index) =>
        item.soon ? (
          <DisabledWedge
            key={item.to}
            item={item}
            orientation={orientation}
            index={index}
            total={total}
          />
        ) : (
          <LinkWedge key={item.to} item={item} orientation={orientation} index={index} total={total} />
        ),
      )}
    </svg>
  );
}