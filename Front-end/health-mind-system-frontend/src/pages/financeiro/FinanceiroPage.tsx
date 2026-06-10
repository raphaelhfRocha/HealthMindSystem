import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { StatusPagamentoEnum } from "../../shared/domain/enums/status-pagamento.enum";
import { StatusFormaPagamentoEnum } from "../../shared/domain/enums/status-forma-pagamento.enum";
import { StatusParceladoEnum } from "../../shared/domain/enums/status-parcelado.enum";
import { definirPagamento, getAllSessoes } from "../../shared/services/sessao.service";
import { getAllPacientes } from "../../shared/services/paciente.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { SessaoDTO } from "../../shared/types/dtos/Sessao.dto";
import { PagamentoDTO } from "../../shared/types/dtos/Pagamento.dto";
import { formatDate } from "../../shared/utils/formatDate";
import { Pagination, usePagination } from "../../shared/components/Pagination";
import { toDateInput } from "../../shared/utils/dateUtils";
import { formatHora } from "../../shared/utils/formatHora";
import { formatBRL } from "../../shared/utils/formatBRL";
import ModalEditarPagamento from "../../shared/components/ModalEditarPagamento/ModalEditarPagamento";
import CardResumo from "../../shared/components/CardResumo/CardResumo";
import { useAuth } from "../../shared/context/AuthContext";
import { usePermissions } from "../../shared/hooks/usePermissions";
import { findPsicologoByEmail } from "../../shared/hooks/useCurrentPsicologo";

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
  dataSessao: string;
  horaSessao: string;
  data: string;
  valor: number | null;
  statusPagamento: StatusFinanceiro;
};

export default function FinanceiroPage() {
  const { user } = useAuth();
  const { isPsicologo, isRecepcionista } = usePermissions();
  const [sessoes, setSessoes] = useState<SessaoFinanceira[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");
  const [busca, setBusca] = useState("");

  const [pagamentoEmEdicao, setPagamentoEmEdicao] = useState<SessaoFinanceira | null>(null);
  const [salvandoPagamento, setSalvandoPagamento] = useState(false);
  const [erroPagamento, setErroPagamento] = useState<string | null>(null);
  const [marcandoId, setMarcandoId] = useState<string | null>(null);

  const carregarSessoes = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);

      const [sessoes, pacientes, psicologos] =
        await Promise.all([
          getAllSessoes(),
          getAllPacientes(),
          getAllPsicologos(),
        ]);

      const pacientesMap = new Map(
        pacientes.map((p) => [p.id, p.nome])
      );

      const psicologosMap = new Map(
        psicologos.map((p) => [p.id, p.nome])
      );

      const sessoesComNomes = sessoes.map((sessao) => ({
        ...sessao,
        pacienteNome:
          pacientesMap.get(sessao.pacienteId) ?? "Não encontrado",

        psicologoNome:
          psicologosMap.get(sessao.psicologoId) ?? "Não encontrado",
      }));

      // Psicólogo visualiza apenas os pagamentos dos pacientes sob sua responsabilidade.
      let sessoesVisiveis = sessoesComNomes;
      if (isPsicologo) {
        const meuId = findPsicologoByEmail(psicologos, user?.email)?.id ?? null;
        const meusPacientes = new Set(
          pacientes.filter((p) => p.psicologoId === meuId).map((p) => p.id)
        );
        sessoesVisiveis = sessoesComNomes.filter((s) => meusPacientes.has(s.pacienteId));
      }

      setSessoes(sessoesVisiveis);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Falha ao carregar financeiro";

      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }, [isPsicologo, user?.email]);

  useEffect(() => {
    void carregarSessoes();
  }, [carregarSessoes]);



  const mapStatusPagamento = (pagamento?: PagamentoDTO): StatusFinanceiro => {
    if (pagamento?.statusPagamento === StatusPagamentoEnum.stsPago) return "pago";
    if (pagamento?.statusPagamento === StatusPagamentoEnum.stsIsento) return "isento";
    return "pendente";
  };

  const linhas = useMemo<dadosFinanceiro[]>(() => {
    return sessoes
      .map((sessao) => {
        const pagamento = sessao.pagamentoDTO;

        const statusPagamento =
          mapStatusPagamento(pagamento);

        const valor =
          pagamento?.valorConsultaFinal ??
          pagamento?.valorConsulta ??
          null;

        const pacienteNome =
          sessao.pacienteNome ??
          "Paciente não encontrado";

        const psicologo =
          sessao.psicologoNome ??
          "Psicólogo não encontrado";

        const sessaoNum = Number(
          sessao.sessaoNum ??
          sessao.num ??
          sessao.id ??
          0
        );

        const dataBase =
          pagamento?.dataPagamento ?? "";

        const dataValida =
          dataBase && new Date(dataBase).getFullYear() > 1
            ? (dataBase as Date | string)
            : "";

        const data =
          formatDate(dataValida);

        const dataSessao =
          sessao.dataSessao &&
          new Date(sessao.dataSessao).getFullYear() > 1
            ? formatDate(sessao.dataSessao)
            : "—";

        const horaSessao =
          formatHora(sessao.horaInicio);

        return {
          id: String(
            pagamento?.sessaoId ??
            sessao.id ??
            sessaoNum
          ),
          pacienteNome,
          psicologo,
          sessaoNum:
            Number.isFinite(sessaoNum)
              ? sessaoNum
              : 0,
          dataSessao,
          horaSessao,
          data,
          valor,
          statusPagamento,
        };
      })
      .filter((linha) => Boolean(linha.id));
  }, [sessoes]);



  const totalRecebido = linhas
    .filter((linha) => linha.statusPagamento === "pago")
    .reduce((acc, linha) => acc + (linha.valor ?? 0), 0);

  const totalPendente = linhas
    .filter((linha) => linha.statusPagamento === "pendente")
    .reduce((acc, linha) => acc + (linha.valor ?? 0), 0);

  const totalSessoes = linhas.length;
  const totalIsentos = linhas
    .filter((linha) => linha.statusPagamento === "isento").length

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

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, `${filtroStatus}|${busca}`);

  function abrirEdicaoPagamento(linha: dadosFinanceiro) {
    const sessao = sessoes.find(item => String(item.id) === String(linha.id));
    if (!sessao) {
      return;
    }
    setErroPagamento(null);
    setPagamentoEmEdicao(sessao);
  }

  async function handleSalvarPagamento(pagamento: PagamentoDTO) {
    const sessaoId = pagamentoEmEdicao?.id;
    if (!sessaoId) {
      return;
    }

    try {
      setSalvandoPagamento(true);
      setErroPagamento(null);
      await definirPagamento(sessaoId, pagamento);
      setPagamentoEmEdicao(null);
      await carregarSessoes();
    } catch {
      setErroPagamento("Não foi possível salvar o pagamento. Tente novamente.");
    } finally {
      setSalvandoPagamento(false);
    }
  }

  const COL = "1.3fr 1fr 105px 95px 120px 95px 95px 90px";

  return (
    <AppLayout breadcrumb="Financeiro >">
      {pagamentoEmEdicao && (
        <ModalEditarPagamento
          pacienteNome={pagamentoEmEdicao.pacienteNome ?? "—"}
          pagamento={pagamentoEmEdicao.pagamentoDTO}
          saving={salvandoPagamento}
          error={erroPagamento}
          onSave={handleSalvarPagamento}
          onClose={() => { if (!salvandoPagamento) setPagamentoEmEdicao(null); }}
        />
      )}
      <div style={{ width: "100%", maxWidth: "1080px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Financeiro</h1>

        {/* Recepcionista não visualiza os cards de resumo financeiro. */}
        {!isRecepcionista && (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <CardResumo
            label="Total Recebido"
            valor={`R$ ${formatBRL(totalRecebido)}`}
            cor="#2A8A55"
            sub={
              linhas.filter((linha) => linha.statusPagamento === "pago").length === 1 ?
                'sessão paga' : linhas.filter((linha) => linha.statusPagamento === "pago")
                  .length > 1 ? 'sessões pagas' : ''
            }
          />
          <CardResumo
            label="A Receber"
            valor={`R$ ${formatBRL(totalPendente)}`}
            cor="#856404"
            sub={
              linhas.filter((linha) => linha.statusPagamento === "pendente").length === 1 ?
                'sessão pendente' : linhas.filter((linha) => linha.statusPagamento === "pendente")
                  .length > 1 ? 'sessões pendentes' : ''
            }
          />
          <CardResumo
            label="Total de Sessões"
            valor={totalSessoes}
            cor="#1A4FA3"
            sub={
              linhas.length === 1 ? 'registrada no sistema' :
              linhas.length > 1 ? 'registradas no sistema' : 
              ''}
          />
          <CardResumo
            label="Isenções"
            valor={totalIsentos}
            cor="#888"
            sub={
              linhas.filter((linha) => linha.statusPagamento === "isento").length === 1 ?
              'sessão isenta' : linhas.filter((linha) => linha.statusPagamento === "isento")
                  .length > 1 ? 'sessões isentas' : ''
            }
          />
        </div>
        )}

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
            {["Paciente", "Psicólogo", "Data Sessão", "Hora Sessão", "Data Pagamento", "Valor", "Status", "Ações"].map((header) => (
              <div
                key={header}
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
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
            pageItems.map((linha, index) => {
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

                  <div style={{ fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{linha.dataSessao}</div>

                  <div style={{ fontSize: "13px", color: "#555", whiteSpace: "nowrap", textAlign: "left" }}>{linha.horaSessao}</div>

                  <div style={{ fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{linha.data}</div>

                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>
                    {linha.valor != null ? `R$ ${formatBRL(linha.valor)}` : "—"}
                  </div>

                  <div>
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
                  </div>

                  {/* Psicólogo utiliza o financeiro apenas para consulta. */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    {!isPsicologo ? (
                      <button
                        onClick={() => abrirEdicaoPagamento(linha)}
                        title="Editar pagamento"
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", background: "#EBF3FF", border: "none", borderRadius: "14px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap" }}
                        onMouseEnter={event => event.currentTarget.style.background = "#d0e4ff"}
                        onMouseLeave={event => event.currentTarget.style.background = "#EBF3FF"}
                      >
                        Editar
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#ccc" }}>—</span>
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

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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
