import { useEffect, useRef, type ReactNode } from "react";

/* Confirmación antes de una acción que no se puede deshacer. */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[2rem] bg-white p-8 text-ink shadow-soft backdrop:bg-ink/60"
    >
      <h2 id="confirm-title" className="font-heading text-2xl font-bold">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-7 text-ink/75">{children}</div>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border-2 border-ink/80 px-6 py-3 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85 active:scale-[0.98]"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
