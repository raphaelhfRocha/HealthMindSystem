import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES = [
  "Ana Clara Souza",
  "Bruno Mendes",
  "Carla Ferreira",
  "Diego Almeida",
  "Eduarda Lima",
  "Felipe Costa",
  "Gabriela Nunes",
  "Henrique Rocha",
  "Isabela Martins",
  "João Pedro Silva",
];

const HORARIOS = Array.from({ length: 27 }, (_, i) => {
  const totalMin = 7 * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}).filter(h => h <= "20:00");

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so week starts on Monday (0=Mon...6=Sun)
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) =>
    d && selectedDate &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const isToday = (d) =>
    d &&
    today.getDate() === d &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  return (
    <div style={{
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "12px",
      width: "260px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      userSelect: "none",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A4FA3", padding: "2px 6px" }}>‹</button>
        <span style={{ fontWeight: "700", fontSize: "14px", color: "#1A4FA3" }}>
          {MESES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A4FA3", padding: "2px 6px" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {DIAS_SEMANA.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "600", color: "#888", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => (
          <div
            key={i}
            onClick={() => d && onSelect(new Date(viewYear, viewMonth, d))}
            style={{
              textAlign: "center",
              fontSize: "12px",
              padding: "5px 2px",
              borderRadius: "6px",
              cursor: d ? "pointer" : "default",
              background: isSelected(d) ? "#1A4FA3" : isToday(d) ? "#e8f0fd" : "transparent",
              color: isSelected(d) ? "white" : isToday(d) ? "#1A4FA3" : d ? "#333" : "transparent",
              fontWeight: isSelected(d) || isToday(d) ? "700" : "400",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => { if (d && !isSelected(d)) e.currentTarget.style.background = "#f0f4ff"; }}
            onMouseLeave={e => { if (d && !isSelected(d)) e.currentTarget.style.background = isToday(d) ? "#e8f0fd" : "transparent"; }}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  height: "38px",
  border: "none",
  borderRadius: "20px",
  background: "#D9D9D9",
  padding: "0 36px 0 14px",
  fontSize: "14px",
  outline: "none",
  color: "#333",
  appearance: "none",
  cursor: "pointer",
};

const labelStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#222",
  minWidth: "130px",
  flexShrink: 0,
};

const fieldRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  position: "relative",
};

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", right: "12px", pointerEvents: "none" }}>
    <path d="M4 6L8 10L12 6" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function RealizarAgendamentoPage() {
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCal, setShowCal] = useState(false);
  const [horario, setHorario] = useState("");
  const [saved, setSaved] = useState(false);

  const formatDate = (d) => {
    if (!d) return "";
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  };

  const handleSave = () => {
    if (!paciente || !selectedDate || !horario) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/agendamentos");
    }, 1800);
  };

  return (
    <AppLayout breadcrumb="Agendamentos > Agenda do Dia">
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2rem 2.5rem 2.5rem",
        width: "100%",
        maxWidth: "640px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "700",
          color: "#111",
          marginBottom: "2rem",
        }}>
          Realizar Agendamento
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* Nome do Paciente */}
          <div style={fieldRow}>
            <span style={labelStyle}>Nome do Paciente</span>
            <div style={{ flex: 1, position: "relative" }}>
              <select
                value={paciente}
                onChange={e => setPaciente(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>Selecione...</option>
                {PACIENTES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Data */}
          <div style={{ ...fieldRow, alignItems: "flex-start" }}>
            <span style={{ ...labelStyle, paddingTop: "8px" }}>Data</span>
            <div style={{ flex: 1 }}>
              {/* Trigger button */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowCal(v => !v)}
                  style={{
                    width: "100%",
                    height: "38px",
                    border: "none",
                    borderRadius: "20px",
                    background: "#D9D9D9",
                    padding: "0 36px 0 14px",
                    fontSize: "14px",
                    color: selectedDate ? "#333" : "#888",
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {selectedDate ? formatDate(selectedDate) : "Selecione a data..."}
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="#1A4FA3" strokeWidth="2" fill="none"/>
                  <line x1="7" y1="3" x2="7" y2="7" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="17" y1="3" x2="17" y2="7" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="#1A4FA3" strokeWidth="2"/>
                </svg>
              </div>

              {/* Calendar popup */}
              {showCal && (
                <div style={{ marginTop: "8px", zIndex: 50 }}>
                  <MiniCalendar
                    selectedDate={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setShowCal(false); }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Horário */}
          <div style={fieldRow}>
            <span style={labelStyle}>Horário</span>
            <div style={{ flex: 1, position: "relative" }}>
              <select
                value={horario}
                onChange={e => setHorario(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>Selecione...</option>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "2.5rem", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/agendamentos")}
            style={{
              padding: "10px 28px",
              background: "#e0e0e0",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#555",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 28px",
              background: saved ? "#3BB077" : "#1A4FA3",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            {saved ? "✓ Salvo!" : "Salvar Agendamento"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}