import { Controller, Control, FieldErrors, FieldValues, Path } from "react-hook-form";

type RHFTextFieldProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  type?: string;
  inputStyle: React.CSSProperties;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  mask?: (value: string) => string;
};

export function RHFTextField<TFormValues extends FieldValues>({
  control,
  errors,
  name,
  label,
  placeholder,
  type = "text",
  inputStyle,
  onFocus,
  onBlur,
  mask,
}: RHFTextFieldProps<TFormValues>) {
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
          <input
            ref={field.ref}
            type={type}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={e => field.onChange(mask ? mask(e.target.value) : e.target.value)}
            onBlur={e => {
              field.onBlur();
              onBlur?.(e);
            }}
            onFocus={onFocus}
            style={inputStyle}
          />
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
