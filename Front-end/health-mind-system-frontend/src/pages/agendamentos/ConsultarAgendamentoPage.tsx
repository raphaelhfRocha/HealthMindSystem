import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const DIAS_SEMANA_FULL = ["Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado","Domingo"];

// Dados mockados de agendamentos
// Chave: "YYYY-MM-DD" → lista de agendamentos
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

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function ConsultarAgendamentoPage() {
  const navigate = useNavigate();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // Start week on Monday: Sun=0 → offset 6, Mon=1 → offset 0, ...
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const hasAppointments = (d) => {
    const key = toKey(viewYear, viewMonth, d);
    return AGENDAMENTOS_MOCK[key] && AGENDAMENTOS_MOCK[key].length > 0;
  };

  const appointmentCount = (d) => {
    const key = toKey(viewYear, viewMonth, d);
    return AGENDAMENTOS_MOCK[key]?.length || 0;
  };

  const handleDayClick = (d) => {
    if (!d) return;
    const key = toKey(viewYear, viewMonth, d);
    navigate(`/agendamentos/dia/${key}`);
  };

  // Build grid cells: leading empty + day numbers + trailing empty to complete last row
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <AppLayout breadcrumb="Agendamentos > Agenda do Dia">
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "1.5rem 2rem 2rem",
        width: "100%",
        maxWidth: "780px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "700",
          color: "#111",
          marginBottom: "1.5rem",
        }}>
          Consultar Agendamento
        </h1>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            onClick={prevMonth}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#1A4FA3", padding: "4px 10px", borderRadius: "6px" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >‹</button>
          <span style={{ fontSize: "17px", fontWeight: "700", color: "#1A4FA3" }}>
            {MESES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#1A4FA3", padding: "4px 10px", borderRadius: "6px" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >›</button>
        </div>

        {/* Calendar grid */}
        <div style={{
          border: "1px solid #dde3f0",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {DIAS_SEMANA_FULL.map(d => (
              <div key={d} style={{
                background: "#1A4FA3",
                color: "white",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: "600",
                padding: "8px 4px",
                borderRight: "1px solid rgba(255,255,255,0.15)",
              }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <div key={row} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {cells.slice(row * 7, row * 7 + 7).map((d, col) => {
                const hasAppt = d && hasAppointments(d);
                const count = d ? appointmentCount(d) : 0;
                const todayCell = d && isToday(d);
                const isCurrentMonth = !!d;

                return (
                  <div
                    key={col}
                    onClick={() => hasAppt && handleDayClick(d)}
                    style={{
                      minHeight: "72px",
                      padding: "6px 8px",
                      borderRight: col < 6 ? "1px solid #e8ecf5" : "none",
                      borderBottom: row < cells.length / 7 - 1 ? "1px solid #e8ecf5" : "none",
                      background: !isCurrentMonth ? "#f5f5f5" : todayCell ? "#EBF3FF" : "white",
                      cursor: hasAppt ? "pointer" : "default",
                      transition: "background 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={e => { if (hasAppt) e.currentTarget.style.background = "#ddeeff"; }}
                    onMouseLeave={e => { if (hasAppt) e.currentTarget.style.background = todayCell ? "#EBF3FF" : "white"; }}
                  >
                    {/* Day number */}
                    {d && (
                      <div style={{
                        fontSize: "13px",
                        fontWeight: todayCell ? "700" : "400",
                        color: !isCurrentMonth ? "#ccc" : todayCell ? "#1A4FA3" : "#333",
                        marginBottom: "4px",
                      }}>
                        {d}
                        {todayCell && (
                          <span style={{
                            display: "inline-block",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "#4FC3D8",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "700",
                            textAlign: "center",
                            lineHeight: "22px",
                            marginLeft: "4px",
                          }}>{d}</span>
                        )}
                      </div>
                    )}

                    {/* Appointment indicator */}
                    {hasAppt && (
                      <div style={{
                        background: "#1A4FA3",
                        borderRadius: "6px",
                        padding: "2px 6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "white",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                        <span style={{
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: "#4FC3D8", display: "inline-block", flexShrink: 0,
                        }}/>
                        {count} {count === 1 ? "agend." : "agend."}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "14px", fontSize: "12px", color: "#666" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#1A4FA3" }}/>
            <span>Dia com agendamento (clique para ver)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#4FC3D8" }}/>
            <span>Hoje</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}