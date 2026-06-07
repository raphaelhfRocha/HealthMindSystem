import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { Control, FieldErrors, Controller } from "react-hook-form";
import { RHFTextField } from "../RHFTextField";
import { EnderecoDTO } from "../../types/dtos/Endereco.dto";
import { formatCep } from "../../utils";

type Props = {
    control?: Control<any>;
    errors?: FieldErrors<any>;
    namePrefix?: string; // ex: 'enderecoDTO'
    inputStyle?: CSSProperties;
    disabled?: boolean;
    value?: EnderecoDTO | null;
    onChangeEndereco?: (endereco: EnderecoDTO) => void;
    setValue?: (name: string, value: any, options?: any) => void;
};

const defaultInputStyle: CSSProperties = {
    height: "38px",
    border: "1px solid #dde3f0",
    borderRadius: "8px",
    padding: "0 12px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: "inherit",
    background: "white",
    color: "#1a1a1a",
};

export default function SearchEnderecoByCEP({
    control,
    errors,
    namePrefix = "enderecoDTO",
    inputStyle = defaultInputStyle,
    disabled = false,
    value = null,
    onChangeEndereco,
    setValue,
}: Props) {
    const [local, setLocal] = useState<EnderecoDTO>(
        value ?? {
            cep: "",
            logradouro: "",
            complemento: "",
            bairro: "",
            uf: "",
            localidade: "",
            regiao: "",
        }
    );

    useEffect(() => {
        if (value) {
            setLocal(value);
        }
    }, [value]);

    function handleLocalChange<K extends keyof EnderecoDTO>(key: K, next: EnderecoDTO[K]) {
        const updated = { ...local, [key]: next };
        setLocal(updated);
        onChangeEndereco?.(updated);
    }

    async function lookupCep(cepRaw: string) {
        const cep = (cepRaw || local.cep || "").replace(/\D/g, "");
        if (cep.length !== 8) {
            return;
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!res.ok) return;
            const data = await res.json();
            if (data.erro) return;

            const updated: EnderecoDTO = {
                cep: data.cep ?? cep,
                logradouro: [data.logradouro, data.complemento].filter(Boolean).join(", "),
                complemento: "",
                bairro: data.bairro ?? "",
                uf: data.uf ?? "",
                localidade: data.localidade ?? "",
                regiao: data.regiao ?? "",
            };

            // modo react-hook-form via setValue
            if (setValue && control) {
                setValue(`${namePrefix}.cep`, formatCep(updated.cep), { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.logradouro`, updated.logradouro, { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.complemento`, "", { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.bairro`, updated.bairro, { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.uf`, updated.uf, { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.localidade`, updated.localidade, { shouldValidate: true, shouldDirty: true });
                setValue(`${namePrefix}.regiao`, updated.regiao, { shouldValidate: true, shouldDirty: true });
            }

            // fallback controlado
            setLocal(updated);
            onChangeEndereco?.(updated);
        } catch (e) {
            // fail silently
        }
    }

    if (control) {
        // integrar com react-hook-form via RHFTextField
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 12, alignItems: "end" }}>
                    <Controller
                        control={control}
                        name={(namePrefix + ".cep") as any}
                        render={({ field }) => (
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                <input
                                    ref={field.ref}
                                    value={formatCep(field.value ?? "")}
                                    placeholder="00000-000"
                                    disabled={disabled}
                                    onChange={e => field.onChange(formatCep(e.target.value))}
                                    style={{ ...inputStyle, flex: 1, width: 160, minWidth: 0 }}
                                />
                                <button type="button" onClick={() => lookupCep(field.value)} disabled={disabled} style={{ background: "#1A4FA3", border: "none", color: "white", padding: "7px 8px", borderRadius: 8, cursor: "pointer", height: 38, width: 38, display: "flex", alignItems: "center", justifyContent: "center" }} title="Consultar CEP">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        )}
                    />
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".logradouro") as any}
                        label="Logradouro"
                        placeholder="Rua, Avenida..."
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".complemento") as any}
                        label="Complemento"
                        placeholder="Apto, Bloco..."
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".bairro") as any}
                        label="Bairro"
                        placeholder="Bairro"
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".uf") as any}
                        label="uf"
                        placeholder="SP"
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".localidade") as any}
                        label="Cidade"
                        placeholder="Cidade"
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                    <RHFTextField
                        control={control}
                        errors={errors ?? {}}
                        name={(namePrefix + ".regiao") as any}
                        label="Região"
                        placeholder="Região"
                        inputStyle={inputStyle}
                        disabled={disabled}
                    />
                </div>
            </div>
        );
    }

    // fallback controlado
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 12, alignItems: "end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>CEP</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <input
                            value={formatCep(local.cep)}
                            onChange={e => handleLocalChange("cep", formatCep(e.target.value))}
                            placeholder="00000-000"
                            disabled={disabled}
                            style={{ ...inputStyle, width: 160, minWidth: 0 }}
                            onKeyDown={e => { if (e.key === "Tab") { lookupCep((e.target as HTMLInputElement).value); } }}
                            onBlur={e => { /* opcional: não disparar aqui para evitar duplicidade com TAB */ }}
                        />

                        <button
                            type="button"
                            onClick={() => lookupCep(local.cep)}
                            disabled={disabled}
                            style={{ background: "#1A4FA3", border: "none", color: "white", padding: "7px 8px", borderRadius: 8, cursor: "pointer", height: 38, width: 38, display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Consultar CEP"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Logradouro</label>
                    <input value={local.logradouro} onChange={e => handleLocalChange("logradouro", e.target.value)} placeholder="Rua, Avenida..." disabled={disabled} style={inputStyle} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Complemento</label>
                    <input value={local.complemento} onChange={e => handleLocalChange("complemento", e.target.value)} placeholder="Apto, Bloco..." disabled={disabled} style={inputStyle} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bairro</label>
                    <input value={local.bairro} onChange={e => handleLocalChange("bairro", e.target.value)} placeholder="Bairro" disabled={disabled} style={inputStyle} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>uf</label>
                    <input value={local.uf} onChange={e => handleLocalChange("uf", e.target.value)} placeholder="SP" disabled={disabled} style={inputStyle} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cidade</label>
                    <input value={local.localidade} onChange={e => handleLocalChange("localidade", e.target.value)} placeholder="Cidade" disabled={disabled} style={inputStyle} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Região</label>
                    <input value={local.regiao} onChange={e => handleLocalChange("regiao", e.target.value)} placeholder="Região" disabled={disabled} style={inputStyle} />
                </div>
            </div>
        </div>
    );
}
