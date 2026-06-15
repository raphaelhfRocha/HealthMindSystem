import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPacientes } from "../../shared/services/paciente.service";
import { getAllPsicologos, getDisponibilidadesByPsicologoId } from "../../shared/services/psicologo.service";
import { getAllPlanosSaude } from "../../shared/services/plano-saude.service";
import { agendarSessao } from "../../shared/services/sessao.service";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { DisponibilidadeDTO } from "../../shared/types/dtos/Disponibilidade.dto";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { StatusDisponibilidadeEnum } from "../../shared/domain/enums/status-disponibilidade.enum";
import { StatusSessaoEnum } from "../../shared/domain/enums/status-sessao.enum";
import { StatusTipoAtendimentoEnum } from "../../shared/domain/enums/status-tipo-atendimento.enum";
import { extractDateKey, formatDateLabel, formatTimeLabel, isDisponibilidadeFutura } from "../../shared/utils/sessao";
import { PlanoSaudeDTO } from "../../shared/types/dtos/PlanoSaude.dto";
import { CoberturaPlanoDTO } from "../../shared/types/dtos/CoberturaPlano.dto";
import { PagamentoDTO } from "../../shared/types/dtos/Pagamento.dto";
import { StatusPagamentoEnum } from "../../shared/domain/enums/status-pagamento.enum";
import { StatusFormaPagamentoEnum } from "../../shared/domain/enums/status-forma-pagamento.enum";
import { StatusParceladoEnum } from "../../shared/domain/enums/status-parcelado.enum";
import { formatCurrency } from "../../shared/utils/formatCurrency";

function tipoAtendimentoLabel(tipo: StatusTipoAtendimentoEnum): string {
  const labels: Record<number, string> = {
    [StatusTipoAtendimentoEnum.stsNone]: "Não informado",
    [StatusTipoAtendimentoEnum.stsPresencial]: "Presencial",
    [StatusTipoAtendimentoEnum.stsOnline]: "Online",
  };

  return labels[tipo] ?? "Presencial";
}

function formatDisponibilidade(disponibilidade: DisponibilidadeDTO): string {
  const dataLabel = formatDateLabel(extractDateKey(disponibilidade.dataDisponibilidade));
  const horaLabel = formatTimeLabel(disponibilidade.horaInicio);

  return `${dataLabel} • ${horaLabel} (${tipoAtendimentoLabel(disponibilidade.statusTipoAtendimento)})`;
}

const HORARIOS = Array.from({ length: 27 }, (_, i) => {
  const totalMin = 7 * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}).filter(h => h <= "20:00");

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so week starts on Monday (0=Mon...6=Sun)
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) =>
    d && selectedDate &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const isToday = (d) =>
    d &&
    today.getDate() === d &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  return (
    <div style={{
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "12px",
      width: "260px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      userSelect: "none",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A4FA3", padding: "2px 6px" }}>‹</button>
        <span style={{ fontWeight: "700", fontSize: "14px", color: "#1A4FA3" }}>
          {MESES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A4FA3", padding: "2px 6px" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {DIAS_SEMANA.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "600", color: "#888", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => (
          <div
            key={i}
            onClick={() => d && onSelect(new Date(viewYear, viewMonth, d))}
            style={{
              textAlign: "center",
              fontSize: "12px",
              padding: "5px 2px",
              borderRadius: "6px",
              cursor: d ? "pointer" : "default",
              background: isSelected(d) ? "#1A4FA3" : isToday(d) ? "#e8f0fd" : "transparent",
              color: isSelected(d) ? "white" : isToday(d) ? "#1A4FA3" : d ? "#333" : "transparent",
              fontWeight: isSelected(d) || isToday(d) ? "700" : "400",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => { if (d && !isSelected(d)) e.currentTarget.style.background = "#f0f4ff"; }}
            onMouseLeave={e => { if (d && !isSelected(d)) e.currentTarget.style.background = isToday(d) ? "#e8f0fd" : "transparent"; }}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  height: "38px",
  border: "none",
  borderRadius: "20px",
  background: "#D9D9D9",
  padding: "0 36px 0 14px",
  fontSize: "14px",
  outline: "none",
  color: "#333",
  appearance: "none",
  cursor: "pointer",
};

const labelStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#222",
  minWidth: "130px",
  flexShrink: 0,
};

const fieldRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  position: "relative",
};

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", right: "12px", pointerEvents: "none" }}>
    <path d="M4 6L8 10L12 6" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ValorLinha({ label, valor, cor }: { label: string; valor: string; cor?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "13px", color: "#555" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: "600", color: cor ?? "#222" }}>{valor}</span>
    </div>
  );
}

export default function RealizarAgendamentoPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeDTO[]>([]);
  const [disponibilidadeId, setDisponibilidadeId] = useState("");
  const [carregandoDisponibilidades, setCarregandoDisponibilidades] = useState(false);
  const [planosSaude, setPlanosSaude] = useState<PlanoSaudeDTO[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarDados() {
      try {
        const [pacientesDados, psicologosDados, planosDados] = await Promise.all([
          getAllPacientes(),
          getAllPsicologos(),
          getAllPlanosSaude(),
        ]);

        if (!isActive) {
          return;
        }

        setPacientes(pacientesDados);
        setPsicologos(psicologosDados);
        setPlanosSaude(planosDados);
      } catch {
        if (isActive) {
          alert("Não foi possível carregar pacientes e psicólogos.");
        }
      }
    }

    carregarDados();

    return () => {
      isActive = false;
    };
  }, []);

  const pacienteSelecionado = useMemo(
    () => pacientes.find(paciente => paciente.id === pacienteId) ?? null,
    [pacientes, pacienteId]
  );

  const psicologoResponsavel = useMemo(
    () => psicologos.find(psicologo => psicologo.id === pacienteSelecionado?.psicologoId) ?? null,
    [psicologos, pacienteSelecionado]
  );

  // Ao selecionar o paciente, carrega as disponibilidades do psicólogo responsável.
  useEffect(() => {
    const psicologoId = pacienteSelecionado?.psicologoId;

    setDisponibilidadeId("");

    if (!psicologoId) {
      setDisponibilidades([]);
      return;
    }

    let isActive = true;
    setCarregandoDisponibilidades(true);

    getDisponibilidadesByPsicologoId(psicologoId)
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
  }, [pacienteSelecionado]);

  const disponibilidadesDisponiveis = useMemo(
    () => disponibilidades.filter(item =>
      item.statusDisponibilidade === StatusDisponibilidadeEnum.stsDisponivel &&
      isDisponibilidadeFutura(item)
    ),
    [disponibilidades]
  );

  // Plano de saúde do paciente selecionado (vindo embutido ou resolvido pela lista de planos).
  const planoDoPaciente = useMemo<PlanoSaudeDTO | null>(() => {
    const planoPaciente = pacienteSelecionado?.planoSaudePacienteDTO;
    if (!planoPaciente) {
      return null;
    }

    return planoPaciente.planoSaudeDTO
      ?? planosSaude.find(plano => plano.id === planoPaciente.planoSaudeId)
      ?? null;
  }, [pacienteSelecionado, planosSaude]);

  // Cobertura aplicável: a especialidade da cobertura deve ser igual à do psicólogo responsável.
  const coberturaAplicavel = useMemo<CoberturaPlanoDTO | null>(() => {
    const especialidade = psicologoResponsavel?.especialidade?.trim().toLowerCase();
    if (!planoDoPaciente || !especialidade) {
      return null;
    }

    return planoDoPaciente.coberturasPlanoDTO?.find(
      cobertura => cobertura.especialidade.trim().toLowerCase() === especialidade
    ) ?? null;
  }, [planoDoPaciente, psicologoResponsavel]);

  // Cálculo do valor final da consulta considerando a cobertura do plano.
  const valores = useMemo(() => {
    const valorConsulta = psicologoResponsavel?.valorConsulta ?? 0;

    if (!coberturaAplicavel) {
      return {
        valorConsulta,
        percentualCobertura: 0,
        valorMaximoCobertura: 0,
        valorCobertura: 0,
        valorFinal: valorConsulta,
      };
    }

    const percentualCobertura = coberturaAplicavel.percentualCobertura ?? 0;
    const valorMaximoCobertura = coberturaAplicavel.valorMaximoCobertura ?? 0;

    let valorCobertura = valorConsulta * (percentualCobertura / 100);
    if (valorMaximoCobertura > 0) {
      valorCobertura = Math.min(valorCobertura, valorMaximoCobertura);
    }

    const valorFinal = Math.max(valorConsulta - valorCobertura, 0);

    return {
      valorConsulta,
      percentualCobertura,
      valorMaximoCobertura,
      valorCobertura,
      valorFinal,
    };
  }, [psicologoResponsavel, coberturaAplicavel]);

  const handleSave = async () => {
    if (!pacienteId || !psicologoResponsavel || !disponibilidadeId) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const disponibilidade = disponibilidadesDisponiveis.find(item => item.id === disponibilidadeId);

    if (!disponibilidade) {
      setError("Disponibilidade selecionada não encontrada.");
      return;
    }

    const pagamentoDTO: PagamentoDTO = {
      valorCoberturaPlano: valores.valorCobertura,
      valorConsultaFinal: valores.valorFinal,
      dataPagamento: new Date(),
      statusFormaPagamento: StatusFormaPagamentoEnum.stsNone,
      statusPagamento: StatusPagamentoEnum.stsPendente,
      statusParcelado: StatusParceladoEnum.stsNao,
    };

    const novaSessao: SessaoDTO = {
      pacienteId,
      psicologoId: psicologoResponsavel.id as string,
      dataSessao: disponibilidade.dataDisponibilidade,
      horaInicio: disponibilidade.horaInicio,
      statusTipoAtendimento: disponibilidade.statusTipoAtendimento,
      statusSessao: StatusSessaoEnum.stsPendente,
      pagamentoDTO,
    };

    try {
      setSaving(true);
      setError(null);
      await agendarSessao(novaSessao);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/agendamentos");
      }, 1500);
    } catch {
      setError("Não foi possível agendar a sessão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout breadcrumb="Agendamentos > Agenda do Dia">
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2rem 2.5rem 2.5rem",
        width: "100%",
        maxWidth: "640px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "700",
          color: "#111",
          marginBottom: "2rem",
        }}>
          Realizar Agendamento
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* Nome do Paciente */}
          <div style={fieldRow}>
            <span style={labelStyle}>Nome do Paciente</span>
            <div style={{ flex: 1, position: "relative" }}>
              <select
                value={pacienteId}
                onChange={e => setPacienteId(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>Selecione...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Psicólogo responsável (definido pelo paciente) */}
          <div style={fieldRow}>
            <span style={labelStyle}>Psicologo</span>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                value={psicologoResponsavel?.nome ?? ""}
                placeholder={pacienteId ?
                  "Sem psicólogo responsável" : "Selecione um(a) psicologo(a) ..."}
                readOnly
                style={{
                  ...selectStyle, cursor: psicologoResponsavel ?
                    "default" : "not-allowed", paddingRight: "14px"
                }}
              />
            </div>
          </div>

          {/* Disponibilidades do psicólogo responsável */}
          <div style={fieldRow}>
            <span style={labelStyle}>Disponibilidades</span>
            <div style={{ flex: 1, position: "relative" }}>
              <select
                value={disponibilidadeId}
                onChange={e => setDisponibilidadeId(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  border: "none",
                  borderRadius: "20px",
                  background: "#D9D9D9",
                  padding: "0 36px 0 14px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#333",
                  appearance: "none",
                  cursor: psicologoResponsavel && !carregandoDisponibilidades ? "pointer" : "not-allowed"
                }}
                disabled={!psicologoResponsavel || carregandoDisponibilidades}
              >
                <option value="" disabled>
                  {!pacienteId
                    ? "Selecione uma disponibilidade..."
                    : carregandoDisponibilidades
                      ? "Carregando..."
                      : disponibilidadesDisponiveis.length === 0
                        ? "Nenhuma disponibilidade"
                        : "Selecione..."}
                </option>
                {disponibilidadesDisponiveis.map(d => (
                  <option key={d.id} value={d.id}>{formatDisponibilidade(d)}</option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Valor da consulta */}
          {psicologoResponsavel && (
            <div style={{
              border: "1px solid #e8ecf5",
              borderRadius: "12px",
              padding: "16px 18px",
              background: "#fbfcff",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1A4FA3", marginBottom: "2px" }}>
                Valor da Consulta
              </div>

              <ValorLinha label="Valor da consulta" valor={formatCurrency(valores.valorConsulta)} />

              {coberturaAplicavel ? (
                <>
                  <ValorLinha label={`Cobertura do plano (${valores.percentualCobertura}%)`} valor={`- ${formatCurrency(valores.valorCobertura)}`} cor="#2A8A55" />
                  {valores.valorMaximoCobertura > 0 && (
                    <ValorLinha label="Valor máximo de cobertura" valor={formatCurrency(valores.valorMaximoCobertura)} cor="#888" />
                  )}
                </>
              ) : (
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {planoDoPaciente
                    ? "O plano do paciente não cobre a especialidade do psicólogo. O paciente paga o valor integral."
                    : "Paciente sem plano de saúde. Paga o valor integral da consulta."}
                </div>
              )}

              <div style={{ borderTop: "1px solid #e8ecf5", margin: "6px 0 2px" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>Valor final da consulta</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#1A4FA3" }}>{formatCurrency(valores.valorFinal)}</span>
              </div>
            </div>
          )}

        </div>

        {error && (
          <div style={{
            marginTop: "1.5rem",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #ffd0d0",
            background: "#fff5f5",
            color: "#b03a2e",
            fontSize: "13px",
            fontWeight: "600",
          }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "2.5rem", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/agendamentos")}
            disabled={saving}
            style={{
              padding: "10px 28px",
              background: "#e0e0e0",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#555",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved || !pacienteId || !disponibilidadeId}
            style={{
              padding: "10px 28px",
              background: saved ? "#3BB077" : "#1A4FA3",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              cursor: saving || saved || !pacienteId || !disponibilidadeId ? "not-allowed" : "pointer",
              opacity: saving || !pacienteId || !disponibilidadeId ? 0.7 : 1,
              transition: "background 0.3s",
            }}
          >
            {saved ? "✓ Salvo!" : saving ? "Agendando..." : "Agendar"}
          </button>
        </div>
      </div>
    </AppLayout >
  );
}