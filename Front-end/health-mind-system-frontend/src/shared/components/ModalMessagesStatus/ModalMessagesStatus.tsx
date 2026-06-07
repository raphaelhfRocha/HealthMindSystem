import React from "react";

export type ApiErrorCode = "VALIDATION_ERROR" | "NOT_FOUND" | "INTERN_ERROR";

export interface ApiErrorDetail {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    error: string;
    code: ApiErrorCode;
    details?: ApiErrorDetail[];
}

export interface NormalizedApiError {
    message: string;
    code?: ApiErrorCode;
    details: ApiErrorDetail[];
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as ApiErrorResponse).error === "string"
    );
}

export function parseApiError(error: unknown): NormalizedApiError {
    const responseData = (error as { response?: { data?: unknown } })?.response?.data;

    if (isApiErrorResponse(responseData)) {
        return {
            message: responseData.error,
            code: responseData.code,
            details: Array.isArray(responseData.details) ? responseData.details : [],
        };
    }

    if (typeof error === "string") {
        return { message: error, details: [] };
    }

    if (error instanceof Error && error.message) {
        return { message: error.message, details: [] };
    }

    return { message: "Ocorreu um erro inesperado. Tente novamente.", details: [] };
}

export type ModalMessagesStatusType = "success" | "error";

interface ModalMessagesStatusProps {
    type: ModalMessagesStatusType;
    title?: string;
    message: string;
    details?: ApiErrorDetail[];
    onClose: () => void;
}

const palette = {
    success: { accent: "#1E8E4E", soft: "#eef9f1", border: "#bfe6cd", icon: "✓" },
    error: { accent: "#b03a2e", soft: "#fff5f5", border: "#ffd0d0", icon: "!" },
};

export default function ModalMessagesStatus({
    type,
    title,
    message,
    details,
    onClose,
}: ModalMessagesStatusProps) {
    const colors = palette[type];
    const heading = title ?? (type === "success" ? "Sucesso" : "Erro");
    const hasDetails = Array.isArray(details) && details.length > 0;

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "440px", maxWidth: "92vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: colors.accent, color: "white", fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>
                            {colors.icon}
                        </span>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111", margin: 0 }}>{heading}</h2>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
                </div>

                <p style={{ fontSize: "14px", color: "#333", margin: 0, lineHeight: 1.5 }}>{message}</p>

                {hasDetails && (
                    <ul style={{ margin: 0, padding: "12px 14px", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", borderRadius: "10px", border: `1px solid ${colors.border}`, background: colors.soft }}>
                        {details!.map((detail, index) => (
                            <li key={`${detail.field}-${index}`} style={{ fontSize: "12px", color: colors.accent, lineHeight: 1.4 }}>
                                <strong style={{ fontWeight: 700 }}>{detail.message}</strong>
                            </li>
                            // <li key={`${detail.field}-${index}`} style={{ fontSize: "12px", color: colors.accent, lineHeight: 1.4 }}>
                            //     {detail.field && (
                            //         <strong style={{ fontWeight: 700 }}>{detail.field}</strong>
                            //     )}
                            //     <strong style={{ fontWeight: 700 }}>{detail.message}</strong>
                            // </li>
                        ))}
                    </ul>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: "9px 24px", background: colors.accent, border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "white", cursor: "pointer" }}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}
