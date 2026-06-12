import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPacientes } from "../../shared/services/paciente.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { getAllSessoes } from "../../shared/services/sessao.service";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { extractDateKey, formatTimeLabel } from "../../shared/utils/sessao";
import { Pagination, usePagination } from "../../shared/components/Pagination";
import { useAuth } from "../../shared/context/AuthContext";
import { findPsicologoLogado } from "../../shared/hooks/useCurrentPsicologo";
import { usePermissions } from "../../shared/hooks/usePermissions";

function getInitials(nome: string) {
  const parts = nome.trim().split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

function calcularIdade(dataNascimento?: string | Date): number | null {
  if (!dataNascimento) return null;
  const nascimento = dataNascimento instanceof Date ? dataNascimento : new Date(dataNascimento);
  if (Number.isNaN(nascimento.getTime())) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 0 ? idade : null;
}

function formatDataBR(dateKey: string): string {
  if (!dateKey) return "—";
  const [year, month, day] = dateKey.split("-");
  if (!year || !month || !day) return "—";
  return `${day}/${month}/${year}`;
}

type LinhaHistorico = {
  id: string;
  nome: string;
  idade: number | null;
  psicologo: string;
  totalSessoes: number;
  dataAbertura: string;
  avatarIndex: number;
};

export default function HistoricoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPsicologo } = usePermissions();
  const [busca, setBusca] = useState("");
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [sessoes, setSessoes] = useState<SessaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregar() {
      try {
        setLoading(true);
        setError(null);

        const [pacientesDados, psicologosDados, sessoesDados] = await Promise.all([
          getAllPacientes(),
          getAllPsicologos(),
          getAllSessoes(),
        ]);

        if (!isActive) return;

        setPacientes(pacientesDados);
        setPsicologos(psicologosDados);
        setSessoes(sessoesDados);
      } catch {
        if (isActive) {
          setError("Não foi possível carregar o histórico de pacientes.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregar();

    return () => {
      isActive = false;
    };
  }, []);

  const psicologosPorId = useMemo(
    () => new Map(psicologos.filter(p => p.id).map(p => [p.id as string, p.nome])),
    [psicologos]
  );

  const sessoesPorPaciente = useMemo(() => {
    const mapa = new Map<string, SessaoDTO[]>();
    for (const sessao of sessoes) {
      if (!sessao.pacienteId) continue;
      const lista = mapa.get(sessao.pacienteId) ?? [];
      lista.push(sessao);
      mapa.set(sessao.pacienteId, lista);
    }
    return mapa;
  }, [sessoes]);

  const psicologoLogadoId = useMemo(
    () => findPsicologoLogado(psicologos, user)?.id ?? null,
    [psicologos, user]
  );

  const pacientesVisiveis = useMemo(
    () => (isPsicologo
      ? (psicologoLogadoId ? pacientes.filter(p => p.psicologoId === psicologoLogadoId) : [])
      : pacientes),
    [pacientes, psicologoLogadoId, isPsicologo]
  );

  const linhas = useMemo<LinhaHistorico[]>(() => {
    return pacientesVisiveis
      .filter(paciente => paciente.id)
      .map((paciente, index) => {
        const sessoesPaciente = sessoesPorPaciente.get(paciente.id as string) ?? [];

        const aberturaKey = sessoesPaciente.reduce<string>((menor, sessao) => {
          const key = extractDateKey(sessao.dataSessao);
          return !menor || key < menor ? key : menor;
        }, "");

        return {
          id: paciente.id as string,
          nome: paciente.nome,
          idade: calcularIdade(paciente.dataNascimento),
          psicologo: psicologosPorId.get(paciente.psicologoId) ?? "—",
          totalSessoes: sessoesPaciente.length,
          dataAbertura: aberturaKey ? formatDataBR(aberturaKey) : "—",
          avatarIndex: index,
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [pacientesVisiveis, sessoesPorPaciente, psicologosPorId]);

  const filtrados = useMemo(
    () => linhas.filter(linha => linha.nome.toLowerCase().includes(busca.toLowerCase())),
    [linhas, busca]
  );

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  const COL = "220px 80px 150px 100px 140px 160px";

  return (
    <AppLayout breadcrumb="Histórico >">
      <div style={{ width: "100%", maxWidth: "940px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>
            Histórico de Pacientes
          </h1>

          <div style={{ position: "relative" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{
                height: "36px", border: "1px solid #dde3f0", borderRadius: "20px",
                padding: "0 14px 0 32px", fontSize: "13px", outline: "none",
                width: "200px", color: "#333", background: "white",
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        {/* Table card */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Paciente", "Idade", "Psicólogo", "Sessões", "Data Abertura", "Ação"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Carregando pacientes...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Nenhum paciente encontrado.</div>
          ) : (
            pageItems.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: COL,
                  padding: "12px 20px",
                  gap: "12px",
                  alignItems: "center",
                  background: i % 2 === 0 ? "white" : "#f9fafc",
                  borderBottom: "1px solid #eef0f6",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "white" : "#f9fafc"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: AVATAR_COLORS[p.avatarIndex % AVATAR_COLORS.length],
                    color: "white", fontSize: "12px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {getInitials(p.nome)}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{p.nome}</span>
                </div>

                <div style={{ fontSize: "13px", color: "#555" }}>{p.idade != null ? `${p.idade} anos` : "—"}</div>

                <div style={{ fontSize: "13px", color: "#555" }}>{p.psicologo}</div>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  <span style={{
                    background: "#EBF3FF", color: "#1A4FA3",
                    fontWeight: "700", borderRadius: "12px",
                    padding: "2px 10px", fontSize: "12px",
                  }}>
                    {p.totalSessoes}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "#555" }}>{p.dataAbertura}</div>

                <div>
                  <button
                    onClick={() => navigate(`/historico/${p.id}`)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 16px",
                      background: "#EBF3FF",
                      border: "none",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#1A4FA3",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      marginLeft: "-20px"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12 C4 7 8 4 12 4 C16 4 20 7 22 12 C20 17 16 20 12 20 C8 20 4 17 2 12Z" stroke="#1A4FA3" strokeWidth="2" fill="none" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="#1A4FA3" strokeWidth="2" fill="none" />
                    </svg>
                    Visualizar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "paciente encontrado" : "pacientes encontrados"}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AppLayout>
  );
}
