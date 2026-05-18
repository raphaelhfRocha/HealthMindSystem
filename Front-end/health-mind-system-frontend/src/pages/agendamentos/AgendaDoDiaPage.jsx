import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const DIAS_SEMANA = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];

// Mesmo mock da ConsultarAgendamentoPage (em produção viria de contexto/API)
const AGENDAMENTOS_MOCK = {
  "2026-05-05": [
    { paciente: "Ana Clara Souza",  horario: "09:00", psicologo: "Dr. Marcos" },
    { paciente: "Bruno Mendes",     horario: "10:30", psicologo: "Dra. Carla" },
  ],
  "2026-05-11": [
    { paciente: "Carla Ferreira",   horario: "08:00", psicologo: "Dr. Marcos" },
    { paciente: "Diego Almeida",    horario: "14:00", psicologo: "Dra. Carla" },
    { paciente: "Eduarda Lima",     horario: "15:30", psicologo: "Dr. Marcos" },
  ],
  "2026-05-14": [
    { paciente: "Felipe Costa",     horario: "11:00", psicologo: "Dra. Carla" },
  ],
  "2026-05-19": [
    { paciente: "Gabriela Nunes",   horario: "09:30", psicologo: "Dr. Marcos" },
    { paciente: "Henrique Rocha",   horario: "13:00", psicologo: "Dra. Carla" },
  ],
  "2026-05-22": [
    { paciente: "Isabela Martins",  horario: "10:00", psicologo: "Dr. Marcos" },
  ],
  "2026-05-26": [
    { paciente: "João Pedro Silva", horario: "08:30", psicologo: "Dra. Carla" },
    { paciente: "Ana Clara Souza",  horario: "16:00", psicologo: "Dr. Marcos" },
  ],
  "2026-05-28": [
    { paciente: "Bruno Mendes",     horario: "07:30", psicologo: "Dra. Carla" },
    { paciente: "Diego Almeida",    horario: "11:30", psicologo: "Dr. Marcos" },
    { paciente: "Carla Ferreira",   horario: "14:30", psicologo: "Dra. Carla" },
  ],
};

function formatDateLabel(dateStr) {
  // dateStr: "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const diaSemana = DIAS_SEMANA[date.getDay()];
  const mes = MESES[month - 1];
  return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${day} de ${mes} de ${year}`;
}

export default function AgendaDoDiaPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const agendamentos = AGENDAMENTOS_MOCK[date] || [];
  const dateLabel = formatDateLabel(date);

  return (
    <AppLayout breadcrumb={`Agendamentos > Consultar > ${date}`}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "1.5rem 2rem 2rem",
        width: "100%",
        maxWidth: "680px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        {/* Header */}
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

        {/* Count badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#EBF3FF", borderRadius: "20px", padding: "4px 14px",
          marginBottom: "1.2rem",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1A4FA3" }}/>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A4FA3" }}>
            {agendamentos.length} {agendamentos.length === 1 ? "agendamento" : "agendamentos"}
          </span>
        </div>

        {/* List */}
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
                key={i}
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
                {/* Time badge */}
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
                  {ag.horario}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "3px" }}>
                    {ag.paciente}
                  </div>
                  <div style={{ fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="2" fill="none"/>
                      <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="#999" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                    {ag.psicologo}
                  </div>
                </div>

                {/* Status pill */}
                <div style={{
                  background: "#E8F5EE",
                  color: "#2A8A55",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  flexShrink: 0,
                }}>
                  Confirmado
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer action */}
        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/agendamentos/realizar")}
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
      </div>
    </AppLayout>
  );
}