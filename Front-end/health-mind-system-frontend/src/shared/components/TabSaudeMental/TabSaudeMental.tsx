import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { HistoricoMedicoDTO } from "../../types/dtos/HistoricoMedico.dto";
import { SaudeMentalDTO } from "../../types/dtos/SaudeMental.dto";
import ModalConfirm from "../ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };


const DEFAULT_LABEL_MINI: CSSProperties = {
    fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",
};

const DEFAULT_INPUT_STYLE: CSSProperties = {
    height: "36px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box",
    width: "100%", fontFamily: "inherit", color: "#333",
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

type TabHandle = { editar: () => void; excluir: () => void };
type TabState = { registrado: boolean; editando: boolean; excluindo: boolean };

const TabSaudeMental = forwardRef<TabHandle, {
    historico: HistoricoMedicoDTO | null;
    temProntuario: boolean;
    onSalvar: (dados: SaudeMentalDTO) => Promise<void>;
    onExcluir: () => Promise<void>;
    onStateChange?: (state: TabState) => void;
    labelMini?: CSSProperties;
    inputStyle?: CSSProperties;
    textAreaStyle?: CSSProperties;
}>(function TabSaudeMental({
    historico,
    temProntuario,
    onSalvar,
    onExcluir,
    onStateChange,
    labelMini = DEFAULT_LABEL_MINI,
    inputStyle = DEFAULT_INPUT_STYLE,
    textAreaStyle = DEFAULT_TEXTAREA_STYLE,
}, ref) {
    const sm = historico?.saudeMentalDTO;
    const registrado = !!(sm && (sm.diagnosticoPrevio?.trim() || sm.acompanhamento?.trim() || sm.statusInternacao?.trim() || sm.antecedentes?.trim()));

    const [editando, setEditando] = useState(false);
    const [diagnosticoPrevio, setDiagnosticoPrevio] = useState(sm?.diagnosticoPrevio ?? "");
    const [acompanhamento, setAcompanhamento] = useState(sm?.acompanhamento ?? "");
    const [statusInternacao, setStatusInternacao] = useState(sm?.statusInternacao ?? "");
    const [antecedentes, setAntecedentes] = useState(sm?.antecedentes ?? "");
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"update" | "delete" | null>(null);
    const [status, setStatus] = useState<StatusMessage | null>(null);

    useEffect(() => {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
        setEditando(false);
    }, [sm]);

    useImperativeHandle(ref, () => ({
        editar: abrirEdicao,
        excluir: () => setConfirmAction("delete"),
    }), [sm]);

    useEffect(() => {
        onStateChange?.({ registrado, editando, excluindo });
    }, [registrado, editando, excluindo, onStateChange]);

    function abrirEdicao() {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
        setEditando(true);
    }

    function cancelar() {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
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
            await onSalvar({ diagnosticoPrevio, acompanhamento, statusInternacao, antecedentes });
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
                    message="Tem certeza que deseja salvar as alterações de saúde mental?"
                    loading={salvando}
                    onConfirm={salvar}
                    onClose={() => setConfirmAction(null)}
                />
            )}
            {confirmAction === "delete" && (
                <ModalConfirm
                    actionType="delete"
                    message="Deseja realmente excluir os dados de saúde mental deste paciente? Esta ação não poderá ser desfeita."
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

    // Sem prontuário não é possível registrar saúde mental (depende de um histórico vinculado ao prontuário).
    if (!temProntuario) {
        return (
            <div style={{ background: "white", borderRadius: "14px", padding: "3rem 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center", color: "#999", fontSize: "14px" }}>
                Este paciente ainda não possui um prontuário. Cadastre um prontuário antes de registrar a saúde mental.
            </div>
        );
    }

    // Estado vazio: nenhum dado de saúde mental registrado e sem formulário aberto.
    if (!registrado && !editando) {
        return (
            <div style={{ ...cardStyle, alignItems: "center", textAlign: "center", padding: "3rem 28px" }}>
                <p style={{ color: "#999", fontSize: "14px", margin: 0 }}>Nenhum dado de saúde mental registrado para este paciente.</p>
                <button onClick={() => setEditando(true)} style={btnPrimary()}>Registrar Saúde Mental</button>
            </div>
        );
    }

    // Modo visualização: saúde mental registrada, sem edição em andamento.
    if (registrado && !editando) {
        return (
            <div style={cardStyle}>
                {modals}
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Saúde Mental</h2>

                <ViewField label="Diagnóstico prévio relacionado à saúde mental" value={sm?.diagnosticoPrevio} labelMini={labelMini} />
                <ViewField label="Acompanhamento psicológico/psiquiátrico anterior" value={sm?.acompanhamento} labelMini={labelMini} />
                <ViewField label="Internação em saúde mental" value={sm?.statusInternacao} labelMini={labelMini} />
                <ViewField label="Antecedentes familiares" value={sm?.antecedentes} labelMini={labelMini} />
            </div>
        );
    }

    // Modo edição/registro: formulário.
    return (
        <div style={cardStyle}>
            {modals}
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>{registrado ? "Editar Saúde Mental" : "Registrar Saúde Mental"}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Diagnóstico prévio relacionado à saúde mental</label>
                <textarea value={diagnosticoPrevio} onChange={e => setDiagnosticoPrevio(e.target.value)} placeholder="Ex: depressão, ansiedade, TDAH..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Acompanhamento psicológico/psiquiátrico anterior</label>
                <textarea value={acompanhamento} onChange={e => setAcompanhamento(e.target.value)} placeholder="Período e resultado de tratamentos anteriores..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Internação em saúde mental</label>
                <input value={statusInternacao} onChange={e => setStatusInternacao(e.target.value)} placeholder="Ex: Não / Sim (descreva)" style={inputStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelMini}>Antecedentes familiares</label>
                <textarea value={antecedentes} onChange={e => setAntecedentes(e.target.value)} placeholder="Familiares com transtornos mentais diagnosticados..." style={textAreaStyle} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={cancelar} disabled={salvando} style={btnGray()}>Cancelar</button>
                <button onClick={solicitarSalvar} disabled={salvando} style={btnPrimary(salvando)}>{salvando ? "Salvando..." : registrado ? "Salvar Alterações" : "Registrar Saúde Mental"}</button>
            </div>
        </div>
    );
});

export default TabSaudeMental;
