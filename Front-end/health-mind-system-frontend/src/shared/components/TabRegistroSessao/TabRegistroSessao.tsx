import { useMemo, useState } from "react";
import { SessaoDTO } from "../../types/dtos/Sessao.dto";
import { getAllSessoes, adicionarRegistroSessao, alterarRegistroSessao, excluirRegistroSessao, excluirSessao } from "../../services/sessao.service";
import { formatTimeLabel } from "../../utils/sessao";
import { extractDateKey, formatDateLabel } from "../../utils/dateUtils";
import { formatCurrency } from "../../utils";
import { StatusPagamentoEnum } from "../../domain/enums/status-pagamento.enum";


function btnPrimary(disabled = false) {
    return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}

function btnGray() {
    return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "#555", cursor: "pointer" };
}

function statusPagamentoBadge(status?: StatusPagamentoEnum): { label: string; bg: string; color: string } {
  if (status === StatusPagamentoEnum.stsPago) return { label: "Pago", bg: "#E8F5EE", color: "#2A8A55" };
  if (status === StatusPagamentoEnum.stsNone) return { label: "Isento", bg: "#f0f0f0", color: "#888" };
  return { label: "Pendente", bg: "#FFF8E6", color: "#856404" };
}

export default function TabRegistroSessao({ sessoes, onReload, textAreaStyle }: { sessoes: SessaoDTO[]; onReload: () => Promise<void> }) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [registroDraft, setRegistroDraft] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [excluindoRegistroId, setExcluindoRegistroId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const ordenadas = useMemo(
    () => [...sessoes].sort((a, b) => extractDateKey(b.dataSessao).localeCompare(extractDateKey(a.dataSessao))),
    [sessoes]
  );

  function abrirEdicao(sessao: SessaoDTO) {
    setErro(null);
    setEditandoId(sessao.id ?? null);
    setRegistroDraft(sessao.registrosSessoesDTO?.[0]?.registro ?? "");
  }

  async function salvarRegistro(sessao: SessaoDTO) {
    if (!sessao.id) return;
    const registroExistente = sessao.registrosSessoesDTO?.[0];

    try {
      setSalvando(true);
      setErro(null);
      if (registroExistente?.id) {
        await alterarRegistroSessao(registroExistente.id, sessao.id, { sessaoId: sessao.id, registro: registroDraft });
      } else {
        await adicionarRegistroSessao(sessao.id, { sessaoId: sessao.id, registro: registroDraft });
      }
      setEditandoId(null);
      await onReload();
    } catch {
      setErro("Não foi possível salvar o registro.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerRegistro(sessao: SessaoDTO) {
    const registroExistente = sessao.registrosSessoesDTO?.[0];
    if (!sessao.id || !registroExistente?.id) return;
    if (!window.confirm("Deseja realmente excluir este registro? Esta ação não pode ser desfeita.")) return;

    try {
      setExcluindoRegistroId(sessao.id);
      setErro(null);
      await excluirRegistroSessao(sessao.id, registroExistente.id);
      await onReload();
    } catch {
      setErro("Não foi possível excluir o registro.");
    } finally {
      setExcluindoRegistroId(null);
    }
  }

  async function removerSessao(sessao: SessaoDTO) {
    if (!sessao.id) return;
    if (!window.confirm("Deseja realmente excluir esta sessão? Esta ação não pode ser desfeita.")) return;

    try {
      setExcluindoId(sessao.id);
      setErro(null);
      await excluirSessao(sessao.id);
      await onReload();
    } catch {
      setErro("Não foi possível excluir a sessão.");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Registro de Sessão</h2>

      {erro && (
        <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erro}</div>
      )}


      {ordenadas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem 0", color: "#bbb", fontSize: "14px" }}>
          Nenhuma sessão registrada para este paciente.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ordenadas.map((sessao, index) => {
            const numero = ordenadas.length - index;
            const valor = sessao.pagamentoDTO?.valorConsultaFinal;
            const badge = statusPagamentoBadge(sessao.pagamentoDTO?.statusPagamento);
            const registro = sessao.registrosSessoesDTO?.[0]?.registro;
            const editando = editandoId === sessao.id;

            return (
              <div key={sessao.id ?? index} style={{ border: "1px solid #eef0f6", borderRadius: "12px", padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EBF3FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#1A4FA3", textTransform: "uppercase", lineHeight: 1 }}>Sess.</span>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: "#1A4FA3", lineHeight: 1.2 }}>#{numero}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{formatDateLabel(extractDateKey(sessao.dataSessao))}</span>
                      <span style={{ background: "#f0f4ff", color: "#1A4FA3", fontSize: "11px", fontWeight: "600", borderRadius: "10px", padding: "2px 10px" }}>{formatTimeLabel(sessao.horaInicio)}</span>
                      {valor != null && valor > 0 && (
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#333" }}>{formatCurrency(valor)}</span>
                      )}
                      <span style={{ fontSize: "11px", fontWeight: "600", borderRadius: "10px", padding: "2px 10px", background: badge.bg, color: badge.color }}>{badge.label}</span>
                    </div>

                    {!editando && (
                      registro
                        ? <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{registro}</p>
                        : <p style={{ fontSize: "13px", color: "#bbb", margin: 0, fontStyle: "italic" }}>Sem registro escrito.</p>
                    )}
                  </div>

                  {!editando && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => abrirEdicao(sessao)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "white", border: "1px solid #dde3f0", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {registro ? "Alterar registro" : "Registrar"}
                      </button>
                        <button onClick={() => removerRegistro(sessao)} disabled={excluindoRegistroId === sessao.id} style={{ padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindoRegistroId === sessao.id ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: excluindoRegistroId === sessao.id ? 0.6 : 1 }}>
                          {excluindoRegistroId === sessao.id ? "Excluindo..." : "Excluir registro"}
                        </button>
                    </div>
                  )}
                </div>

                {editando && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <textarea value={registroDraft} onChange={e => setRegistroDraft(e.target.value)} placeholder="Descreva observações, temas abordados, evolução e próximos passos..." style={textAreaStyle} autoFocus />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button onClick={() => setEditandoId(null)} disabled={salvando} style={btnGray()}>Cancelar</button>
                      <button onClick={() => salvarRegistro(sessao)} disabled={salvando} style={btnPrimary(salvando)}>{salvando ? "Salvando..." : "Salvar registro"}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}