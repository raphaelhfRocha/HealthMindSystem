import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const CONTATOS_EMERGENCIA = {
  1:  { nome: "Carlos Souza",                telefone: "(11) 97777-1111", relacao: "Pai",     endereco: "Rua das Flores, 123, Jardim Primavera",    cep: "01234-567" },
  2:  { nome: "Fernanda Mendes",             telefone: "(11) 96666-2222", relacao: "Esposa",  endereco: "Av. Brasil, 456, Centro",                  cep: "02345-678" },
  3:  { nome: "Paulo Ferreira",              telefone: "(21) 95555-3333", relacao: "Irmão",   endereco: "Rua do Comércio, 78, Tijuca",              cep: "03456-789" },
  4:  { nome: "Mariana Almeida",             telefone: "(31) 94444-4444", relacao: "Mãe",     endereco: "Rua São Paulo, 910, Savassi",              cep: "04567-890" },
  5:  { nome: "Roberto Lima",                telefone: "(11) 93333-5555", relacao: "Pai",     endereco: "Rua das Palmeiras, 12, Moema",             cep: "05678-901" },
  6:  { nome: "Juliana Costa",               telefone: "(41) 92222-6666", relacao: "Mãe",     endereco: "Rua XV de Novembro, 34, Batel",            cep: "06789-012" },
  7:  { nome: "Ricardo Nunes",               telefone: "(51) 91111-7777", relacao: "Cônjuge", endereco: "Av. Ipiranga, 56, Moinhos de Vento",      cep: "07890-123" },
  8:  { nome: "Sandra Rocha",                telefone: "(85) 90000-8888", relacao: "Mãe",     endereco: "Rua Dragão do Mar, 89, Meireles",          cep: "08901-234" },
  9:  { nome: "Eduardo Martins",             telefone: "(11) 99999-9999", relacao: "Filho",   endereco: "Rua Augusta, 101, Consolação",             cep: "09012-345" },
  10: { nome: "Daniel Silva Santos Carneiro",telefone: "(11) 90691-6969", relacao: "Pai",     endereco: "Rua dos Três Reis, Parque Novo Mundo",     cep: "06958-192" },
};

const inputStyle = {
  width: "100%", height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", color: "#1a1a1a", outline: "none",
  background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
};

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = "#1A4FA3"}
        onBlur={e => e.target.style.borderColor = "#dde3f0"}
      />
    </div>
  );
}

export default function EditarContatoEmergenciaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const original = CONTATOS_EMERGENCIA[Number(id)];
  const [form, setForm] = useState(original ? { ...original } : null);
  const [saved, setSaved] = useState(false);

  if (!original || !form) {
    return (
      <AppLayout breadcrumb="Prontuário > Editar Contato">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Contato não encontrado.</div>
      </AppLayout>
    );
  }

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate(`/prontuario/${id}`); }, 1500);
  };

  return (
    <AppLayout breadcrumb="Prontuário > Editar Contato de Emergência">
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
              Editar — Contato de Emergência
            </h1>
          </div>

          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: saved ? "#3BB077" : "#1A4FA3", border: "none", borderRadius: "20px",
              padding: "9px 22px", color: "white", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "background 0.3s",
            }}
          >
            {saved
              ? "✓ Salvo!"
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Salvar</>
            }
          </button>
        </div>

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: "14px", padding: "24px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>
            Contato de Emergência
          </h2>

          {/* Row 1: nome, telefone, relação */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="Nome"               value={form.nome}     onChange={set("nome")}     />
            <Field label="Telefone"           value={form.telefone} onChange={set("telefone")} type="tel" />
            <Field label="Relação/Parentesco" value={form.relacao}  onChange={set("relacao")}  />
          </div>

          <div style={{ borderTop: "1px solid #eef0f6" }} />

          {/* Row 2: endereço, cep */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <Field label="Endereço" value={form.endereco} onChange={set("endereco")} />
            <Field label="CEP"      value={form.cep}      onChange={set("cep")}      />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}