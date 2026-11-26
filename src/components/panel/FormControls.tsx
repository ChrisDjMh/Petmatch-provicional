import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { inputClass } from "@/components/auth/styles";

/* Controles de formulario del panel que no existen en components/auth: lista desplegable y opciones
   tipo botón. Los campos de texto, números y descripción usan TextField y TextAreaField. */

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  id: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  hint?: string;
};

/* Lista desplegable con etiqueta y mensaje de error. Compatible con react-hook-form (register). */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { id, label, options, placeholder = "Elige una opción", error, hint, ...rest },
  ref,
) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-extrabold">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClass} appearance-none pr-12 ${error ? "border-ink" : "border-transparent"}`}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error ? (
        <p id={`${id}-error`} className="anim-error mt-2 text-sm font-bold">
          ⚠ {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink/65">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

type ChoiceGroupProps = {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
};

/* Opciones tipo botón: una sola respuesta, sin valor inicial para que no se pueda omitir sin querer. */
export function ChoiceGroup({ label, options, value, onChange, onBlur, error, hint }: ChoiceGroupProps) {
  const name = useId();
  const messageId = `${name}-message`;
  return (
    <fieldset aria-describedby={error || hint ? messageId : undefined}>
      <legend className="mb-2 text-sm font-extrabold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border-2 px-4 py-2.5 text-sm font-extrabold transition-colors focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 ${
                checked
                  ? "border-ink bg-ink text-background"
                  : error
                    ? "border-ink bg-white hover:bg-cards-2/40"
                    : "border-transparent bg-white hover:bg-cards-2/40"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={messageId} className="anim-error mt-2 text-sm font-bold">
          ⚠ {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-2 text-sm text-ink/65">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}