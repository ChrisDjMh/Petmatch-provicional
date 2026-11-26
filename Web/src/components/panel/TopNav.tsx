import { Link, useLocation } from "react-router-dom";

export type TopNavItem = {
  label: string;
  to: string;
  paths: string[];
  soon?: boolean;
};

const matches = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

/** Barra horizontal de las seis secciones del panel Super Admin. */
export default function TopNav({ items }: { items: TopNavItem[] }) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Secciones del panel">
      <ul className="flex gap-1 overflow-x-auto rounded-full bg-white/70 p-1.5 shadow-soft backdrop-blur">
        {items.map((item) => {
          const active = item.paths.some((path) => matches(pathname, path));
          const base = "flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-extrabold transition-colors";
          return (
            <li key={item.label} className="min-w-fit flex-1">
              {item.soon ? (
                <span aria-disabled="true" className={`${base} cursor-not-allowed text-ink/45`}>
                  {item.label}<span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs">Pronto</span>
                </span>
              ) : (
                <Link to={item.to} aria-current={active ? "page" : undefined} className={`${base} ${active ? "bg-ink text-background" : "hover:bg-white"}`}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
