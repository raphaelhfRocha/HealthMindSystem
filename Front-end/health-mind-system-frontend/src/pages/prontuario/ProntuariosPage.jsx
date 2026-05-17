import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES = [
  { id: 1,  nome: "Ana Clara Souza",   idade: 28, psicologo: "Dr. Marcos", ultima: "05/05/2026", temProntuario: true  },
  { id: 2,  nome: "Bruno Mendes",      idade: 34, psicologo: "Dra. Carla", ultima: "11/05/2026", temProntuario: true  },
  { id: 3,  nome: "Carla Ferreira",    idade: 22, psicologo: "Dr. Marcos", ultima: "11/05/2026", temProntuario: false },
  { id: 4,  nome: "Diego Almeida",     idade: 41, psicologo: "Dra. Carla", ultima: "14/05/2026", temProntuario: true  },
  { id: 5,  nome: "Eduarda Lima",      idade: 30, psicologo: "Dr. Marcos", ultima: "19/05/2026", temProntuario: false },
  { id: 6,  nome: "Felipe Costa",      idade: 25, psicologo: "Dra. Carla", ultima: "19/05/2026", temProntuario: true  },
  { id: 7,  nome: "Gabriela Nunes",    idade: 37, psicologo: "Dr. Marcos", ultima: "22/05/2026", temProntuario: false },
  { id: 8,  nome: "Henrique Rocha",    idade: 29, psicologo: "Dra. Carla", ultima: "26/05/2026", temProntuario: true  },
  { id: 9,  nome: "Isabela Martins",   idade: 45, psicologo: "Dr. Marcos", ultima: "26/05/2026", temProntuario: true  },
  { id: 10, nome: "João Pedro Silva",  idade: 33, psicologo: "Dra. Carla", ultima: "28/05/2026", temProntuario: true  },
];

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

  const filtrados = PACIENTES.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none"/>
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
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
            {["Paciente", "Idade", "Psicólogo", "Última Consulta", "Ações"].map(h => (
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
            filtrados.map((p, i) => (
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
                    background: AVATAR_COLORS[p.id % AVATAR_COLORS.length],
                    color: "white", fontSize: "12px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {getInitials(p.nome)}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{p.nome}</span>
                </div>

                {/* Idade */}
                <div style={{ fontSize: "13px", color: "#555" }}>{p.idade} anos</div>

                {/* Psicólogo */}
                <div style={{ fontSize: "13px", color: "#555" }}>{p.psicologo}</div>

                {/* Última consulta */}
                <div style={{ fontSize: "13px", color: "#555" }}>{p.ultima}</div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {p.temProntuario ? (
                    <button
                      onClick={() => navigate(`/prontuario/${p.id}`)}
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

        {/* Count footer */}
        <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
          {filtrados.length} {filtrados.length === 1 ? "paciente encontrado" : "pacientes encontrados"}
        </div>
      </div>
    </AppLayout>
  );
}