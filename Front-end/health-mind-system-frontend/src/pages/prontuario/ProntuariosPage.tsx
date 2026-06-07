import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPacientes } from "../../shared/services/paciente.service";
import { getAllProntuarios } from "../../shared/services/prontuario.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { Pagination, usePagination } from "../../shared/components/Pagination";

type Row = {
  id: string;
  prontuarioId: string;
  nome: string;
  idade: number | string;
  psicologo: string;
  ultima: string;
  temProntuario: boolean;
};

function getInitials(nome) {
  const parts = nome.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

export default function ProntuariosPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [pacientes, prontuarios, psicologos] = await Promise.all([
          getAllPacientes(),
          getAllProntuarios(),
          getAllPsicologos(),
        ]);

        if (!active) return;

        const psicologoMap = new Map(psicologos.map(p => [p.id, p.nome]));

        const prontuariosByPaciente = new Map<string, any[]>();
        prontuarios.forEach((pr: any) => {
          const list = prontuariosByPaciente.get(pr.pacienteId) ?? [];
          list.push(pr);
          prontuariosByPaciente.set(pr.pacienteId, list);
        });

        const buildRows: Row[] = pacientes.map(p => {
          const prList = prontuariosByPaciente.get(p.id ?? "") ?? [];
          const latest = prList.length ? prList.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime())[0] : null;

          const dataNascimento = typeof p.dataNascimento === "string" ? new Date(p.dataNascimento) : (p.dataNascimento ? new Date(p.dataNascimento) : null);
          const idade = dataNascimento ? Math.max(0, new Date().getFullYear() - dataNascimento.getFullYear()) : "—";

          return {
            id: p.id ?? "",
            prontuarioId: latest?.id ?? "",
            nome: p.nome,
            idade,
            psicologo: psicologoMap.get(p.psicologoId) ?? "—",
            ultima: latest ? new Date(latest.dataAbertura).toLocaleDateString("pt-BR") : "—",
            temProntuario: prList.length > 0,
          };
        });

        setRows(buildRows);
      } catch (e) {
        setError("Não foi possível carregar os prontuários.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const filtrados = rows.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  return (
    <AppLayout breadcrumb="Prontuário >">
      <div style={{
        width: "100%",
        maxWidth: "840px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>
            Prontuários
          </h1>
          {/* Search */}
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
                height: "36px",
                border: "1px solid #dde3f0",
                borderRadius: "20px",
                padding: "0 14px 0 32px",
                fontSize: "13px",
                outline: "none",
                width: "200px",
                color: "#333",
                background: "white",
              }}
            />
          </div>
        </div>

        {/* Table card */}
        <div style={{
          background: "white",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "220px 80px 130px 140px 180px",
            background: "#1A4FA3",
            padding: "10px 20px",
            gap: "12px",
          }}>
            {["Paciente", "Idade", "Psicólogo", "Data Abertura", "Ações"].map(h => (
              <div key={h} style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum paciente encontrado.
            </div>
          ) : (
            pageItems.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 80px 130px 140px 180px",
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
                {/* Patient name with avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: AVATAR_COLORS[(Number(p.id) || i) % AVATAR_COLORS.length],
                    color: "white", fontSize: "12px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {getInitials(p.nome)}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{p.nome}</span>
                </div>

                {/* Idade */}
                <div style={{ fontSize: "13px", color: "#555" }}>{typeof p.idade === 'number' ? `${p.idade} anos` : p.idade}</div>

                {/* Psicólogo */}
                <div style={{ fontSize: "13px", color: "#555" }}>{p.psicologo}</div>

                {/* Última consulta */}
                <div style={{ fontSize: "13px", color: "#555" }}>{p.ultima}</div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {p.temProntuario ? (
                    <button
                      onClick={() => navigate(`/prontuario/${p.prontuarioId}`)}
                      style={{
                        padding: "6px 14px",
                        background: "#EBF3FF",
                        border: "none",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#1A4FA3",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      Visualizar
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/prontuario/novo?paciente=${p.id}`)}
                      style={{
                        padding: "6px 14px",
                        background: "#E8F5EE",
                        border: "none",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#2A8A55",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#c8ecd8"}
                      onMouseLeave={e => e.currentTarget.style.background = "#E8F5EE"}
                    >
                      Cadastrar Prontuário
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Count footer + pagination */}
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