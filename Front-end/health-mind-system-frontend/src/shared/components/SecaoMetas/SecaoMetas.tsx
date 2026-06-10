import { CSSProperties, useMemo, useState } from "react";
import { StatusMetaTerapeuticaEnum } from "../../domain/enums/status-meta-terapeutica.enum";
import { StatusSessaoEnum } from "../../domain/enums/status-sessao.enum";
import { HistoricoMedicoDTO } from "../../types/dtos/HistoricoMedico.dto";
import { MetaTerapeuticaDTO } from "../../types/dtos/MetaTerapeutica.dto";
import { SessaoDTO } from "../../types/dtos/Sessao.dto";

type MetaForm = {
  titulo: string;
  statusMetaTerapeutica: StatusMetaTerapeuticaEnum;
  observacoes: string;
};

const DEFAULT_EMPTY_META: MetaForm = {
  titulo: "",
  statusMetaTerapeutica: StatusMetaTerapeuticaEnum.stsNaoIniciada,
  observacoes: "",
};

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

const STATUS_META_LABEL: Record<number, { label: string; bg: string; color: string }> = {
  [StatusMetaTerapeuticaEnum.stsNone]: { label: "Indefinida", bg: "#f0f0f0", color: "#888" },
  [StatusMetaTerapeuticaEnum.stsNaoIniciada]: { label: "Não iniciada", bg: "#f0f0f0", color: "#888" },
  [StatusMetaTerapeuticaEnum.stsEmAndamento]: { label: "Em andamento", bg: "#EBF3FF", color: "#1A4FA3" },
  [StatusMetaTerapeuticaEnum.stsAlcancada]: { label: "Alcançada", bg: "#E8F5EE", color: "#2A8A55" },
};


function btnPrimary(disabled = false) {
  return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}

function btnGray() {
  return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "#555", cursor: "pointer" };
}

export default function SecaoMetas({
  historico,
  temProntuario,
  sessoes,
  onSalvarMeta,
  emptyMeta = DEFAULT_EMPTY_META,
  labelMini = DEFAULT_LABEL_MINI,
  inputStyle = DEFAULT_INPUT_STYLE,
  textAreaStyle = DEFAULT_TEXTAREA_STYLE,
}: {
  historico: HistoricoMedicoDTO | null;
  temProntuario: boolean;
  sessoes: SessaoDTO[];
  onSalvarMeta: (meta: MetaTerapeuticaDTO) => Promise<void>;
  emptyMeta?: MetaForm;
  labelMini?: CSSProperties;
  inputStyle?: CSSProperties;
  textAreaStyle?: CSSProperties;
}) {
  const metas = historico?.metasTerapeuticasDTO ?? [];
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [form, setForm] = useState({ ...emptyMeta });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // O paciente precisa ter ao menos uma sessão agendada (não cancelada) para registrar metas.
  const temSessaoAgendada = useMemo(
    () => sessoes.some(s => s.statusSessao !== StatusSessaoEnum.stsCancelada),
    [sessoes]
  );

  function abrirNova() {
    setEditandoId(null);
    setForm({ ...emptyMeta });
    setMostrarNova(true);
  }
  function abrirEdicao(meta: MetaTerapeuticaDTO) {
    setMostrarNova(false);
    setForm({ titulo: meta.titulo, statusMetaTerapeutica: meta.statusMetaTerapeutica, observacoes: meta.observacoes ?? "" });
    setEditandoId(meta.id);
  }
  function cancelar() {
    setEditandoId(null);
    setMostrarNova(false);
    setForm({ ...emptyMeta });
  }

  async function salvar() {
    if (!form.titulo.trim()) return;
    const meta: MetaTerapeuticaDTO = {
      id: editandoId ?? "",
      historicoMedicoId: historico?.id ?? "",
      titulo: form.titulo.trim(),
      statusMetaTerapeutica: form.statusMetaTerapeutica,
      observacoes: form.observacoes.trim(),
    };

    try {
      setSalvando(true);
      setErro(null);
      await onSalvarMeta(meta);
      cancelar();
    } catch {
      setErro("Não foi possível salvar a meta.");
    } finally {
      setSalvando(false);
    }
  }

  const FormMeta = (
    <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={labelMini}>Título da Meta *</label>
        <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Descreva o objetivo terapêutico..." style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "220px" }}>
        <label style={labelMini}>Status</label>
        <select value={form.statusMetaTerapeutica} onChange={e => setForm(f => ({ ...f, statusMetaTerapeutica: Number(e.target.value) }))} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value={StatusMetaTerapeuticaEnum.stsNaoIniciada}>Não iniciada</option>
          <option value={StatusMetaTerapeuticaEnum.stsEmAndamento}>Em andamento</option>
          <option value={StatusMetaTerapeuticaEnum.stsAlcancada}>Alcançada</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={labelMini}>Observações</label>
        <textarea value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Anotações sobre a meta (opcional)..." style={{ ...textAreaStyle, minHeight: "70px" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={cancelar} disabled={salvando} style={btnGray()}>Cancelar</button>
        <button onClick={salvar} disabled={salvando || !form.titulo.trim()} style={btnPrimary(salvando || !form.titulo.trim())}>{salvando ? "Salvando..." : "Salvar"}</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Metas Terapêuticas</h2>
        <button
          onClick={abrirNova}
          disabled={!temSessaoAgendada}
          title={temSessaoAgendada ? undefined : "O paciente precisa ter ao menos uma sessão agendada para registrar metas."}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: temSessaoAgendada ? "pointer" : "not-allowed", opacity: temSessaoAgendada ? 1 : 0.5 }}
        >
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Nova Meta
        </button>
      </div>

      {erro && (
        <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erro}</div>
      )}

      {mostrarNova && FormMeta}

      {metas.length === 0 && !mostrarNova && (
        <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#bbb", fontSize: "14px" }}>Nenhuma meta terapêutica registrada ainda.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {metas.map(meta => {
          const cfg = STATUS_META_LABEL[meta.statusMetaTerapeutica] ?? STATUS_META_LABEL[StatusMetaTerapeuticaEnum.stsNone];
          return (
            <div key={meta.id}>
              {editandoId === meta.id ? FormMeta : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", border: "1px solid #eef0f6", borderRadius: "12px", padding: "13px 16px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: cfg.color, flexShrink: 0, marginTop: "4px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{meta.titulo}</span>
                      <span style={{ fontSize: "11px", fontWeight: "600", borderRadius: "20px", padding: "2px 10px", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>{cfg.label}</span>
                    </div>
                    {meta.observacoes && <p style={{ fontSize: "12px", color: "#777", margin: "4px 0 0", lineHeight: "1.5" }}>{meta.observacoes}</p>}
                  </div>
                  <button onClick={() => abrirEdicao(meta)} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #dde3f0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}>
                    Editar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}