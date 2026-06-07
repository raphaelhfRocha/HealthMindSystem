import { Controller, Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { CSSProperties, FocusEvent } from "react";

type Option = {
  value: string;
  label: string;
};

type RHFSelectFieldProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  options: Option[];
  inputStyle: CSSProperties;
  disabled?: boolean;
  onFocus?: (event: FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
};

export function RHFSelectField<TFormValues extends FieldValues>({
  control,
  errors,
  name,
  label,
  placeholder,
  options,
  inputStyle,
  disabled = false,
  onFocus,
  onBlur,
}: RHFSelectFieldProps<TFormValues>) {
  const message = errors[name]?.message as string | undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            ref={field.ref}
            value={field.value ?? ""}
            onChange={e => field.onChange(e.target.value)}
            onBlur={e => {
              field.onBlur();
              onBlur?.(e);
            }}
            onFocus={onFocus}
            disabled={disabled}
            style={{
              ...inputStyle,
              background: disabled ? "#f5f7fb" : inputStyle.background ?? "white",
              color: disabled ? "#9aa3b2" : inputStyle.color ?? "#1a1a1a",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <option value="">{placeholder ?? "Selecione"}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {message && (
        <span style={{ fontSize: "11px", color: "#b03a2e", fontWeight: 600 }}>
          {message}
        </span>
      )}
    </div>
  );
}