import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPacientes } from "../../shared/services/paciente.service";
import { getAllPsicologos, getDisponibilidadesByPsicologoId } from "../../shared/services/psicologo.service";
import { alterarSessao, excluirSessao, getAllSessoes } from "../../shared/services/sessao.service";
import { extractDateKey, formatDateLabel, formatTimeLabel, isDisponibilidadeFutura, sortSessoesByDateAndTime } from "../../shared/utils/sessao";
import { StatusSessaoEnum } from "../../shared/domain/enums/status-sessao.enum";
import { StatusTipoAtendimentoEnum } from "../../shared/domain/enums/status-tipo-atendimento.enum";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { DisponibilidadeDTO } from "../../shared/types/dtos/Disponibilidade.dto";
import { StatusDisponibilidadeEnum } from "../../shared/domain/enums/status-disponibilidade.enum";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";
import { useAuth } from "../../shared/context/AuthContext";
import { usePermissions } from "../../shared/hooks/usePermissions";
import { findPsicologoByEmail } from "../../shared/hooks/useCurrentPsicologo";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

function statusSessaoLabel(status: StatusSessaoEnum): string {
  const labels: Record<number, string> = {
    [StatusSessaoEnum.stsNone]: "Nenhum",
    [StatusSessaoEnum.stsRealizada]: "Realizada",
    [StatusSessaoEnum.stsPendente]: "Pendente",
    [StatusSessaoEnum.stsCancelada]: "Cancelada",
  };

  return labels[status] ?? "Pendente";
}

function tipoAtendimentoLabel(tipo: StatusTipoAtendimentoEnum): string {
  const labels: Record<number, string> = {
    [StatusTipoAtendimentoEnum.stsNone]: "Não informado",
    [StatusTipoAtendimentoEnum.stsPresencial]: "Presencial",
    [StatusTipoAtendimentoEnum.stsOnline]: "Online",
  };

  return labels[tipo] ?? "Presencial";
}

interface ModalEditarSessaoProps {
  sessao: SessaoDTO;
  pacienteNome: string;
  psicologoNome: string;
  saving: boolean;
  error: string | null;
  onSave: (dados: { dataSessao: string; horaInicio: string; statusTipoAtendimento: StatusTipoAtendimentoEnum; statusSessao: StatusSessaoEnum }) => void;
  onClose: () => void;
}

function formatDisponibilidade(disponibilidade: DisponibilidadeDTO): string {
  const dataLabel = formatDateLabel(extractDateKey(disponibilidade.dataDisponibilidade));
  const horaLabel = formatTimeLabel(disponibilidade.horaInicio);

  return `${dataLabel} • ${horaLabel} (${tipoAtendimentoLabel(disponibilidade.statusTipoAtendimento)})`;
}

function ModalEditarSessao({ sessao, pacienteNome, psicologoNome, saving, error, onSave, onClose }: ModalEditarSessaoProps) {
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeDTO[]>([]);
  const [disponibilidadeId, setDisponibilidadeId] = useState("");
  const [carregandoDisponibilidades, setCarregandoDisponibilidades] = useState(false);
  const [statusSessao, setStatusSessao] = useState<StatusSessaoEnum>(sessao.statusSessao);

  const inputStyle = {
    height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 12px", fontSize: "13px", outline: "none",
    boxSizing: "border-box" as const, width: "100%", fontFamily: "inherit", color: "#333", background: "white",
  };

  // Carrega as disponibilidades do psicólogo responsável pela sessão.
  useEffect(() => {
    if (!sessao.psicologoId) {
      return;
    }

    let isActive = true;
    setCarregandoDisponibilidades(true);

    getDisponibilidadesByPsicologoId(sessao.psicologoId)
      .then(dados => {
        if (isActive) {
          setDisponibilidades(dados);
        }
      })
      .catch(() => {
        if (isActive) {
          setDisponibilidades([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setCarregandoDisponibilidades(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [sessao.psicologoId]);

  const disponibilidadesDisponiveis = useMemo(
    () => disponibilidades.filter(item =>
      item.statusDisponibilidade === StatusDisponibilidadeEnum.stsDisponivel &&
      isDisponibilidadeFutura(item)
    ),
    [disponibilidades]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selecionada = disponibilidadesDisponiveis.find(item => item.id === disponibilidadeId);

    onSave({
      dataSessao: selecionada ? extractDateKey(selecionada.dataDisponibilidade) : extractDateKey(sessao.dataSessao),
      horaInicio: selecionada ? selecionada.horaInicio : sessao.horaInicio,
      statusTipoAtendimento: selecionada ? selecionada.statusTipoAtendimento : sessao.statusTipoAtendimento,
      statusSessao,
    });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "440px", maxWidth: "90vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Reagendar Sessão</h2>
          <button type="button" onClick={onClose} disabled={saving} style={{ background: "none", border: "none", cursor: saving ? "not-allowed" : "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        <div style={{ fontSize: "13px", color: "#555", background: "#f9fafc", borderRadius: "10px", padding: "10px 14px" }}>
          <div><strong style={{ color: "#222" }}>Paciente:</strong> {pacienteNome}</div>
          <div><strong style={{ color: "#222" }}>Psicólogo:</strong> {psicologoNome}</div>
          <div>
            <strong style={{ color: "#222" }}>Agendamento atual:</strong>{" "}
            {formatDateLabel(extractDateKey(sessao.dataSessao))} • {formatTimeLabel(sessao.horaInicio)} ({tipoAtendimentoLabel(sessao.statusTipoAtendimento)})
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", fontWeight: "600", color: "#222" }}>
          Nova Disponibilidade
          <select
            value={disponibilidadeId}
            onChange={e => setDisponibilidadeId(e.target.value)}
            style={inputStyle}
            disabled={carregandoDisponibilidades}
          >
            <option value="">
              {carregandoDisponibilidades
                ? "Carregando..."
                : disponibilidadesDisponiveis.length === 0
                  ? "Nenhuma disponibilidade" : ""}
            </option>
            {disponibilidadesDisponiveis.map(d => (
              <option key={d.id} value={d.id}>{formatDisponibilidade(d)}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", fontWeight: "600", color: "#222" }}>
          Status
          <select value={statusSessao} onChange={e => setStatusSessao(Number(e.target.value))} style={inputStyle}>
            <option value={StatusSessaoEnum.stsPendente}>Pendente</option>
            <option value={StatusSessaoEnum.stsRealizada}>Realizada</option>
            <option value={StatusSessaoEnum.stsCancelada}>Cancelada</option>
          </select>
        </label>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button type="button" onClick={onClose} disabled={saving} style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: saving ? "not-allowed" : "pointer" }}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || disponibilidadesDisponiveis.length === 0}
            style={{
              padding: "9px 20px", background: "#1A4FA3",
              border: "none", borderRadius: "12px", fontSize: "13px",
              fontWeight: "600", color: "white",
              cursor: saving || disponibilidadesDisponiveis.length === 0 ?
                "not-allowed" : "pointer", opacity: saving || disponibilidadesDisponiveis.length === 0 ? 0.6 : 1
            }}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AgendaDoDiaPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPsicologo } = usePermissions();

  const [sessoes, setSessoes] = useState<SessaoDTO[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const [sessaoEmEdicao, setSessaoEmEdicao] = useState<SessaoDTO | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<SessaoDTO | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarDados() {
      try {
        setLoading(true);
        const [sessoesDados, pacientesDados, psicologosDados] = await Promise.all([
          getAllSessoes(),
          getAllPacientes(),
          getAllPsicologos(),
        ]);

        if (!isActive) {
          return;
        }

        setSessoes(sortSessoesByDateAndTime(sessoesDados));
        setPacientes(pacientesDados);
        setPsicologos(psicologosDados);
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar os agendamentos do dia." });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      isActive = false;
    };
  }, []);

  const dateKey = date ? extractDateKey(date) : "";
  const dateLabel = dateKey ? formatDateLabel(dateKey) : "Data inválida";

  const pacientesPorId = useMemo(() => {
    return new Map(pacientes.filter(paciente => paciente.id).map(paciente => [paciente.id as string, paciente]));
  }, [pacientes]);

  const psicologosPorId = useMemo(() => {
    return new Map(psicologos.filter(psicologo => psicologo.id).map(psicologo => [psicologo.id as string, psicologo]));
  }, [psicologos]);

  // Id do psicólogo logado (quando aplicável), para restringir a agenda.
  const psicologoLogadoId = useMemo(
    () => (isPsicologo ? findPsicologoByEmail(psicologos, user?.email)?.id ?? null : null),
    [isPsicologo, psicologos, user?.email]
  );

  const agendamentos = useMemo(() => {
    if (!dateKey) {
      return [];
    }

    return sessoes.filter(sessao =>
      extractDateKey(sessao.dataSessao) === dateKey &&
      (!isPsicologo || sessao.psicologoId === psicologoLogadoId)
    );
  }, [dateKey, sessoes, isPsicologo, psicologoLogadoId]);

  async function confirmExcluir() {
    const sessaoId = confirmTarget?.id;
    if (!sessaoId) {
      return;
    }

    try {
      setExcluindoId(sessaoId);
      await excluirSessao(sessaoId);
      setSessoes(prev => prev.filter(item => item.id !== sessaoId));
      setConfirmTarget(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.SESSION_CANCELLED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmTarget(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoId(null);
    }
  }

  async function handleSalvarEdicao(dados: { dataSessao: string; horaInicio: string; statusTipoAtendimento: StatusTipoAtendimentoEnum; statusSessao: StatusSessaoEnum }) {
    if (!sessaoEmEdicao?.id) {
      return;
    }

    const sessaoAtualizada: SessaoDTO = {
      ...sessaoEmEdicao,
      dataSessao: dados.dataSessao as unknown as Date,
      horaInicio: dados.horaInicio,
      statusTipoAtendimento: dados.statusTipoAtendimento,
      statusSessao: dados.statusSessao,
    };

    try {
      setSalvandoEdicao(true);
      setErroEdicao(null);
      await alterarSessao(sessaoEmEdicao.id, sessaoAtualizada);
      setSessoes(prev => sortSessoesByDateAndTime(prev.map(item => item.id === sessaoEmEdicao.id ? sessaoAtualizada : item)));
      setSessaoEmEdicao(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      setErroEdicao(parseApiError(err).message);
    } finally {
      setSalvandoEdicao(false);
    }
  }

  return (
    <AppLayout breadcrumb={`Agendamentos > Consultar > ${dateKey || "data"}`}>
      {sessaoEmEdicao && (
        <ModalEditarSessao
          sessao={sessaoEmEdicao}
          pacienteNome={pacientesPorId.get(sessaoEmEdicao.pacienteId)?.nome ?? sessaoEmEdicao.pacienteId}
          psicologoNome={psicologosPorId.get(sessaoEmEdicao.psicologoId)?.nome ?? sessaoEmEdicao.psicologoId}
          saving={salvandoEdicao}
          error={erroEdicao}
          onSave={handleSalvarEdicao}
          onClose={() => { if (!salvandoEdicao) setSessaoEmEdicao(null); }}
        />
      )}

      {confirmTarget && (
        <ModalConfirm
          actionType="delete"
          title="Cancelar sessão"
          message={`Deseja realmente cancelar a sessão de ${pacientesPorId.get(confirmTarget.pacienteId)?.nome ?? "este paciente"} às ${formatTimeLabel(confirmTarget.horaInicio)}? Esta ação não poderá ser desfeita.`}
          confirmLabel="Cancelar sessão"
          cancelLabel="Voltar"
          loading={excluindoId === confirmTarget.id}
          onConfirm={confirmExcluir}
          onClose={() => setConfirmTarget(null)}
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

      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "1.5rem 2rem 2rem",
        width: "100%",
        maxWidth: "680px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/agendamentos/consultar")}
            style={{
              background: "none", border: "1px solid #dde3f0", borderRadius: "8px",
              padding: "6px 12px", cursor: "pointer", fontSize: "14px", color: "#1A4FA3",
              display: "flex", alignItems: "center", gap: "6px", fontWeight: "600",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>
              Agenda do Dia
            </h1>
            <p style={{ fontSize: "13px", color: "#666", margin: "2px 0 0" }}>{dateLabel}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#EBF3FF", borderRadius: "20px", padding: "4px 14px",
            marginBottom: "1.2rem",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1A4FA3" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A4FA3" }}>
              {loading ? "Carregando..." : `${agendamentos.length} ${agendamentos.length === 1 ? "agendamento" : "agendamentos"}`}
            </span>
          </div>
        </div>

        {agendamentos.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem 0", color: "#999", fontSize: "15px",
          }}>
            Nenhum agendamento para este dia.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {agendamentos.map((ag, i) => (
              <div
                key={ag.id ?? i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  border: "1px solid #e8ecf5",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(26,79,163,0.1)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{
                  background: "#1A4FA3",
                  color: "white",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  fontSize: "16px",
                  fontWeight: "700",
                  textAlign: "center",
                  minWidth: "64px",
                  flexShrink: 0,
                }}>
                  {formatTimeLabel(ag.horaInicio)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "3px" }}>
                    {pacientesPorId.get(ag.pacienteId)?.nome ?? ag.pacienteId}
                  </div>
                  <div style={{ fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="2" fill="none" />
                      <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="#999" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                    {psicologosPorId.get(ag.psicologoId)?.nome ?? ag.psicologoId}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                    {tipoAtendimentoLabel(ag.statusTipoAtendimento)}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                  <div style={{
                    background: ag.statusSessao === StatusSessaoEnum.stsCancelada ? "#FFF0F0" : ag.statusSessao === StatusSessaoEnum.stsRealizada ? "#E8F5EE" : "#EBF3FF",
                    color: ag.statusSessao === StatusSessaoEnum.stsCancelada ? "#B03A2E" : ag.statusSessao === StatusSessaoEnum.stsRealizada ? "#2A8A55" : "#1A4FA3",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "20px",
                    padding: "4px 12px",
                  }}>
                    {statusSessaoLabel(ag.statusSessao)}
                  </div>

                  {/* Psicólogo possui acesso somente de consulta. */}
                  {!isPsicologo && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => { setErroEdicao(null); setSessaoEmEdicao(ag); }}
                        title="Reagendar sessão"
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                        onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                      >
                        Reagendar
                      </button>
                      <button
                        onClick={() => setConfirmTarget(ag)}
                        disabled={excluindoId === ag.id}
                        title="Excluir sessão"
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", background: "#FFF0F0", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindoId === ag.id ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: excluindoId === ag.id ? 0.6 : 1 }}
                        onMouseEnter={e => { if (excluindoId !== ag.id) e.currentTarget.style.background = "#ffdede"; }}
                        onMouseLeave={e => e.currentTarget.style.background = "#FFF0F0"}
                      >
                        {excluindoId === ag.id ? "Cancelando..." : "Cancelar"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPsicologo && (
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => navigate(dateKey ? `/agendamentos/realizar?date=${dateKey}` : "/agendamentos/realizar")}
              style={{
                background: "#1A4FA3", border: "none", borderRadius: "20px",
                padding: "10px 24px", color: "white", fontSize: "14px",
                fontWeight: "600", cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              + Novo Agendamento
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}