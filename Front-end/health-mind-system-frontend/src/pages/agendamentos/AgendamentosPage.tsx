import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllSessoes } from "../../shared/services/sessao.service";
import { extractDateKey } from "../../shared/utils/sessao";
import { usePermissions } from "../../shared/hooks/usePermissions";
import { useCurrentPsicologoId } from "../../shared/hooks/useCurrentPsicologo";

export default function AgendamentosPage() {
  const navigate = useNavigate();
  const { isPsicologo } = usePermissions();
  const { psicologoId } = useCurrentPsicologoId();
  const [totalSessoes, setTotalSessoes] = useState(0);
  const [sessoesHoje, setSessoesHoje] = useState(0);
  const [loadingResumo, setLoadingResumo] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarResumo() {
      try {
        setLoadingResumo(true);
        const todasSessoes = await getAllSessoes();

        if (!isActive) {
          return;
        }

        // Psicólogo enxerga apenas as próprias sessões.
        const sessoes = isPsicologo
          ? todasSessoes.filter(sessao => sessao.psicologoId === psicologoId)
          : todasSessoes;

        const hojeKey = extractDateKey(new Date());
        setTotalSessoes(sessoes.length);
        setSessoesHoje(sessoes.filter(sessao => extractDateKey(sessao.dataSessao) === hojeKey).length);
      } catch {
        if (isActive) {
          setError("Não foi possível carregar o resumo das sessões.");
        }
      } finally {
        if (isActive) {
          setLoadingResumo(false);
        }
      }
    }

    carregarResumo();

    return () => {
      isActive = false;
    };
  }, [isPsicologo, psicologoId]);

  return (
    <AppLayout breadcrumb="Agendamentos >">
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "760px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ display: "flex", textAlign: "center", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Agendamentos</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "16px"  }}>
          {/* Psicólogo possui acesso somente à consulta de agendamentos. */}
          {!isPsicologo && (
            <button
              style={{
                width: "100%",
                maxWidth: "520px",
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
          )}
          <button
            style={{
              width: "100%",
              maxWidth: "520px",
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

        {error && (
          <div style={{ padding: "12px 14px", borderRadius: "12px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "13px" }}>
            {error}
          </div>
        )}
      </div>
    </AppLayout>
  );
}