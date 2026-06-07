import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { editarProntuario, getProntuarioById } from "../../shared/services/prontuario.service";
import { ProntuarioDTO } from "../../shared/types/dtos/Prontuario.dto";

export default function EditarAnotacoesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prontuario, setProntuario] = useState<ProntuarioDTO | null>(null);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        setError("Prontuário não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const prontuarioCarregado = await getProntuarioById(id);
        if (!active) return;
        setProntuario(prontuarioCarregado);
        setTexto(prontuarioCarregado.anotacoes ?? "");
      } catch {
        if (active) setError("Anotações não encontradas.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    if (!prontuario) return;

    try {
      const payload: ProntuarioDTO = {
        ...prontuario,
        anotacoes: texto,
      };

      await editarProntuario(prontuario.id ?? id ?? "", payload);
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate(`/prontuario/${prontuario.id ?? id}`); }, 1500);
    } catch {
      setError("Não foi possível salvar as anotações.");
    }
  };

  if (loading) {
    return (
      <AppLayout breadcrumb="Prontuário > Anotações > Editar">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando anotações...</div>
      </AppLayout>
    );
  }

  if (!prontuario) {
    return (
      <AppLayout breadcrumb="Prontuário > Anotações > Editar">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>{error ?? "Anotações não encontradas."}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb="Prontuário > Anotações > Editar">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(`/prontuario/${prontuario.id ?? id}`)}
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

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
              {error}
            </div>
          )}

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