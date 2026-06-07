import { useCallback, useEffect, useMemo, useState } from "react";
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


export default function VisualizarHistoricoPage() {
  const { id } = useParams();
  const pacienteId = id ?? "";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

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

        <div style={{ display: "flex", borderBottom: "2px solid #dde3f0", overflowX: "auto" }}>
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

        {activeTab === 0 && <TabRegistroSessao sessoes={sessoes} onReload={carregar} textAreaStyle={textAreaStyle} />}
        {activeTab === 1 && <TabHistorico historico={historico} temProntuario={!!prontuario} onSalvar={salvarHistorico} onExcluir={excluirHistorico} />}
        {activeTab === 2 && <TabSaudeMental historico={historico} temProntuario={!!prontuario} onSalvar={salvarSaudeMental} onExcluir={excluirSaudeMentalDoHistorico} />}
        {activeTab === 3 && <TabEvolucao historico={historico} temProntuario={!!prontuario} sessoes={sessoes} onSalvarMeta={salvarMeta} onReload={carregar} />}
      </div>
    </AppLayout>
  );
}
