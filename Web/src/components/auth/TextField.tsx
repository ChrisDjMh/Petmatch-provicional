import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { inputClass } from "./styles";

type FieldExtras = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

function FieldMessage({ id, error, hint }: Pick<FieldExtras, "id" | "error" | "hint">) {
  if (error) {
    return (
      <p id={`${id}-error`} className="anim-error mt-2 text-sm font-bold">
        ⚠ {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="mt-2 text-sm text-ink/65">
      {hint}
    </p>
  ) : null;
}

function describedBy({ id, error, hint }: Pick<FieldExtras, "id" | "error" | "hint">) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type TextFieldProps = FieldExtras & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/* Campo de texto con etiqueta y mensaje de error. Compatible con react-hook-form (register). */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, error, hint, ...rest },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-extrabold">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ id, error, hint })}
        className={`${inputClass} ${error ? "border-ink" : "border-transparent"}`}
        {...rest}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
});

type TextAreaFieldProps = FieldExtras &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ id, label, error, hint, ...rest }, ref) {
    return (
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-extrabold">
          {label}
        </label>
        <textarea
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy({ id, error, hint })}
          className={`${inputClass} min-h-28 resize-y ${error ? "border-ink" : "border-transparent"}`}
          {...rest}
        />
        <FieldMessage id={id} error={error} hint={hint} />
      </div>
    );
  },
);