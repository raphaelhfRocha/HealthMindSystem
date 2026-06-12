import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getPacienteById } from "../../shared/services/paciente.service";
import { getAllProntuarios } from "../../shared/services/prontuario.service";
import {
  editarHistoricoMedico,
  excluirSaudeMental,
  getHistoricosMedicosByProntuarioId,
  registrarHistoricoMedico,
} from "../../shared/services/historico-medico.service";
import {
  adicionarEscalaSessao,
  adicionarRegistroSessao,
  alterarEscalaSessao,
  alterarRegistroSessao,
  excluirSessao,
  getAllSessoes,
} from "../../shared/services/sessao.service";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { ProntuarioDTO } from "../../shared/types/dtos/Prontuario.dto";
import { HistoricoMedicoDTO } from "../../shared/types/dtos/HistoricoMedico.dto";
import { SaudeMentalDTO } from "../../shared/types/dtos/SaudeMental.dto";
import { MetaTerapeuticaDTO } from "../../shared/types/dtos/MetaTerapeutica.dto";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { EscalaSessaoDTO } from "../../shared/types/dtos/EscalaSessao.dto";
import { StatusMetaTerapeuticaEnum } from "../../shared/domain/enums/status-meta-terapeutica.enum";
import { StatusPagamentoEnum } from "../../shared/domain/enums/status-pagamento.enum";
import { extractDateKey, formatDateLabel, formatTimeLabel } from "../../shared/utils/sessao";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import SecaoEscalas from "../../shared/components/SecaoEscalas/SecaoEscalas";
import TabRegistroSessao from "../../shared/components/TabRegistroSessao/TabRegistroSessao";
import SecaoMetas from "../../shared/components/SecaoMetas/SecaoMetas";
import TabEvolucao from "../../shared/components/TabEvolucao/TabEvolucao";
import TabSaudeMental from "../../shared/components/TabSaudeMental/TabSaudeMental";
import TabHistorico from "../../shared/components/TabHistorico/TabHistorico";

const TABS = ["Registro de Sessão", "Histórico", "Saúde Mental", "Evolução"];

const SERIES_ESCALAS = [
  { key: "humor" as const, label: "Humor", color: "#1A4FA3", nota: "" },
  { key: "ansiedade" as const, label: "Ansiedade", color: "#E06B4A", nota: "↑ = pior" },
  { key: "sono" as const, label: "Sono", color: "#3BB077", nota: "" },
  { key: "funcSocial" as const, label: "Func. Social", color: "#7B5EA7", nota: "" },
];

const STATUS_META_LABEL: Record<number, { label: string; bg: string; color: string }> = {
  [StatusMetaTerapeuticaEnum.stsNone]: { label: "Indefinida", bg: "#f0f0f0", color: "#888" },
  [StatusMetaTerapeuticaEnum.stsNaoIniciada]: { label: "Não iniciada", bg: "#f0f0f0", color: "#888" },
  [StatusMetaTerapeuticaEnum.stsEmAndamento]: { label: "Em andamento", bg: "#EBF3FF", color: "#1A4FA3" },
  [StatusMetaTerapeuticaEnum.stsAlcancada]: { label: "Alcançada", bg: "#E8F5EE", color: "#2A8A55" },
};

const inputStyle = {
  height: "36px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const, width: "100%", fontFamily: "inherit", color: "#333",
};

const textAreaStyle = {
  border: "1px solid #dde3f0", borderRadius: "8px", padding: "10px", fontSize: "13px",
  outline: "none", resize: "vertical" as const, lineHeight: "1.7", width: "100%",
  boxSizing: "border-box" as const, minHeight: "110px", fontFamily: "inherit", color: "#1a1a1a",
};

const labelMini = { fontSize: "11px", fontWeight: "700" as const, color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

function btnPrimary(disabled = false) {
  return { padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "white", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}
function btnGray() {
  return { padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" as const, color: "#555", cursor: "pointer" };
}


const EMPTY_META = { titulo: "", statusMetaTerapeutica: StatusMetaTerapeuticaEnum.stsNaoIniciada, observacoes: "" };

type TabHandle = { editar: () => void; excluir: () => void };
type TabState = { registrado: boolean; editando: boolean; excluindo: boolean };
const EMPTY_TAB_STATE: TabState = { registrado: false, editando: false, excluindo: false };


export default function VisualizarHistoricoPage() {
  const { id } = useParams();
  const pacienteId = id ?? "";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const histRef = useRef<TabHandle>(null);
  const smRef = useRef<TabHandle>(null);
  const [histState, setHistState] = useState<TabState>(EMPTY_TAB_STATE);
  const [smState, setSmState] = useState<TabState>(EMPTY_TAB_STATE);

  const handleHistState = useCallback((s: TabState) => {
    setHistState(prev => (prev.registrado === s.registrado && prev.editando === s.editando && prev.excluindo === s.excluindo) ? prev : s);
  }, []);
  const handleSmState = useCallback((s: TabState) => {
    setSmState(prev => (prev.registrado === s.registrado && prev.editando === s.editando && prev.excluindo === s.excluindo) ? prev : s);
  }, []);

  const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
  const [prontuario, setProntuario] = useState<ProntuarioDTO | null>(null);
  const [historico, setHistorico] = useState<HistoricoMedicoDTO | null>(null);
  const [sessoes, setSessoes] = useState<SessaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!pacienteId) {
      setError("Paciente não informado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [pacienteDados, prontuarios, sessoesDados] = await Promise.all([
        getPacienteById(pacienteId),
        getAllProntuarios(),
        getAllSessoes(),
      ]);

      setPaciente(pacienteDados);

      const prontuarioPaciente = prontuarios.find(p => p.pacienteId === pacienteId) ?? null;
      setProntuario(prontuarioPaciente);

      if (prontuarioPaciente?.id) {
        const historicos = await getHistoricosMedicosByProntuarioId(prontuarioPaciente.id);
        setHistorico(historicos[0] ?? null);
      } else {
        setHistorico(null);
      }

      setSessoes(sessoesDados.filter(s => s.pacienteId === pacienteId));
    } catch {
      setError("Não foi possível carregar o histórico do paciente.");
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Monta o payload base do histórico (sem metas, para não reprocessá-las à toa).
  const payloadBase = useCallback((): HistoricoMedicoDTO => ({
    id: historico?.id,
    pacienteId,
    prontuarioId: prontuario?.id ?? "",
    razaoAtendimento: historico?.razaoAtendimento ?? "",
    impactoRazao: historico?.impactoRazao ?? "",
    expectativaAtendimento: historico?.expectativaAtendimento ?? "",
    dataRegistro: historico?.dataRegistro ?? new Date(),
    saudeMentalDTO: historico?.saudeMentalDTO,
  }), [historico, pacienteId, prontuario]);

  const salvarHistorico = useCallback(async (dados: { razaoAtendimento: string; impactoRazao: string, expectativaAtendimento: string }) => {
    if (historico?.id) {
      await editarHistoricoMedico(historico.id, { ...payloadBase(), ...dados });
    } else if (prontuario?.id) {
      await registrarHistoricoMedico({
        pacienteId,
        prontuarioId: prontuario.id,
        razaoAtendimento: dados.razaoAtendimento,
        impactoRazao: dados.impactoRazao,
        expectativaAtendimento: dados.expectativaAtendimento,
        dataRegistro: new Date(),
      });
    }
    await carregar();
  }, [historico, prontuario, pacienteId, payloadBase, carregar]);

  const excluirHistorico = useCallback(async () => {
    if (!historico?.id) return;
    // Em vez de excluir o registro, limpa os dados do histórico via PUT.
    await editarHistoricoMedico(historico.id, {
      id: historico.id,
      pacienteId,
      prontuarioId: prontuario?.id ?? "",
      razaoAtendimento: "",
      impactoRazao: "",
      expectativaAtendimento: "",
      dataRegistro: historico.dataRegistro ?? new Date(),
      saudeMentalDTO: historico.saudeMentalDTO,
    });
    await carregar();
  }, [historico, prontuario, pacienteId, carregar]);

  const salvarSaudeMental = useCallback(async (saudeMental: SaudeMentalDTO) => {
    // Cria um histórico vazio sob demanda quando o paciente ainda não tem um,
    // permitindo registrar a saúde mental sem precisar preencher o histórico antes.
    let historicoAtual = historico;
    if (!historicoAtual?.id) {
      if (!prontuario?.id) return;
      historicoAtual = await registrarHistoricoMedico({
        pacienteId,
        prontuarioId: prontuario.id,
        razaoAtendimento: "",
        impactoRazao: "",
        expectativaAtendimento: "",
        dataRegistro: new Date(),
      });
    }
    if (!historicoAtual?.id) return;

    await editarHistoricoMedico(historicoAtual.id, {
      id: historicoAtual.id,
      pacienteId,
      prontuarioId: prontuario?.id ?? "",
      razaoAtendimento: historicoAtual.razaoAtendimento ?? "",
      impactoRazao: historicoAtual.impactoRazao ?? "",
      expectativaAtendimento: historicoAtual.expectativaAtendimento ?? "",
      dataRegistro: historicoAtual.dataRegistro ?? new Date(),
      saudeMentalDTO: { ...saudeMental, historicoMedicoId: historicoAtual.id },
    });
    await carregar();
  }, [historico, prontuario, pacienteId, carregar]);

  const excluirSaudeMentalDoHistorico = useCallback(async () => {
    if (!historico?.id) return;
    await excluirSaudeMental(historico.id);
    await carregar();
  }, [historico, carregar]);

  const salvarMeta = useCallback(async (meta: MetaTerapeuticaDTO) => {
    // Cria um histórico vazio sob demanda quando o paciente ainda não tem um,
    // permitindo registrar metas sem precisar preencher o histórico antes.
    let historicoAtual = historico;
    if (!historicoAtual?.id) {
      if (!prontuario?.id) return;
      historicoAtual = await registrarHistoricoMedico({
        pacienteId,
        prontuarioId: prontuario.id,
        razaoAtendimento: "",
        impactoRazao: "",
        expectativaAtendimento: "",
        dataRegistro: new Date(),
      });
    }
    if (!historicoAtual?.id) return;

    await editarHistoricoMedico(historicoAtual.id, {
      id: historicoAtual.id,
      pacienteId,
      prontuarioId: prontuario?.id ?? "",
      razaoAtendimento: historicoAtual.razaoAtendimento ?? "",
      impactoRazao: historicoAtual.impactoRazao ?? "",
      dataRegistro: historicoAtual.dataRegistro ?? new Date(),
      saudeMentalDTO: historicoAtual.saudeMentalDTO,
      metasTerapeuticasDTO: [{ ...meta, historicoMedicoId: historicoAtual.id }],
    });
    await carregar();
  }, [historico, prontuario, pacienteId, carregar]);

  if (loading) {
    return (
      <AppLayout breadcrumb="Histórico >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando histórico...</div>
      </AppLayout>
    );
  }

  if (error || !paciente) {
    return (
      <AppLayout breadcrumb="Histórico >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          {error ?? "Paciente não encontrado."}
          <br />
          <button onClick={() => navigate("/historico")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  const headerActions =
    activeTab === 1 && histState.registrado && !histState.editando
      ? { onEdit: () => histRef.current?.editar(), onDelete: () => histRef.current?.excluir(), excluindo: histState.excluindo }
      : activeTab === 2 && smState.registrado && !smState.editando
        ? { onEdit: () => smRef.current?.editar(), onDelete: () => smRef.current?.excluir(), excluindo: smState.excluindo }
        : null;

  return (
    <AppLayout breadcrumb="Histórico >">
      <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/historico")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>
            Histórico — {paciente.nome}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", borderBottom: "2px solid #dde3f0" }}>
          <div style={{ display: "flex" }}>
            {TABS.map((tab, i) => (
              <div
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: "8px 14px", fontSize: "12px",
                  fontWeight: activeTab === i ? "700" : "500",
                  color: activeTab === i ? "#1A4FA3" : "#888",
                  borderBottom: activeTab === i ? "2px solid #1A4FA3" : "2px solid transparent",
                  marginBottom: "-2px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {headerActions && (
            <div style={{ display: "flex", gap: "8px", flexShrink: 0, paddingBottom: "6px" }}>
              <button onClick={headerActions.onEdit} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "9px 20px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" /><line x1="13" y1="7" x2="17" y2="11" stroke="white" strokeWidth="2" /></svg>
                Editar
              </button>
              <button onClick={headerActions.onDelete} disabled={headerActions.excluindo} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#922c2c", border: "1px solid #ffd0d0", borderRadius: "20px", padding: "9px 20px", fontSize: "13px", fontWeight: "600", color: "white", cursor: headerActions.excluindo ? "not-allowed" : "pointer", opacity: headerActions.excluindo ? 0.6 : 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7L7 20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20L18 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="10" y1="11" x2="10" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="14" y1="11" x2="14" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {headerActions.excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          )}
        </div>

        {activeTab === 0 && <TabRegistroSessao sessoes={sessoes} onReload={carregar} textAreaStyle={textAreaStyle} />}
        {activeTab === 1 && <TabHistorico ref={histRef} onStateChange={handleHistState} historico={historico} temProntuario={!!prontuario} onSalvar={salvarHistorico} onExcluir={excluirHistorico} />}
        {activeTab === 2 && <TabSaudeMental ref={smRef} onStateChange={handleSmState} historico={historico} temProntuario={!!prontuario} onSalvar={salvarSaudeMental} onExcluir={excluirSaudeMentalDoHistorico} />}
        {activeTab === 3 && <TabEvolucao historico={historico} temProntuario={!!prontuario} sessoes={sessoes} onSalvarMeta={salvarMeta} onReload={carregar} />}
      </div>
    </AppLayout>
  );
}
