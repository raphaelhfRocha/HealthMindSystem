import React, { useState } from "react";
import { PagamentoDTO } from "../../types/dtos/Pagamento.dto";
import { toDateInput } from "../../utils/dateUtils";
import { StatusParceladoEnum } from "../../domain/enums/status-parcelado.enum";
import { StatusPagamentoEnum } from "../../domain/enums/status-pagamento.enum";
import { StatusFormaPagamentoEnum } from "../../domain/enums/status-forma-pagamento.enum";
import { formatBRL } from "../../utils/formatBRL";

interface ModalEditarPagamentoProps {
  pacienteNome: string;
  pagamento?: PagamentoDTO;
  saving: boolean;
  error: string | null;
  onSave: (pagamento: PagamentoDTO) => void;
  onClose: () => void;
};

const pagInputStyle = {
    height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 12px", fontSize: "13px", outline: "none",
    boxSizing: "border-box" as const, width: "100%", fontFamily: "inherit", color: "#333", background: "white",
};

const pagLabelStyle = {
    display: "flex", flexDirection: "column" as const, gap: "5px",
    fontSize: "12px", fontWeight: "600" as const, color: "#222",
};

export default function ModalEditarPagamento({ pacienteNome, pagamento, saving, error, onSave, onClose }: ModalEditarPagamentoProps) {
    const [valorConsultaFinal, setValorConsultaFinal] = useState(String(pagamento?.valorConsultaFinal ?? ""));
    const [valorCoberturaPlano, setValorCoberturaPlano] = useState(String(pagamento?.valorCoberturaPlano ?? ""));
    const [statusPagamento, setStatusPagamento] = useState<StatusPagamentoEnum>(pagamento?.statusPagamento ?? StatusPagamentoEnum.stsPendente);
    const [statusFormaPagamento, setStatusFormaPagamento] = useState<StatusFormaPagamentoEnum>(pagamento?.statusFormaPagamento ?? StatusFormaPagamentoEnum.stsNone);
    const [statusParcelado, setStatusParcelado] = useState<StatusParceladoEnum>(pagamento?.statusParcelado ?? StatusParceladoEnum.stsNao);
    const [totalParcelas, setTotalParcelas] = useState(String(pagamento?.totalParcelas ?? ""));
    const [dataPagamento, setDataPagamento] = useState(toDateInput(pagamento?.dataPagamento) || toDateInput(new Date()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...pagamento,
            valorConsultaFinal: Number(valorConsultaFinal) || 0,
            valorCoberturaPlano: Number(valorCoberturaPlano) || 0,
            statusPagamento,
            statusFormaPagamento,
            statusParcelado,
            totalParcelas: statusParcelado === StatusParceladoEnum.stsSim ? (Number(totalParcelas) || 0) : 0,
            dataPagamento: statusPagamento === StatusPagamentoEnum.stsIsento ? new Date(0) :
                new Date(`${dataPagamento}T00:00:00`),
        });
    };
    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
            onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
        >
            <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "480px", maxWidth: "92vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Editar Pagamento</h2>
                    <button type="button" onClick={onClose} disabled={saving} style={{ background: "none", border: "none", cursor: saving ? "not-allowed" : "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
                </div>

                <div style={{ fontSize: "13px", color: "#555", background: "#f9fafc", borderRadius: "10px", padding: "10px 14px" }}>
                    <strong style={{ color: "#222" }}>Paciente:</strong> {pacienteNome}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label style={pagLabelStyle}>
                        Valor Consulta
                        <input
                            type="text"
                            min="0"
                            step="0.01"
                            value={`R$${formatBRL(valorConsultaFinal)}`}
                            onChange={e =>
                                setValorConsultaFinal(e.target.value)
                            }
                            style={pagInputStyle}
                            disabled />
                    </label>
                    <label style={pagLabelStyle}>
                        Status
                        <select value={statusPagamento} onChange={e => setStatusPagamento(Number(e.target.value))} style={pagInputStyle}>
                            <option value={StatusPagamentoEnum.stsPendente}>Pendente</option>
                            <option value={StatusPagamentoEnum.stsPago}>Pago</option>
                            <option value={StatusPagamentoEnum.stsIsento}>Isento</option>
                        </select>
                    </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label style={pagLabelStyle}>
                        Forma de pagamento
                        <select value={statusFormaPagamento} onChange={e => setStatusFormaPagamento(Number(e.target.value))} style={pagInputStyle}>
                            <option value={StatusFormaPagamentoEnum.stsNone}>Não informada</option>
                            <option value={StatusFormaPagamentoEnum.stsDinheiro}>Dinheiro</option>
                            <option value={StatusFormaPagamentoEnum.stsCartaoDebito}>Cartão de débito</option>
                            <option value={StatusFormaPagamentoEnum.stsCartaoCredito}>Cartão de crédito</option>
                            <option value={StatusFormaPagamentoEnum.stsPix}>Pix</option>
                        </select>
                    </label>
                    <label style={pagLabelStyle}>
                        Parcelado
                        <select value={statusParcelado} onChange={e => setStatusParcelado(Number(e.target.value))} style={pagInputStyle}>
                            <option value={StatusParceladoEnum.stsNone} hidden></option>
                            <option value={StatusParceladoEnum.stsNao}>Não</option>
                            <option value={StatusParceladoEnum.stsSim}>Sim</option>
                        </select>
                    </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {statusParcelado === StatusParceladoEnum.stsSim && (
                        <label style={pagLabelStyle}>
                            Total de parcelas
                            <input type="number" min="1" step="1" value={totalParcelas} onChange={e => setTotalParcelas(e.target.value)} style={pagInputStyle} />
                        </label>
                    )}
                    <label style={pagLabelStyle}>
                        Data do pagamento
                        <input type="date" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} style={pagInputStyle} />
                    </label>
                </div>


                {error && (
                    <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
                    <button type="button" onClick={onClose} disabled={saving} style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: saving ? "not-allowed" : "pointer" }}>
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                        {saving ? "Salvando..." : "Salvar Pagamento"}
                    </button>
                </div>
            </form>
        </div>
    );
}