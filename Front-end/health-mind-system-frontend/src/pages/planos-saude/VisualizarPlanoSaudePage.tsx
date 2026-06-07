import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import {
  atualizarCoberturaPlano,
  atualizarPlanoSaude,
  getAllPlanosSaude,
  registrarCoberturaPlano,
  removerCoberturaPlano,
} from "../../shared/services/plano-saude.service";
import { StatusPlanoSaudeEnum } from "../../shared/domain/enums/status-plano-saude.enum";
import { PlanoSaudeDTO } from "../../shared/types/dtos/PlanoSaude.dto";
import { CoberturaPlanoDTO } from "../../shared/types/dtos/CoberturaPlano.dto";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { formatPhone } from "../../shared/utils/formatPhone";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

type ConfirmAction =
  | { kind: "update-plano" }
  | { kind: "update-cobertura"; especialidadeOriginal: string }
  | { kind: "delete-cobertura"; especialidade: string };

function statusPlanoLabel(status: StatusPlanoSaudeEnum): string {
  const labels: Record<number, string> = {
    [StatusPlanoSaudeEnum.stsNone]: "Indefinido",
    [StatusPlanoSaudeEnum.stsAtivo]: "Ativo",
    [StatusPlanoSaudeEnum.stsInativo]: "Inativo",
  };

  return labels[status] ?? "Indefinido";
}

const inputStyle: CSSProperties = {
  height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "13px", outline: "none",
  boxSizing: "border-box", width: "100%", fontFamily: "inherit", color: "#333", background: "white",
};

const labelStyle: CSSProperties = {
  display: "flex", flexDirection: "column", gap: "5px",
  fontSize: "12px", fontWeight: "600", color: "#222",
};

function btnPrimary(disabled = false): CSSProperties {
  return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}
function btnGray(): CSSProperties {
  return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" };
}
const btnEditar: CSSProperties = { padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" };
const btnExcluir: CSSProperties = { padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: "pointer" };

function InfoField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{value}</span>
    </div>
  );
}

type PlanoForm = { nome: string; codigo: string; telefone: string; email: string; statusPlanoSaude: StatusPlanoSaudeEnum };
type CoberturaForm = { especialidade: string; percentualCobertura: string; valorMaximoCobertura: string };

export default function VisualizarPlanoSaudePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plano, setPlano] = useState<PlanoSaudeDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edição do plano
  const [editandoPlano, setEditandoPlano] = useState(false);
  const [planoForm, setPlanoForm] = useState<PlanoForm | null>(null);
  const [salvandoPlano, setSalvandoPlano] = useState(false);
  const [erroPlano, setErroPlano] = useState<string | null>(null);

  // Edição de coberturas
  const [coberturaEditando, setCoberturaEditando] = useState<string | null>(null);
  const [coberturaForm, setCoberturaForm] = useState<CoberturaForm | null>(null);
  const [salvandoCobertura, setSalvandoCobertura] = useState(false);
  const [erroCobertura, setErroCobertura] = useState<string | null>(null);

  // Registro de cobertura
  const [registrandoCobertura, setRegistrandoCobertura] = useState(false);
  const [novaCoberturaForm, setNovaCoberturaForm] = useState<CoberturaForm | null>(null);
  const [salvandoNovaCobertura, setSalvandoNovaCobertura] = useState(false);
  const [erroNovaCobertura, setErroNovaCobertura] = useState<string | null>(null);

  // Confirmação (PUT/DELETE) e mensagens de status
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [excluindoCobertura, setExcluindoCobertura] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const carregar = useCallback(async () => {
    if (!id) {
      setError("Plano de saúde não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dados = await getAllPlanosSaude();
      const encontrado = dados.find(item => item.id === id) ?? null;
      setPlano(encontrado);

      if (!encontrado) {
        setError("Plano de saúde não encontrado.");
      }
    } catch {
      setError("Não foi possível carregar o plano de saúde.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirEdicaoPlano() {
    if (!plano) return;
    setPlanoForm({
      nome: plano.nome,
      codigo: plano.codigo,
      telefone: plano.telefone,
      email: plano.email,
      statusPlanoSaude: plano.statusPlanoSaude,
    });
    setErroPlano(null);
    setEditandoPlano(true);
  }

  function solicitarSalvarPlano() {
    if (!plano?.id || !planoForm) return;
    if (!planoForm.nome.trim() || !planoForm.codigo.trim()) {
      setErroPlano("Nome e código são obrigatórios.");
      return;
    }
    setErroPlano(null);
    setConfirmAction({ kind: "update-plano" });
  }

  async function salvarPlano() {
    if (!plano?.id || !planoForm) return;
    try {
      setSalvandoPlano(true);
      setErroPlano(null);
      await atualizarPlanoSaude(plano.id, {
        id: plano.id,
        nome: planoForm.nome.trim(),
        codigo: planoForm.codigo.trim(),
        telefone: planoForm.telefone.trim(),
        email: planoForm.email.trim(),
        statusPlanoSaude: Number(planoForm.statusPlanoSaude),
        coberturasPlanoDTO: plano.coberturasPlanoDTO ?? [],
      });
      setEditandoPlano(false);
      setConfirmAction(null);
      await carregar();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSalvandoPlano(false);
    }
  }

  function abrirEdicaoCobertura(cobertura: CoberturaPlanoDTO) {
    setCoberturaEditando(cobertura.especialidade);
    setCoberturaForm({
      especialidade: cobertura.especialidade,
      percentualCobertura: String(cobertura.percentualCobertura ?? ""),
      valorMaximoCobertura: String(cobertura.valorMaximoCobertura ?? ""),
    });
    setErroCobertura(null);
  }

  function cancelarEdicaoCobertura() {
    setCoberturaEditando(null);
    setCoberturaForm(null);
    setErroCobertura(null);
  }

  function solicitarSalvarCobertura(especialidadeOriginal: string) {
    if (!plano?.id || !coberturaForm) return;
    if (!coberturaForm.especialidade.trim()) {
      setErroCobertura("A especialidade é obrigatória.");
      return;
    }
    setErroCobertura(null);
    setConfirmAction({ kind: "update-cobertura", especialidadeOriginal });
  }

  async function salvarCobertura(especialidadeOriginal: string) {
    if (!plano?.id || !coberturaForm) return;
    try {
      setSalvandoCobertura(true);
      setErroCobertura(null);
      await atualizarCoberturaPlano(plano.id, especialidadeOriginal, {
        especialidade: coberturaForm.especialidade.trim(),
        percentualCobertura: Number(coberturaForm.percentualCobertura) || 0,
        valorMaximoCobertura: Number(coberturaForm.valorMaximoCobertura) || 0,
      });
      cancelarEdicaoCobertura();
      setConfirmAction(null);
      await carregar();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSalvandoCobertura(false);
    }
  }

  async function excluirCobertura(especialidade: string) {
    if (!plano?.id) return;
    try {
      setExcluindoCobertura(true);
      await removerCoberturaPlano(plano.id, especialidade);
      setConfirmAction(null);
      await carregar();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoCobertura(false);
    }
  }

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.kind === "update-plano") {
      salvarPlano();
    } else if (confirmAction.kind === "update-cobertura") {
      salvarCobertura(confirmAction.especialidadeOriginal);
    } else {
      excluirCobertura(confirmAction.especialidade);
    }
  }

  function abrirRegistroCobertura() {
    cancelarEdicaoCobertura();
    setNovaCoberturaForm({ especialidade: "", percentualCobertura: "", valorMaximoCobertura: "" });
    setErroNovaCobertura(null);
    setRegistrandoCobertura(true);
  }

  function cancelarRegistroCobertura() {
    setRegistrandoCobertura(false);
    setNovaCoberturaForm(null);
    setErroNovaCobertura(null);
  }

  async function registrarCobertura() {
    if (!plano?.id || !novaCoberturaForm) return;
    if (!novaCoberturaForm.especialidade.trim()) {
      setErroNovaCobertura("A especialidade é obrigatória.");
      return;
    }
    try {
      setSalvandoNovaCobertura(true);
      setErroNovaCobertura(null);
      await registrarCoberturaPlano(plano.id, {
        especialidade: novaCoberturaForm.especialidade.trim(),
        percentualCobertura: Number(novaCoberturaForm.percentualCobertura) || 0,
        valorMaximoCobertura: Number(novaCoberturaForm.valorMaximoCobertura) || 0,
      });
      cancelarRegistroCobertura();
      await carregar();
    } catch {
      setErroNovaCobertura("Não foi possível registrar a cobertura.");
    } finally {
      setSalvandoNovaCobertura(false);
    }
  }

  if (loading) {
    return (
      <AppLayout breadcrumb="Planos de Saúde > Visualizar">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando plano de saúde...</div>
      </AppLayout>
    );
  }

  if (error || !plano) {
    return (
      <AppLayout breadcrumb="Planos de Saúde > Visualizar">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          {error ?? "Plano de saúde não encontrado."}
          <br />
          <button onClick={() => navigate("/planos-saude")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  const ativo = plano.statusPlanoSaude === StatusPlanoSaudeEnum.stsAtivo;
  const coberturas = plano.coberturasPlanoDTO ?? [];

  return (
    <AppLayout breadcrumb="Planos de Saúde > Visualizar">
      {confirmAction && (
        <ModalConfirm
          actionType={confirmAction.kind === "delete-cobertura" ? "delete" : "update"}
          message={
            confirmAction.kind === "delete-cobertura"
              ? `Deseja realmente excluir a cobertura "${confirmAction.especialidade}"? Esta ação não poderá ser desfeita.`
              : confirmAction.kind === "update-plano"
                ? "Tem certeza que deseja salvar as alterações deste plano de saúde?"
                : "Tem certeza que deseja salvar as alterações desta cobertura?"
          }
          loading={
            confirmAction.kind === "delete-cobertura"
              ? excluindoCobertura
              : confirmAction.kind === "update-plano"
                ? salvandoPlano
                : salvandoCobertura
          }
          onConfirm={handleConfirm}
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

      <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => navigate("/planos-saude")} style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}>‹ Voltar</button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>{plano.nome}</h1>
          <span style={{
            fontSize: "12px", fontWeight: "600", borderRadius: "20px", padding: "3px 12px",
            background: ativo ? "#E8F5EE" : "#FFF0F0",
            color: ativo ? "#2A8A55" : "#B03A2E",
          }}>
            {statusPlanoLabel(plano.statusPlanoSaude)}
          </span>
        </div>

        {/* Informações do Plano */}
        <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Informações do Plano</h2>
            {!editandoPlano && (
              <button onClick={abrirEdicaoPlano} style={btnEditar}>Editar</button>
            )}
          </div>

          {editandoPlano && planoForm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={labelStyle}>
                  Nome *
                  <input value={planoForm.nome} onChange={e => setPlanoForm(f => f && { ...f, nome: e.target.value })} placeholder="Ex: Amil, Unimed..." style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Código *
                  <input value={planoForm.codigo} onChange={e => setPlanoForm(f => f && { ...f, codigo: e.target.value })} placeholder="Ex: ANS 12345" style={inputStyle} />
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={labelStyle}>
                  Telefone
                  <input value={planoForm.telefone} onChange={e => setPlanoForm(f => f && { ...f, telefone: e.target.value })} placeholder="(00) 00000-0000" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  E-mail
                  <input type="email" value={planoForm.email} onChange={e => setPlanoForm(f => f && { ...f, email: e.target.value })} placeholder="contato@plano.com" style={inputStyle} />
                </label>
              </div>
              <label style={{ ...labelStyle, maxWidth: "220px" }}>
                Status
                <select value={planoForm.statusPlanoSaude} onChange={e => setPlanoForm(f => f && { ...f, statusPlanoSaude: Number(e.target.value) })} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value={StatusPlanoSaudeEnum.stsAtivo}>Ativo</option>
                  <option value={StatusPlanoSaudeEnum.stsInativo}>Inativo</option>
                </select>
              </label>

              {erroPlano && (
                <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erroPlano}</div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={() => { setEditandoPlano(false); setErroPlano(null); }} disabled={salvandoPlano} style={btnGray()}>Cancelar</button>
                <button onClick={solicitarSalvarPlano} disabled={salvandoPlano} style={btnPrimary(salvandoPlano)}>{salvandoPlano ? "Salvando..." : "Salvar Alterações"}</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px 20px" }}>
              <InfoField label="Nome" value={plano.nome} />
              <InfoField label="Código" value={plano.codigo || "—"} />
              <InfoField label="Status" value={statusPlanoLabel(plano.statusPlanoSaude)} />
              <InfoField label="Telefone" value={plano.telefone ? formatPhone(plano.telefone) : "—"} />
              <InfoField label="E-mail" value={plano.email || "—"} />
            </div>
          )}
        </div>

        {/* Coberturas */}
        <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>
              Coberturas {coberturas.length > 0 && <span style={{ fontSize: "13px", color: "#888", fontWeight: "500" }}>({coberturas.length})</span>}
            </h2>
            {!registrandoCobertura && (
              <button onClick={abrirRegistroCobertura} style={btnPrimary()}>+ Registrar Cobertura</button>
            )}
          </div>

          {erroCobertura && !coberturaEditando && (
            <div style={{ marginBottom: "12px", padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erroCobertura}</div>
          )}

          {registrandoCobertura && novaCoberturaForm && (
            <div style={{ border: "1px solid #c8d6f0", borderRadius: "12px", padding: "16px 18px", background: "#f5f8ff", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1A4FA3", margin: 0 }}>Nova Cobertura</h3>
              <label style={labelStyle}>
                Especialidade
                <input value={novaCoberturaForm.especialidade} onChange={e => setNovaCoberturaForm(f => f && { ...f, especialidade: e.target.value })} placeholder="Ex: Psicologia Clínica" style={inputStyle} disabled />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={labelStyle}>
                  Percentual (%)
                  <input type="number" min="0" max="100" step="1" value={novaCoberturaForm.percentualCobertura} onChange={e => setNovaCoberturaForm(f => f && { ...f, percentualCobertura: e.target.value })} placeholder="0 a 100" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Valor máximo (R$)
                  <input type="number" min="0" step="0.01" value={novaCoberturaForm.valorMaximoCobertura} onChange={e => setNovaCoberturaForm(f => f && { ...f, valorMaximoCobertura: e.target.value })} placeholder="0,00" style={inputStyle} />
                </label>
              </div>

              {erroNovaCobertura && (
                <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erroNovaCobertura}</div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={cancelarRegistroCobertura} disabled={salvandoNovaCobertura} style={btnGray()}>Cancelar</button>
                <button onClick={registrarCobertura} disabled={salvandoNovaCobertura} style={btnPrimary(salvandoNovaCobertura)}>{salvandoNovaCobertura ? "Registrando..." : "Registrar"}</button>
              </div>
            </div>
          )}

          {coberturas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "14px" }}>
              Nenhuma cobertura cadastrada para este plano.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {coberturas.map((cobertura, index) => {
                const emEdicao = coberturaEditando === cobertura.especialidade;

                if (emEdicao && coberturaForm) {
                  return (
                    <div key={index} style={{ border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", background: "#fbfcff", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label style={labelStyle}>
                        Especialidade
                        <input value={coberturaForm.especialidade} onChange={e => setCoberturaForm(f => f && { ...f, especialidade: e.target.value })} placeholder="Ex: Psicologia Clínica" style={inputStyle} />
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <label style={labelStyle}>
                          Percentual (%)
                          <input type="number" min="0" max="100" step="1" value={coberturaForm.percentualCobertura} onChange={e => setCoberturaForm(f => f && { ...f, percentualCobertura: e.target.value })} placeholder="0 a 100" style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                          Valor máximo (R$)
                          <input type="number" min="0" step="0.01" value={coberturaForm.valorMaximoCobertura} onChange={e => setCoberturaForm(f => f && { ...f, valorMaximoCobertura: e.target.value })} placeholder="0,00" style={inputStyle} />
                        </label>
                      </div>

                      {erroCobertura && (
                        <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>{erroCobertura}</div>
                      )}

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button onClick={cancelarEdicaoCobertura} disabled={salvandoCobertura} style={btnGray()}>Cancelar</button>
                        <button onClick={() => solicitarSalvarCobertura(cobertura.especialidade)} disabled={salvandoCobertura} style={btnPrimary(salvandoCobertura)}>{salvandoCobertura ? "Salvando..." : "Salvar"}</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "16px", alignItems: "center", border: "1px solid #eef0f6", borderRadius: "12px", padding: "14px 18px" }}>
                    <InfoField label="Especialidade" value={cobertura.especialidade || "—"} />
                    <InfoField label="Cobertura" value={`${cobertura.percentualCobertura}%`} />
                    <InfoField label="Valor máximo" value={formatCurrency(cobertura.valorMaximoCobertura)} />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => abrirEdicaoCobertura(cobertura)} style={btnEditar}>Editar</button>
                      <button onClick={() => setConfirmAction({ kind: "delete-cobertura", especialidade: cobertura.especialidade })} style={btnExcluir}>Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
