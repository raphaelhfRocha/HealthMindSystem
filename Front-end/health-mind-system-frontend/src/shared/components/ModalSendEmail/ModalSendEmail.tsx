import { useState } from "react";
import emailjs from "@emailjs/browser";
import { emailJsConfig, isEmailJsConfigured } from "../../config/emailjs.config";

interface ModalSendEmailProps {
    nome: string;
    cargo: string;
    loginEmail: string;
    senha: string;
    onClose: () => void;
}

type EnvioStatus =
    | { tipo: "ocioso" }
    | { tipo: "enviando" }
    | { tipo: "sucesso" }
    | { tipo: "erro"; mensagem: string };

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ModalSendEmail({
    nome,
    cargo,
    loginEmail,
    senha,
    onClose,
}: ModalSendEmailProps) {
    const [destinatario, setDestinatario] = useState("");
    const [mensagem, setMensagem] = useState(
        `Olá, ${nome}! Seu acesso ao HealthMind foi criado. Utilize as credenciais abaixo para o primeiro login e troque a senha assim que possível.`
    );
    const [status, setStatus] = useState<EnvioStatus>({ tipo: "ocioso" });

    const configurado = isEmailJsConfigured();
    const destinatarioValido = EMAIL_REGEX.test(destinatario.trim());
    const enviando = status.tipo === "enviando";
    const podeEnviar = configurado && destinatarioValido && !enviando;

    const enviar = async () => {
        if (!podeEnviar) {
            return;
        }

        setStatus({ tipo: "enviando" });

        try {
            await emailjs.send(
                emailJsConfig.serviceId,
                emailJsConfig.templateId,
                {
                    to_email: destinatario.trim(),
                    nome,
                    cargo,
                    login_email: loginEmail,
                    senha,
                    mensagem: mensagem.trim(),
                },
                { publicKey: emailJsConfig.publicKey }
            );

            setStatus({ tipo: "sucesso" });
        } catch (err) {
            const mensagemErro =
                (err as { text?: string })?.text ||
                (err instanceof Error ? err.message : "") ||
                "Não foi possível enviar o e-mail. Tente novamente.";
            setStatus({ tipo: "erro", mensagem: mensagemErro });
        }
    };

    const inputStyle: React.CSSProperties = {
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

    const credencialBox: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        border: "1px solid #dde3f0",
        borderRadius: "10px",
        padding: "12px 14px",
        background: "#f9fafc",
    };

    const linhaCredencial = (label: string, valor: string) => (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#555" }}>{label}</span>
            <span style={{ fontSize: "13px", color: "#1a1a1a", fontFamily: "monospace", wordBreak: "break-all", textAlign: "right" }}>{valor}</span>
        </div>
    );

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "480px", maxWidth: "92vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: "#1A4FA3", color: "white", fontSize: "16px", lineHeight: 1 }}>✉</span>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111", margin: 0 }}>Enviar credenciais por e-mail</h2>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
                </div>

                {!configurado && (
                    <div style={{ padding: "10px 12px", borderRadius: "10px", background: "#fff8e6", border: "1px solid #ffe2a8", color: "#8a5a00", fontSize: "12px", lineHeight: 1.5 }}>
                        Envio de e-mail não configurado. Defina <strong>VITE_EMAILJS_SERVICE_ID</strong>, <strong>VITE_EMAILJS_TEMPLATE_ID</strong> e <strong>VITE_EMAILJS_PUBLIC_KEY</strong> no arquivo <strong>.env.local</strong> (veja .env.example).
                    </div>
                )}

                {status.tipo === "sucesso" ? (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#eef9f1", border: "1px solid #bfe6cd", color: "#1E8E4E", fontSize: "13px", fontWeight: 600 }}>
                        E-mail enviado para {destinatario.trim()} com sucesso.
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#555" }}>E-mail do destinatário *</label>
                            <input
                                type="email"
                                value={destinatario}
                                onChange={e => setDestinatario(e.target.value)}
                                placeholder="email-real@exemplo.com"
                                disabled={!configurado || enviando}
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = "#1A4FA3")}
                                onBlur={e => (e.currentTarget.style.borderColor = "#dde3f0")}
                            />
                            {destinatario.length > 0 && !destinatarioValido && (
                                <span style={{ fontSize: "11px", color: "#b03a2e" }}>E-mail inválido.</span>
                            )}
                        </div>

                        {status.tipo === "erro" && (
                            <div style={{ padding: "10px 12px", borderRadius: "10px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "12px", lineHeight: 1.5 }}>
                                {status.mensagem}
                            </div>
                        )}
                    </>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "#555", cursor: "pointer" }}
                    >
                        {status.tipo === "sucesso" ? "Fechar" : "Cancelar"}
                    </button>
                    {status.tipo !== "sucesso" && (
                        <button
                            type="button"
                            onClick={enviar}
                            disabled={!podeEnviar}
                            style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "white", cursor: podeEnviar ? "pointer" : "not-allowed", opacity: podeEnviar ? 1 : 0.5 }}
                        >
                            {enviando ? "Enviando..." : "Enviar e-mail"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
