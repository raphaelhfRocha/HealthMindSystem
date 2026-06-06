import { CSSProperties, useEffect, useState } from "react";
import { HistoricoMedicoDTO } from "../../types/dtos/HistoricoMedico.dto";
import { SaudeMentalDTO } from "../../types/dtos/SaudeMental.dto";


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

export default function TabSaudeMental({
    historico,
    temProntuario,
    onSalvar,
    onExcluir,
    labelMini = DEFAULT_LABEL_MINI,
    inputStyle = DEFAULT_INPUT_STYLE,
    textAreaStyle = DEFAULT_TEXTAREA_STYLE,
}: {
    historico: HistoricoMedicoDTO | null;
    temProntuario: boolean;
    onSalvar: (dados: SaudeMentalDTO) => Promise<void>;
    onExcluir: () => Promise<void>;
    labelMini?: CSSProperties;
    inputStyle?: CSSProperties;
    textAreaStyle?: CSSProperties;
}) {
    const sm = historico?.saudeMentalDTO;
    const registrado = !!(sm && (sm.diagnosticoPrevio?.trim() || sm.acompanhamento?.trim() || sm.statusInternacao?.trim() || sm.antecedentes?.trim()));

    const [editando, setEditando] = useState(false);
    const [diagnosticoPrevio, setDiagnosticoPrevio] = useState(sm?.diagnosticoPrevio ?? "");
    const [acompanhamento, setAcompanhamento] = useState(sm?.acompanhamento ?? "");
    const [statusInternacao, setStatusInternacao] = useState(sm?.statusInternacao ?? "");
    const [antecedentes, setAntecedentes] = useState(sm?.antecedentes ?? "");
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
        setEditando(false);
        setErro(null);
    }, [sm]);

    function abrirEdicao() {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
        setErro(null);
        setEditando(true);
    }

    function cancelar() {
        setDiagnosticoPrevio(sm?.diagnosticoPrevio ?? "");
        setAcompanhamento(sm?.acompanhamento ?? "");
        setStatusInternacao(sm?.statusInternacao ?? "");
        setAntecedentes(sm?.antecedentes ?? "");
        setErro(null);
        setEditando(false);
    }

    async function salvar() {
        try {
            setSalvando(true);
            setErro(null);
            await onSalvar({ diagnosticoPrevio, acompanhamento, statusInternacao, antecedentes });
            setEditando(false);
        } catch {
            setErro("Não foi possível salvar a saúde mental.");
        } finally {
            setSalvando(false);
        }
    }

    async function excluir() {
        if (!window.confirm("Deseja realmente excluir os dados de saúde mental deste paciente?")) return;
        try {
            setExcluindo(true);
            setErro(null);
            await onExcluir();
        } catch {
            setErro("Não foi possível excluir a saúde mental.");
        } finally {
            setExcluindo(false);
        }
    }

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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Saúde Mental</h2>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={abrirEdicao} style={{ padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}>
                            Editar
                        </button>
                        <button onClick={excluir} disabled={excluindo} style={{ padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindo ? "not-allowed" : "pointer", opacity: excluindo ? 0.6 : 1 }}>
                            {excluindo ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </div>

                {erro && (
                    <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erro}</div>
                )}

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
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>{registrado ? "Editar Saúde Mental" : "Registrar Saúde Mental"}</h2>

            {erro && (
                <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erro}</div>
            )}

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
                <button onClick={salvar} disabled={salvando} style={btnPrimary(salvando)}>{salvando ? "Salvando..." : registrado ? "Salvar Alterações" : "Registrar Saúde Mental"}</button>
            </div>
        </div>
    );
}
