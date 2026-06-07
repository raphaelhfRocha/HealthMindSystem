import React from "react";

/**
 * Tipo da ação que está sendo confirmada. Define o texto padrão e a cor do
 * botão de confirmação:
 *  - "delete" -> ação destrutiva (remoção de registro), botão vermelho.
 *  - "update" -> alteração de dados (PUT), botão azul.
 */
export type ConfirmActionType = "delete" | "update";

interface ModalConfirmProps {
    /** Tipo da ação a confirmar. Padrão: "update". */
    actionType?: ConfirmActionType;
    /** Título do modal; quando ausente usa um padrão de acordo com o actionType. */
    title?: string;
    /** Mensagem de confirmação; quando ausente usa um padrão de acordo com o actionType. */
    message?: string;
    /** Texto do botão de confirmação; quando ausente usa um padrão. */
    confirmLabel?: string;
    /** Texto do botão de cancelamento. Padrão: "Cancelar". */
    cancelLabel?: string;
    /** Indica que a ação está em andamento (desabilita os botões). */
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const defaults: Record<ConfirmActionType, { title: string; message: string; confirmLabel: string; loadingLabel: string; accent: string; icon: string }> = {
    delete: {
        title: "Confirmar exclusão",
        message: "Tem certeza que deseja excluir este registro? Esta ação não poderá ser desfeita.",
        confirmLabel: "Excluir",
        loadingLabel: "Excluindo...",
        accent: "#b03a2e",
        icon: "🗑",
    },
    update: {
        title: "Confirmar alteração",
        message: "Tem certeza que deseja salvar as alterações deste registro?",
        confirmLabel: "Salvar",
        loadingLabel: "Salvando...",
        accent: "#1A4FA3",
        icon: "✎",
    },
};

export default function ModalConfirm({
    actionType = "update",
    title,
    message,
    confirmLabel,
    cancelLabel = "Cancelar",
    loading = false,
    onConfirm,
    onClose,
}: ModalConfirmProps) {
    const preset = defaults[actionType];
    const heading = title ?? preset.title;
    const body = message ?? preset.message;
    const confirmText = loading ? preset.loadingLabel : (confirmLabel ?? preset.confirmLabel);

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250 }}
            onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "420px", maxWidth: "92vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: preset.accent, color: "white", fontSize: "16px", lineHeight: 1 }}>
                        {preset.icon}
                    </span>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111", margin: 0 }}>{heading}</h2>
                </div>

                <p style={{ fontSize: "14px", color: "#444", margin: 0, lineHeight: 1.5 }}>{body}</p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "#555", cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{ padding: "9px 20px", background: preset.accent, border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "white", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
