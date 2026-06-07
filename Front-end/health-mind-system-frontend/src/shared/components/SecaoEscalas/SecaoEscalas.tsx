import { CSSProperties, useMemo, useState } from "react";
import { EscalaSessaoDTO } from "../../types/dtos/EscalaSessao.dto";
import { SessaoDTO } from "../../types/dtos/Sessao.dto";
import { extractDateKey, formatDate, formatDateLabel } from "../../utils/dateUtils";
import { formatTimeLabel } from "../../utils/sessao";
import { adicionarEscalaSessao, alterarEscalaSessao, excluirEscalaSessao } from "../../services/sessao.service";
import GraficoEscalas from "../GraficoEscalas/GraficoEscalas";
import ModalConfirm from "../ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };
type ConfirmAction = { kind: "update" } | { kind: "delete"; escala: EscalaSessaoDTO };

type EscalaCampo = "humor" | "ansiedade" | "sono" | "funcSocial";
type EscalaSerie = { key: EscalaCampo; label: string; color: string; nota: string };
type EscalaForm = { sessaoId: string; humor: number; ansiedade: number; sono: number; funcSocial: number };

const DEFAULT_SERIES_ESCALAS: EscalaSerie[] = [
  { key: "humor", label: "Humor", color: "#1A4FA3", nota: "" },
  { key: "ansiedade", label: "Ansiedade", color: "#E06B4A", nota: "↑ = pior" },
  { key: "sono", label: "Sono", color: "#3BB077", nota: "" },
  { key: "funcSocial", label: "Func. Social", color: "#7B5EA7", nota: "" },
];

const DEFAULT_EMPTY_ESCALA: EscalaForm = { sessaoId: "", humor: 5, ansiedade: 5, sono: 5, funcSocial: 5 };

const DEFAULT_LABEL_MINI: CSSProperties = {
  fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",
};

const DEFAULT_INPUT_STYLE: CSSProperties = {
  height: "36px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box",
  width: "100%", fontFamily: "inherit", color: "#333",
};


function btnPrimary(disabled = false) {
  return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}

function btnGray() {
  return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "#555", cursor: "pointer" };
}

export default function SecaoEscalas({
  sessoes,
  onReload,
  seriesEscalas = DEFAULT_SERIES_ESCALAS,
  labelMini = DEFAULT_LABEL_MINI,
  inputStyle = DEFAULT_INPUT_STYLE,
  emptyEscala = DEFAULT_EMPTY_ESCALA,
}: {
  sessoes: SessaoDTO[];
  onReload: () => Promise<void>;
  seriesEscalas?: EscalaSerie[];
  labelMini?: CSSProperties;
  inputStyle?: CSSProperties;
  emptyEscala?: EscalaForm;
}) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [form, setForm] = useState({ ...emptyEscala });
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  // Sessões que ainda não tiveram uma escala registrada.
  const sessoesDisponiveis = useMemo(
    () => sessoes.filter(s => (s.escalasSessoesDTO ?? []).length === 0),
    [sessoes]
  );

  // Junta todas as escalas das sessões com o contexto (data e id da sessão).
  const escalas = useMemo(() => {
    const lista: Array<{ escala: EscalaSessaoDTO; dataKey: string }> = [];
    for (const sessao of sessoes) {
      for (const escala of sessao.escalasSessoesDTO ?? []) {
        lista.push({ escala: { ...escala, sessaoId: sessao.id as string }, dataKey: extractDateKey(sessao.dataSessao) });
      }
    }
    return lista.sort((a, b) => a.dataKey.localeCompare(b.dataKey));
  }, [sessoes]);

  const pontos = useMemo(
    () => escalas.map(({ escala, dataKey }) => ({
      label: dataKey ? dataKey.slice(8, 10) + "/" + dataKey.slice(5, 7) : "—",
      humor: escala.humor, ansiedade: escala.ansiedade, sono: escala.sono, funcSocial: escala.funcSocial,
    })),
    [escalas]
  );

  function abrirNova() {
    setEditandoId(null);
    setForm({ ...emptyEscala, sessaoId: sessoesDisponiveis[0]?.id ?? "" });
    setMostrarNova(true);
  }
  function abrirEdicao(escala: EscalaSessaoDTO) {
    setMostrarNova(false);
    setForm({ sessaoId: escala.sessaoId, humor: escala.humor, ansiedade: escala.ansiedade, sono: escala.sono, funcSocial: escala.funcSocial });
    setEditandoId(escala.id ?? null);
  }
  function cancelar() {
    setEditandoId(null);
    setMostrarNova(false);
    setForm({ ...emptyEscala });
  }

  function solicitarSalvar() {
    if (!form.sessaoId) {
      setErro("Selecione a sessão da avaliação.");
      return;
    }
    setErro(null);
    if (editandoId) {
      setConfirmAction({ kind: "update" });
    } else {
      salvar();
    }
  }

  async function salvar() {
    if (!form.sessaoId) {
      setErro("Selecione a sessão da avaliação.");
      return;
    }
    const isEdit = !!editandoId;
    const payload: EscalaSessaoDTO = {
      sessaoId: form.sessaoId,
      humor: Number(form.humor), ansiedade: Number(form.ansiedade), sono: Number(form.sono), funcSocial: Number(form.funcSocial),
    };

    try {
      setSalvando(true);
      setErro(null);
      if (editandoId) {
        await alterarEscalaSessao(editandoId, form.sessaoId, payload);
      } else {
        await adicionarEscalaSessao(form.sessaoId, payload);
      }
      cancelar();
      setConfirmAction(null);
      await onReload();
      setStatus({ type: "success", message: isEdit ? MESSAGES.SUCCESS.UPDATED : MESSAGES.SUCCESS.CREATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSalvando(false);
    }
  }

  async function confirmExcluir() {
    const escala = confirmAction?.kind === "delete" ? confirmAction.escala : null;
    if (!escala?.id || !escala.sessaoId) return;
    try {
      setExcluindoId(escala.id);
      await excluirEscalaSessao(escala.id, escala.sessaoId);
      if (editandoId === escala.id) cancelar();
      setConfirmAction(null);
      await onReload();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoId(null);
    }
  }

  const Slider = ({ field, label, color, nota }: { field: "humor" | "ansiedade" | "sono" | "funcSocial"; label: string; color: string; nota: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ ...labelMini }}>{label}{nota && <span style={{ fontWeight: "400", color: "#E06B4A", marginLeft: "4px" }}>{nota}</span>}</label>
        <span style={{ fontSize: "13px", fontWeight: "800", color }}>{form[field]}</span>
      </div>
      <input type="range" min="1" max="10" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))} style={{ accentColor: color, width: "100%", cursor: "pointer" }} />
    </div>
  );

  const FormEscala = (
    <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "320px" }}>
        <label style={labelMini}>Sessão *</label>
        <select value={form.sessaoId} onChange={e => setForm(f => ({ ...f, sessaoId: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }} disabled={!!editandoId}>
          <option value="">Selecione...</option>
          {(editandoId ? sessoes.filter(s => s.id === form.sessaoId) : sessoesDisponiveis).map(s => (
            <option key={s.id} value={s.id}>{formatDateLabel(extractDateKey(s.dataSessao))} • {formatTimeLabel(s.horaInicio)}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
        {seriesEscalas.map(s => <Slider key={s.key} field={s.key} label={s.label} color={s.color} nota={s.nota} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={cancelar} disabled={salvando} style={btnGray()}>Cancelar</button>
        <button onClick={solicitarSalvar} disabled={salvando} style={btnPrimary(salvando)}>{salvando ? "Salvando..." : "Salvar"}</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      {confirmAction?.kind === "update" && (
        <ModalConfirm
          actionType="update"
          message="Tem certeza que deseja salvar as alterações desta avaliação?"
          loading={salvando}
          onConfirm={salvar}
          onClose={() => setConfirmAction(null)}
        />
      )}
      {confirmAction?.kind === "delete" && (
        <ModalConfirm
          actionType="delete"
          message="Deseja realmente excluir esta avaliação? Esta ação não poderá ser desfeita."
          loading={excluindoId === confirmAction.escala.id}
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 2px" }}>Escalas por Sessão</h2>
        </div>
        <button onClick={abrirNova} disabled={sessoesDisponiveis.length === 0} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: sessoesDisponiveis.length === 0 ? "not-allowed" : "pointer", opacity: sessoesDisponiveis.length === 0 ? 0.5 : 1 }}>
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Adicionar Avaliação
        </button>
      </div>

      {erro && (
        <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erro}</div>
      )}

      {mostrarNova && FormEscala}

      {escalas.length === 0 && !mostrarNova ? (
        <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#bbb", fontSize: "14px" }}>Nenhuma avaliação registrada ainda.</div>
      ) : (
        <>
          {pontos.length > 0 && (
            <div style={{ border: "1px solid #eef0f6", borderRadius: "12px", padding: "14px 10px 6px" }}>
              <GraficoEscalas seriesEscalas={seriesEscalas} pontos={pontos} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", paddingTop: "4px", paddingBottom: "8px" }}>
                {seriesEscalas.map(s => (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "10px", height: "3px", background: s.color, borderRadius: "2px" }} />
                    <span style={{ fontSize: "11px", color: "#666" }}>{s.label}{s.nota && <span style={{ color: "#E06B4A", marginLeft: "3px" }}>{s.nota}</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {escalas.map(({ escala, dataKey }) => (
              <div key={escala.id}>
                {editandoId === escala.id ? FormEscala : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #eef0f6", borderRadius: "12px", padding: "12px 16px" }}>
                    <div style={{ width: "70px", flexShrink: 0, fontSize: "12px", fontWeight: "600", color: "#666" }}>{formatDate(dataKey).split(",")[0] ?? dataKey}</div>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {seriesEscalas.map(s => (
                        <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                          <span style={{ fontSize: "11px", color: "#888" }}>{s.label}:</span>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: s.color }}>{escala[s.key]}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => abrirEdicao(escala)} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #dde3f0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}>
                      Editar
                    </button>
                    <button onClick={() => setConfirmAction({ kind: "delete", escala })} disabled={excluindoId === escala.id} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #f3d0d0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#b03a2e", cursor: excluindoId === escala.id ? "not-allowed" : "pointer", opacity: excluindoId === escala.id ? 0.5 : 1 }}>
                      {excluindoId === escala.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}