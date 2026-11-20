import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function Section({ id, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </section>
  );
}
