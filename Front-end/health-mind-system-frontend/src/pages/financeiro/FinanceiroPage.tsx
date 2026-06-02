import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { StatusPagamentoEnum } from "../../shared/domain/enums/status-pagamento.enum";
import { excluirPagamentoSessao, getAllSessoes } from "../../shared/services/sessao.service";
import { getPacienteById } from "../../shared/services/paciente.service";
import { getPsicologoById } from "../../shared/services/psicologo.service";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { PagamentoDTO } from "../../shared/types/dtos/Pagamento.dto";
import { formatDate } from "../../shared/utils/formatDate";
import { Psicologo } from "../../shared/types/common/Psicologo";
import { Paciente } from "../../shared/types/common/Paciente";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { safeName } from "./financeiro.debug";

const STATUS_FILTROS = ["todos", "pendente", "pago", "isento"] as const;
type StatusFiltro = (typeof STATUS_FILTROS)[number];
type StatusFinanceiro = Exclude<StatusFiltro, "todos">;

const STATUS_CONFIG: Record<StatusFinanceiro, { label: string; bg: string; color: string }> = {
  pendente: { label: "Pendente", bg: "#FFF8E6", color: "#856404" },
  pago: { label: "Pago", bg: "#E8F5EE", color: "#2A8A55" },
  isento: { label: "Isento", bg: "#F0F0F0", color: "#888888" },
};

const STATUS_FILTRO_LABEL: Record<StatusFiltro, string> = {
  todos: "Todos",
  pendente: "Pendente",
  pago: "Pago",
  isento: "Isento",
};

type SessaoFinanceira = SessaoDTO & {
  id?: string;
  pacienteNome?: string;
  psicologoNome?: string;
  sessaoNum?: number;
  num?: number;
  paciente?: { nome?: string };
  psicologo?: { nome?: string };
  pagamentoDTO?: PagamentoDTO;
};

type dadosFinanceiro = {
  id: string;
  pacienteNome: string;
  psicologo: string;
  sessaoNum: number;
  data: string;
  valor: number | null;
  statusPagamento: StatusFinanceiro;
};

function formatBRL(valor: number) {
  return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CardResumo({
  label,
  valor,
  cor,
  sub,
}: {
  label: string;
  valor: string | number;
  cor: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px 22px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        flex: 1,
        minWidth: "140px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "800", color: cor }}>{valor}</div>
      {sub && <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

export default function FinanceiroPage() {
  const [sessoes, setSessoes] = useState<SessaoFinanceira[]>([]);
  const [psicologo, setPsicologo] = useState<PsicologoDTO>();
  const [paciente, setPaciente] = useState<PacienteDTO>();
  const [loading, setLoading] = useState(true);
  const [salvandoId, setSalvandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");
  const [busca, setBusca] = useState("");

  const carregarSessoes = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      const result = await getAllSessoes();
      setSessoes(result as SessaoFinanceira[]);
    } catch (error: unknown) {
      const mensagem = error instanceof Error ? error.message : "Falha ao carregar financeiro";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarSessoes();
  }, [carregarSessoes]);

  const mapStatusPagamento = (pagamento?: PagamentoDTO): StatusFinanceiro => {
    if (pagamento?.statusPagamento === StatusPagamentoEnum.stsPago) return "pago";
    if (pagamento?.statusPagamento === StatusPagamentoEnum.stsNone) return "isento";
    return "pendente";
  };

  const linhas = useMemo<dadosFinanceiro[]>(() => {
    return sessoes
      .map((sessao) => {
        const pagamento = sessao.pagamentoDTO;
        const statusPagamento = mapStatusPagamento(pagamento);
        const valor = pagamento?.valorConsultaFinal ?? pagamento?.valorConsulta ?? null;
        const pacienteNome =
          safeName((sessao as any).paciente?.nome) ?? safeName(sessao.pacienteNome) ?? "—";
        const psicologo =
          safeName((sessao as any).psicologo?.nome) ?? safeName(sessao.psicologoNome) ?? "—";
        const sessaoNum = Number(sessao.sessaoNum ?? sessao.num ?? sessao.id ?? 0);
        const dataBase = pagamento?.dataPagamento ?? sessao.dataSessao ?? "";
        const data = formatDate(dataBase as Date | string);

        return {
          id: String(pagamento?.sessaoId ?? sessao.id ?? sessaoNum),
          pacienteNome,
          psicologo,
          sessaoNum: Number.isFinite(sessaoNum) ? sessaoNum : 0,
          data,
          valor,
          statusPagamento,
        };
      })
      .filter((linha) => Boolean(linha.id) && linha.data !== "");
  }, [sessoes]);

  const totalRecebido = linhas
    .filter((linha) => linha.statusPagamento === "pago")
    .reduce((acc, linha) => acc + (linha.valor ?? 0), 0);

  const totalPendente = linhas
    .filter((linha) => linha.statusPagamento === "pendente")
    .reduce((acc, linha) => acc + (linha.valor ?? 0), 0);

  const totalSessoes = linhas.length;
  const totalIsentos = linhas.filter((linha) => linha.statusPagamento === "isento").length;

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();

    return linhas.filter((linha) => {
      const matchStatus = filtroStatus === "todos" || linha.statusPagamento === filtroStatus;
      const matchBusca =
        !q ||
        linha.pacienteNome.toLowerCase().includes(q) ||
        linha.psicologo.toLowerCase().includes(q);

      return matchStatus && matchBusca;
    });
  }, [linhas, filtroStatus, busca]);

  const handleExcluirPagamento = useCallback(
    async (sessaoId: string) => {
      const confirmado = window.confirm("Excluir o pagamento desta sessão?");
      if (!confirmado) return;

      try {
        setSalvandoId(sessaoId);
        await excluirPagamentoSessao(sessaoId);
        await carregarSessoes();
      } catch (error: unknown) {
        const mensagem = error instanceof Error ? error.message : "Falha ao excluir pagamento";
        setErro(mensagem);
      } finally {
        setSalvandoId(null);
      }
    },
    [carregarSessoes]
  );

  const COL = "1fr 130px 90px 110px 120px 170px";

  return (
    <AppLayout breadcrumb="Financeiro >">
      <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Financeiro</h1>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <CardResumo
            label="Total Recebido"
            valor={`R$ ${formatBRL(totalRecebido)}`}
            cor="#2A8A55"
            sub={`${linhas.filter((linha) => linha.statusPagamento === "pago").length} sessões pagas`}
          />
          <CardResumo
            label="A Receber"
            valor={`R$ ${formatBRL(totalPendente)}`}
            cor="#856404"
            sub={`${linhas.filter((linha) => linha.statusPagamento === "pendente").length} sessões pendentes`}
          />
          <CardResumo label="Total de Sessões" valor={totalSessoes} cor="#1A4FA3" sub="registradas no sistema" />
          <CardResumo
            label="Isenções"
            valor={totalIsentos}
            cor="#888"
            sub={totalIsentos === 1 ? "sessão isenta" : "sessões isentas"}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {STATUS_FILTROS.map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: filtroStatus === status ? "#1A4FA3" : "#EBF3FF",
                  color: filtroStatus === status ? "white" : "#1A4FA3",
                }}
              >
                {STATUS_FILTRO_LABEL[status]}
              </button>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar paciente ou psicólogo..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              style={{
                height: "36px",
                border: "1px solid #dde3f0",
                borderRadius: "20px",
                padding: "0 14px 0 30px",
                fontSize: "13px",
                outline: "none",
                width: "240px",
                background: "white",
              }}
            />
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Paciente", "Psicólogo", "Sessão", "Data", "Valor", "Status / Ação"].map((header) => (
              <div
                key={header}
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {header}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#888", fontSize: "14px" }}>Carregando financeiro...</div>
          ) : erro ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#b00020", fontSize: "14px" }}>{erro}</div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Nenhum registro encontrado.</div>
          ) : (
            filtrados.map((linha, index) => {
              const rowBg = index % 2 === 0 ? "white" : "#f9fafc";
              const cfg = STATUS_CONFIG[linha.statusPagamento];

              return (
                <div
                  key={linha.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: COL,
                    padding: "12px 20px",
                    gap: "12px",
                    alignItems: "center",
                    background: rowBg,
                    borderBottom: "1px solid #eef0f6",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#f0f4ff";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = rowBg;
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {linha.pacienteNome}
                  </div>

                  <div style={{ fontSize: "13px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {linha.psicologo}
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        background: "#EBF3FF",
                        color: "#1A4FA3",
                        borderRadius: "10px",
                        padding: "2px 10px",
                      }}
                    >
                      #{linha.sessaoNum}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#555" }}>{linha.data}</div>

                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>
                    {linha.valor != null ? `R$ ${formatBRL(linha.valor)}` : "—"}
                  </div>

                  <div>
                    {linha.statusPagamento === "pago" ? (
                      <button
                        type="button"
                        disabled={salvandoId === linha.id}
                        onClick={() => void handleExcluirPagamento(linha.id)}
                        style={{
                          padding: "5px 14px",
                          background: salvandoId === linha.id ? "#9DB4E8" : "#1A4FA3",
                          border: "none",
                          borderRadius: "14px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "white",
                          cursor: salvandoId === linha.id ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {salvandoId === linha.id ? "Excluindo..." : "Excluir pagamento"}
                      </button>
                    ) : (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          borderRadius: "14px",
                          padding: "4px 12px",
                          background: cfg.bg,
                          color: cfg.color,
                        }}
                      >
                        {cfg.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "registro encontrado" : "registros encontrados"}
          </span>

          {filtroStatus === "todos" && (
            <span style={{ fontSize: "12px", color: "#888" }}>
              Total geral: <strong style={{ color: "#111" }}>R$ {formatBRL(totalRecebido + totalPendente)}</strong>
            </span>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
