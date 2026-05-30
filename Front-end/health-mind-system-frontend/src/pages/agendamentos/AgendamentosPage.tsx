import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

export default function AgendamentosPage() {
  const navigate = useNavigate();

  return (
    <AppLayout breadcrumb="Agendamentos >">
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: "580px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        minHeight: "320px",
        justifyContent: "center",
      }}>
        <button
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "18px 24px",
            background: "#4FC3D8",
            border: "none",
            borderRadius: "40px",
            color: "white",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "filter 0.15s, transform 0.15s",
            boxShadow: "0 4px 14px rgba(79,195,216,0.35)",
          }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.08)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => navigate("/agendamentos/realizar")}
        >
          Realizar Agendamento
        </button>

        <button
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "18px 24px",
            background: "#1A4FA3",
            border: "none",
            borderRadius: "40px",
            color: "white",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "filter 0.15s, transform 0.15s",
            boxShadow: "0 4px 14px rgba(26,79,163,0.3)",
          }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => navigate("/agendamentos/consultar")}
        >
          Consultar Agendamento
        </button>
      </div>
    </AppLayout>
  );
}