import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextAreaField } from "@/components/auth/TextField";

const MIN = 10;
const MAX = 500;

const schema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Escribe el motivo de la suspensión.")
    .min(MIN, `Escribe al menos ${MIN} caracteres para que el refugio lo entienda.`)
    .max(MAX, `Máximo ${MAX} caracteres.`),
});

function ReasonForm({
  label,
  hint,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  label: string;
  hint: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ text: string }>({ resolver: zodResolver(schema), defaultValues: { text: "" } });
  const length = watch("text").length;

  return (
    <form onSubmit={handleSubmit(({ text }) => onSubmit(text.trim()))} noValidate className="mt-5">
      <TextAreaField
        id="reason-text"
        label={label}
        rows={5}
        maxLength={MAX + 100}
        hint={`${length}/${MAX} · ${hint}`}
        error={errors.text?.message}
        {...register("text")}
      />
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border-2 border-ink/80 px-6 py-3 font-extrabold transition hover:bg-cards-2/40 active:scale-[0.98]"
        >
          Volver
        </button>
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 font-extrabold text-background transition hover:bg-ink/85 active:scale-[0.98]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

/* Ventana que exige un motivo escrito antes de continuar (RN-17). Se monta el formulario solo al abrir,
   así cada vez empieza vacío y sin errores. */
export default function ReasonDialog({
  open,
  title,
  description,
  label,
  hint,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  label: string;
  hint: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
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
      aria-labelledby="reason-title"
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-[2rem] bg-white p-8 text-ink shadow-soft backdrop:bg-ink/60"
    >
      {open && (
        <>
          <h2 id="reason-title" className="font-heading text-2xl font-bold">
            {title}
          </h2>
          <p className="mt-3 leading-7 text-ink/75">{description}</p>
          <ReasonForm
            label={label}
            hint={hint}
            submitLabel={submitLabel}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </>
      )}
    </dialog>
  );
}