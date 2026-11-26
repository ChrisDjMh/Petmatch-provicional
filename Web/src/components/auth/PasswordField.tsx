import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { inputClass } from "./styles";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

/* Campo de contraseña con botón Mostrar/Ocultar. Compatible con react-hook-form (register). */
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, label, error, hint, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-extrabold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClass} pr-24 ${error ? "border-ink" : "border-transparent"}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 rounded-r-2xl px-5 text-sm font-extrabold text-ink/70 hover:text-ink"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="anim-error mt-2 text-sm font-bold">
          ⚠ {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-ink/65">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export default PasswordField;