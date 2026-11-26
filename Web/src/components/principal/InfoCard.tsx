import type { ReactNode } from "react";

type InfoCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  accent?: boolean;
};

export default function InfoCard({ icon, title, children, accent = false }: InfoCardProps) {
  return (
    <article
      className={`relative flex min-h-64 flex-col p-7 shadow-soft transition-transform duration-300 hover:-translate-y-2 sm:p-8 ${
        accent ? "bg-cards text-background" : "bg-background text-ink"
      }`}
    >
      <div
        className={`flex size-14 items-center justify-center ${
          accent ? "bg-accent text-ink" : "bg-cards-2/50 text-cards"
        }`}
      >
        {icon}
      </div>
      <h3 className="mt-7 font-heading text-2xl font-bold">{title}</h3>
      <p className={`mt-3 leading-7 ${accent ? "text-background/85" : "text-ink/70"}`}>
        {children}
      </p>
    </article>
  );
}