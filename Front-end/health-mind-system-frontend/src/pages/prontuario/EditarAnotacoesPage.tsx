import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const ANOTACOES_MOCK = {
  1:  "Paciente demonstra dificuldade em estabelecer limites em relacionamentos interpessoais. Apresenta padrão de autoexigência elevada.",
  2:  "Relata episódios de ansiedade antecipatória. Boa adesão ao processo terapêutico. Comprometido com as sessões.",
  3:  "Histórico de luto recente (perda do pai). Processo de elaboração em andamento. Rede de apoio familiar presente.",
  4:  "Queixas relacionadas ao ambiente de trabalho. Sinais de esgotamento profissional. Avaliar critérios de burnout.",
  5:  "Paciente relata melhora significativa nos episódios de insônia após técnicas de higiene do sono introduzidas na última sessão.",
  6:  "Dificuldade em lidar com críticas. Padrão de comportamento defensivo observado. Trabalhar autoestima e assertividade.",
  7:  "Relacionamento conjugal instável relatado. Considera terapia de casal. Encaminhar para avaliação conjunta.",
  8:  "Boa evolução no manejo da raiva. Técnicas de regulação emocional sendo aplicadas com sucesso no cotidiano.",
  9:  "Histórico de transtorno de ansiedade generalizada. Faz uso de medicação prescrita por psiquiatra. Acompanhamento conjunto.",
  10: "Percebo uma resistência ao falar sobre a figura paterna. João parece evitar contato visual quando o assunto é o chefe. Hipótese de transferência a ser explorada na próxima sessão.",
};

export default function EditarAnotacoesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [texto, setTexto] = useState(ANOTACOES_MOCK[Number(id)] || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate(`/prontuario/${id}`); }, 1500);
  };

  return (
    <AppLayout breadcrumb="Prontuário > Anotações > Editar">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(`/prontuario/${id}`)}
              style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              ‹ Cancelar
            </button>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>
              Editar — Anotações
            </h1>
          </div>

          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: saved ? "#3BB077" : "#1A4FA3",
              border: "none", borderRadius: "20px", padding: "9px 22px",
              color: "white", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "background 0.3s",
            }}
            onMouseEnter={e => { if (!saved) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            {saved ? "✓ Salvo!" : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Salvar
              </>
            )}
          </button>
        </div>

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: "14px", padding: "24px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Anotações</h2>

          {/* Privacy notice */}
          <div style={{
            background: "#FFF8E6", border: "1px solid #FFD97D", borderRadius: "8px",
            padding: "10px 14px", fontSize: "12px", color: "#856404",
            display: "flex", alignItems: "flex-start", gap: "8px",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="10" stroke="#856404" strokeWidth="2" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#856404" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#856404"/>
            </svg>
            <span>
              Este campo contém impressões subjetivas do psicólogo e <strong>não compõe o prontuário oficial</strong> do paciente.
              Recomenda-se criptografia adicional ou bloqueio visual.
            </span>
          </div>

          {/* Label + textarea */}
          <div>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: "700", color: "#888",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px",
            }}>
              Notas do Psicólogo (Privado)
            </label>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escreva suas anotações privadas sobre o paciente aqui..."
              style={{
                width: "100%", minHeight: "260px", border: "1px solid #dde3f0",
                borderRadius: "10px", padding: "14px", fontSize: "14px", color: "#1a1a1a",
                lineHeight: "1.8", resize: "vertical", outline: "none",
                fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#1A4FA3"}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
            <div style={{ textAlign: "right", fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
              {texto.length} caractere{texto.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}