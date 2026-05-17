import { useState } from "react";
import AppLayout from "../../components/AppLayout";

const PAGAMENTOS_INICIAL = [
  { id:  1, pacienteNome: "Ana Clara Souza",  psicologo: "Dr. Marcos",  sessaoNum: 1, data: "10/01/2026", valor: 150, statusPagamento: "pago"     },
  { id:  2, pacienteNome: "Ana Clara Souza",  psicologo: "Dr. Marcos",  sessaoNum: 2, data: "17/01/2026", valor: 150, statusPagamento: "pago"     },
  { id:  3, pacienteNome: "Ana Clara Souza",  psicologo: "Dr. Marcos",  sessaoNum: 3, data: "24/01/2026", valor: 150, statusPagamento: "pendente" },
  { id:  4, pacienteNome: "Bruno Mendes",     psicologo: "Dra. Carla",  sessaoNum: 1, data: "05/02/2026", valor: 180, statusPagamento: "pago"     },
  { id:  5, pacienteNome: "Bruno Mendes",     psicologo: "Dra. Carla",  sessaoNum: 2, data: "12/02/2026", valor: 180, statusPagamento: "pendente" },
  { id:  6, pacienteNome: "Diego Almeida",    psicologo: "Dra. Carla",  sessaoNum: 1, data: "02/03/2026", valor: 200, statusPagamento: "pago"     },
  { id:  7, pacienteNome: "Felipe Costa",     psicologo: "Dra. Carla",  sessaoNum: 1, data: "15/02/2026", valor: 150, statusPagamento: "pago"     },
  { id:  8, pacienteNome: "Felipe Costa",     psicologo: "Dra. Carla",  sessaoNum: 2, data: "22/02/2026", valor: 150, statusPagamento: "pendente" },
  { id:  9, pacienteNome: "Henrique Rocha",   psicologo: "Dra. Carla",  sessaoNum: 1, data: "10/04/2026", valor: 150, statusPagamento: "isento"   },
  { id: 10, pacienteNome: "Isabela Martins",  psicologo: "Dr. Marcos",  sessaoNum: 1, data: "01/02/2026", valor: 200, statusPagamento: "pendente" },
  { id: 11, pacienteNome: "João Pedro Silva", psicologo: "Dra. Carla",  sessaoNum: 1, data: "05/01/2026", valor: 150, statusPagamento: "pago"     },
  { id: 12, pacienteNome: "João Pedro Silva", psicologo: "Dra. Carla",  sessaoNum: 2, data: "12/01/2026", valor: 150, statusPagamento: "pago"     },
];

const STATUS_CONFIG = {
  pendente: { label: "Pendente", bg: "#FFF8E6", color: "#856404" },
  pago:     { label: "Pago",     bg: "#E8F5EE", color: "#2A8A55" },
  isento:   { label: "Isento",   bg: "#f0f0f0", color: "#888"    },
};

const STATUS_FILTROS = ["todos", "pendente", "pago", "isento"];
const STATUS_FILTRO_LABEL = { todos: "Todos", pendente: "Pendente", pago: "Pago", isento: "Isento" };

function formatBRL(valor) {
  return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Summary card ─────────────────────────────────────────────────────────────
function CardResumo({ label, valor, cor, bg, sub }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", flex: 1, minWidth: "140px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: "800", color: cor }}>{valor}</div>
      {sub && <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FinanceiroPage() {
  const [pagamentos, setPagamentos] = useState([...PAGAMENTOS_INICIAL]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  const registrarPagamento = (id) => {
    setPagamentos(prev => prev.map(p => p.id === id ? { ...p, statusPagamento: "pago" } : p));
  };

  // ── aggregates ──
  const totalRecebido  = pagamentos.filter(p => p.statusPagamento === "pago").reduce((s, p) => s + p.valor, 0);
  const totalPendente  = pagamentos.filter(p => p.statusPagamento === "pendente").reduce((s, p) => s + p.valor, 0);
  const totalSessoes   = pagamentos.length;
  const totalIsentos   = pagamentos.filter(p => p.statusPagamento === "isento").length;

  // ── filters ──
  const filtrados = pagamentos.filter(p => {
    const matchStatus = filtroStatus === "todos" || p.statusPagamento === filtroStatus;
    const matchBusca  = p.pacienteNome.toLowerCase().includes(busca.toLowerCase()) ||
                        p.psicologo.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const COL = "1fr 130px 90px 110px 120px 170px";

  return (
    <AppLayout breadcrumb="Financeiro >">
      <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Title */}
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Financeiro</h1>

        {/* Summary cards */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <CardResumo
            label="Total Recebido"
            valor={`R$ ${formatBRL(totalRecebido)}`}
            cor="#2A8A55"
            sub={`${pagamentos.filter(p => p.statusPagamento === "pago").length} sessões pagas`}
          />
          <CardResumo
            label="A Receber"
            valor={`R$ ${formatBRL(totalPendente)}`}
            cor="#856404"
            sub={`${pagamentos.filter(p => p.statusPagamento === "pendente").length} sessões pendentes`}
          />
          <CardResumo
            label="Total de Sessões"
            valor={totalSessoes}
            cor="#1A4FA3"
            sub="registradas no sistema"
          />
          <CardResumo
            label="Isenções"
            valor={totalIsentos}
            cor="#888"
            sub={totalIsentos === 1 ? "sessão isenta" : "sessões isentas"}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "space-between" }}>
          {/* Status pills */}
          <div style={{ display: "flex", gap: "6px" }}>
            {STATUS_FILTROS.map(s => (
              <button
                key={s}
                onClick={() => setFiltroStatus(s)}
                style={{
                  padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
                  border: "none", cursor: "pointer", transition: "background 0.15s",
                  background: filtroStatus === s ? "#1A4FA3" : "#EBF3FF",
                  color: filtroStatus === s ? "white" : "#1A4FA3",
                }}
              >
                {STATUS_FILTRO_LABEL[s]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none"/>
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar paciente ou psicólogo..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 30px", fontSize: "13px", outline: "none", width: "240px", background: "white" }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Paciente", "Psicólogo", "Sessão", "Data", "Valor", "Status / Ação"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum registro encontrado.
            </div>
          ) : (
            filtrados.map((p, i) => {
              const rowBg = i % 2 === 0 ? "white" : "#f9fafc";
              const cfg   = STATUS_CONFIG[p.statusPagamento];
              return (
                <div
                  key={p.id}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  {/* Paciente */}
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.pacienteNome}
                  </div>

                  {/* Psicólogo */}
                  <div style={{ fontSize: "13px", color: "#555" }}>{p.psicologo}</div>

                  {/* Sessão */}
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", background: "#EBF3FF", color: "#1A4FA3", borderRadius: "10px", padding: "2px 10px" }}>
                      #{p.sessaoNum}
                    </span>
                  </div>

                  {/* Data */}
                  <div style={{ fontSize: "13px", color: "#555" }}>{p.data}</div>

                  {/* Valor */}
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>
                    {p.valor != null ? `R$ ${formatBRL(p.valor)}` : "—"}
                  </div>

                  {/* Status / Ação */}
                  <div>
                    {p.statusPagamento === "pendente" ? (
                      <button
                        onClick={() => registrarPagamento(p.id)}
                        style={{ padding: "5px 14px", background: "#1A4FA3", border: "none", borderRadius: "14px", fontSize: "12px", fontWeight: "600", color: "white", cursor: "pointer", whiteSpace: "nowrap" }}
                        onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
                        onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                      >
                        Registrar Pagamento
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", fontWeight: "600", borderRadius: "14px", padding: "4px 12px", background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
