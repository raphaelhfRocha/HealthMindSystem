import { CSSProperties, useEffect, useState } from "react";
import { HistoricoMedicoDTO } from "../../types/dtos/HistoricoMedico.dto";
import ModalConfirm from "../ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };


const DEFAULT_LABEL_MINI: CSSProperties = {
    fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",
};

const DEFAULT_TEXTAREA_STYLE: CSSProperties = {
    border: "1px solid #dde3f0", borderRadius: "8px", padding: "10px", fontSize: "13px",
    outline: "none", resize: "vertical", lineHeight: "1.7", width: "100%",
    boxSizing: "border-box", minHeight: "110px", fontFamily: "inherit", color: "#1a1a1a",
};

const cardStyle: CSSProperties = {
    background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    display: "flex", flexDirection: "column", gap: "16px",
};

function btnPrimary(disabled = false) {
    return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}

function btnGray() {
    return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "#555", cursor: "pointer" };
}

function ViewField({ label, value, labelMini }: { label: string; value?: string; labelMini: CSSProperties }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelMini}>{label}</label>
            <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {value?.trim() ? value : "—"}
            </p>
        </div>
    );
}

export default function TabHistorico({
    historico,
    temProntuario,
    onSalvar,
    onExcluir,
    labelMini = DEFAULT_LABEL_MINI,
    textAreaStyle = DEFAULT_TEXTAREA_STYLE,
}: {
    historico: HistoricoMedicoDTO | null;
    temProntuario: boolean;
    onSalvar: (dados: { razaoAtendimento: string; impactoRazao: string, expectativaAtendimento: string }) => Promise<void>;
    onExcluir: () => Promise<void>;
    labelMini?: CSSProperties;
    textAreaStyle?: CSSProperties;
}) {
    const registrado = !!historico?.id;
    const [editando, setEditando] = useState(false);
    const [razaoAtendimento, setRazaoAtendimento] = useState(historico?.razaoAtendimento ?? "");
    const [impactoRazao, setImpactoRazao] = useState(historico?.impactoRazao ?? "");
    const [expectativaAtendimento, setExpectativaAtendimento] = useState(historico?.expectativaAtendimento ?? "");
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"update" | "delete" | null>(null);
    const [status, setStatus] = useState<StatusMessage | null>(null);

    useEffect(() => {
        setRazaoAtendimento(historico?.razaoAtendimento ?? "");
        setImpactoRazao(historico?.impactoRazao ?? "");
        setExpectativaAtendimento(historico?.expectativaAtendimento ?? "");
        setEditando(false);
    }, [historico]);

    function abrirEdicao() {
        setRazaoAtendimento(historico?.razaoAtendimento ?? "");
        setImpactoRazao(historico?.impactoRazao ?? "");
        setExpectativaAtendimento(historico?.expectativaAtendimento ?? "");
        setEditando(true);
    }

    function cancelar() {
        setRazaoAtendimento(historico?.razaoAtendimento ?? "");
        setImpactoRazao(historico?.impactoRazao ?? "");
        setExpectativaAtendimento(historico?.expectativaAtendimento ?? "");
        setEditando(false);
    }

    function solicitarSalvar() {
        if (registrado) {
            setConfirmAction("update");
        } else {
            salvar();
        }
    }

    async function salvar() {
        try {
            setSalvando(true);
            await onSalvar({ razaoAtendimento, impactoRazao, expectativaAtendimento });
            setEditando(false);
            setConfirmAction(null);
            setStatus({ type: "success", message: registrado ? MESSAGES.SUCCESS.UPDATED : MESSAGES.SUCCESS.CREATED });
        } catch (err) {
            const parsed = parseApiError(err);
            setConfirmAction(null);
            setStatus({ type: "error", message: parsed.message, details: parsed.details });
        } finally {
            setSalvando(false);
        }
    }

    async function confirmExcluir() {
        try {
            setExcluindo(true);
            await onExcluir();
            setConfirmAction(null);
            setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
        } catch (err) {
            const parsed = parseApiError(err);
            setConfirmAction(null);
            setStatus({ type: "error", message: parsed.message, details: parsed.details });
        } finally {
            setExcluindo(false);
        }
    }

    const modals = (
        <>
            {confirmAction === "update" && (
                <ModalConfirm
                    actionType="update"
                    message="Tem certeza que deseja salvar as alterações do histórico médico?"
                    loading={salvando}
                    onConfirm={salvar}
                    onClose={() => setConfirmAction(null)}
                />
            )}
            {confirmAction === "delete" && (
                <ModalConfirm
                    actionType="delete"
                    message="Deseja realmente excluir o histórico médico deste paciente? Esta ação não poderá ser desfeita."
                    loading={excluindo}
                    onConfirm={confirmExcluir}
                    onClose={() => setConfirmAction(null)}
                />
            )}
            {status && (
                <ModalMessagesStatus
                    type={status.type}
                    message={status.message}
                    details={status.details}
                    onClose={() => setStatus(null)}
                />
            )}
        </>
    );

    if (!temProntuario) {
        return (
            <div style={{ background: "white", borderRadius: "14px", padding: "3rem 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center", color: "#999", fontSize: "14px" }}>
                Este paciente ainda não possui um prontuário. Cadastre um prontuário antes de registrar o histórico.
            </div>
        );
    }

    // Estado vazio: nenhum histórico registrado e sem formulário aberto.
    if (!registrado && !editando) {
        return (
            <div style={{ ...cardStyle, alignItems: "center", textAlign: "center", padding: "3rem 28px" }}>
                <p style={{ color: "#999", fontSize: "14px", margin: 0 }}>Nenhum histórico registrado para este paciente.</p>
                <button onClick={() => setEditando(true)} style={btnPrimary()}>Registrar Histórico</button>
            </div>
        );
    }

    // Modo visualização: histórico registrado, sem edição em andamento.
    if (registrado && !editando) {
        return (
            <div style={cardStyle}>
                {modals}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Histórico</h2>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={abrirEdicao} style={{ padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}>
                            Editar
                        </button>
                        <button onClick={() => setConfirmAction("delete")} disabled={excluindo} style={{ padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindo ? "not-allowed" : "pointer", opacity: excluindo ? 0.6 : 1 }}>
                            {excluindo ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </div>

                <ViewField label="Queixa principal e motivo do atendimento" value={historico?.razaoAtendimento} labelMini={labelMini} />
                <ViewField label="Como esses sintomas/problemas afetam o dia a dia do paciente (no trabalho, nos estudos, nos relacionamentos, no seu sono, etc.)?" value={historico?.impactoRazao} labelMini={labelMini} />
                <ViewField label="O que o paciente espera desse acompanhamento psicológico?" value={historico?.expectativaAtendimento} labelMini={labelMini} />
            </div>
        );
    }

    // Modo edição/registro: formulário.
    return (
        <div style={cardStyle}>
            {modals}
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>{registrado ? "Editar Histórico" : "Registrar Histórico"}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Queixa principal e motivo do atendimento</label>
                <textarea value={razaoAtendimento} onChange={e => setRazaoAtendimento(e.target.value)} placeholder="Descreva a queixa principal e o motivo do atendimento..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Como esses sintomas/problemas afetam o dia a dia do paciente(no trabalho, nos estudos, nos relacionamentos, no seu sono, etc.)?</label>
                <textarea value={impactoRazao} onChange={e => setImpactoRazao(e.target.value)} placeholder="Descreva o impacto no trabalho, relacionamentos, sono, etc..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>O que o paciente espera desse acompanhamento psicológico?</label>
                <textarea value={expectativaAtendimento} onChange={e => setExpectativaAtendimento(e.target.value)} placeholder="Descreva a expectativa do paciente sobre o acompanhamento psicológico..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={cancelar} disabled={salvando} style={btnGray()}>Cancelar</button>
                <button onClick={solicitarSalvar} disabled={salvando} style={btnPrimary(salvando)}>{salvando ? "Salvando..." : registrado ? "Salvar Alterações" : "Registrar Histórico"}</button>
            </div>
        </div>
    );
}
