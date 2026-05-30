import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES_DATA = {
  1:  { nomeCompleto: "Ana Clara Souza",   nascimento: "12/03/1998", cpf: "123.456.789-00", telefone: "(11) 96985-8216", email: "ana.clara@email.com",   plano: "Particular",     psicologo: "Dr. Marcos"  },
  2:  { nomeCompleto: "Bruno Mendes",      nascimento: "07/11/1990", cpf: "234.567.890-11", telefone: "(11) 91234-5678", email: "bruno.m@email.com",      plano: "Unimed",         psicologo: "Dra. Carla"  },
  3:  { nomeCompleto: "Carla Ferreira",    nascimento: "22/06/2002", cpf: "345.678.901-22", telefone: "(21) 98877-6655", email: "carla.f@email.com",      plano: "Bradesco Saúde", psicologo: "Dr. Marcos"  },
  4:  { nomeCompleto: "Diego Almeida",     nascimento: "15/01/1983", cpf: "456.789.012-33", telefone: "(31) 97766-5544", email: "diego.almeida@email.com", plano: "Amil",           psicologo: "Dra. Carla"  },
  5:  { nomeCompleto: "Eduarda Lima",      nascimento: "30/09/1994", cpf: "567.890.123-44", telefone: "(11) 95544-3322", email: "edu.lima@email.com",      plano: "Particular",     psicologo: "Dr. Marcos"  },
  6:  { nomeCompleto: "Felipe Costa",      nascimento: "18/04/1999", cpf: "678.901.234-55", telefone: "(41) 94433-2211", email: "felipe.c@email.com",      plano: "SulAmérica",     psicologo: "Dra. Carla"  },
  7:  { nomeCompleto: "Gabriela Nunes",    nascimento: "03/12/1987", cpf: "789.012.345-66", telefone: "(51) 93322-1100", email: "gabi.nunes@email.com",    plano: "Unimed",         psicologo: "Dr. Marcos"  },
  8:  { nomeCompleto: "Henrique Rocha",    nascimento: "27/07/1995", cpf: "890.123.456-77", telefone: "(85) 92211-0099", email: "henri.r@email.com",       plano: "Particular",     psicologo: "Dra. Carla"  },
  9:  { nomeCompleto: "Isabela Martins",   nascimento: "14/02/1979", cpf: "901.234.567-88", telefone: "(11) 91100-9988", email: "isa.martins@email.com",   plano: "Porto Seguro",   psicologo: "Dr. Marcos"  },
  10: { nomeCompleto: "João Pedro Silva",  nascimento: "05/05/1997", cpf: "012.345.678-99", telefone: "(11) 96985-8216", email: "joao.pedro@email.com",    plano: "Bradesco Saúde", psicologo: "Dra. Carla"  },
};

const inputStyle = {
  width: "100%", height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", color: "#1a1a1a", outline: "none",
  background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
};

function Field({ label, value, onChange, readOnly = false, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        style={{ ...inputStyle, background: readOnly ? "#f5f5f5" : "white", color: readOnly ? "#aaa" : "#1a1a1a", cursor: readOnly ? "not-allowed" : "text" }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = "#1A4FA3"; }}
        onBlur={e => { e.target.style.borderColor = "#dde3f0"; }}
      />
    </div>
  );
}

export default function EditarProntuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const original = PACIENTES_DATA[Number(id)];
  const [form, setForm] = useState(original ? { ...original } : null);
  const [saved, setSaved] = useState(false);

  if (!original || !form) {
    return (
      <AppLayout breadcrumb="Prontuário > Editar">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Paciente não encontrado.</div>
      </AppLayout>
    );
  }

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate(`/prontuario/${id}`); }, 1500);
  };

  return (
    <AppLayout breadcrumb="Prontuário > Editar">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

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
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Editar — Informações do Paciente</h1>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: saved ? "#3BB077" : "#1A4FA3", border: "none", borderRadius: "20px",
              padding: "9px 22px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background 0.3s",
            }}
          >
            {saved ? "✓ Salvo!" : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Salvar</>}
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Informações do Paciente</h2>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <Field label="Nome Completo"      value={form.nomeCompleto} onChange={set("nomeCompleto")} />
            <Field label="Data de Nascimento" value={form.nascimento}   onChange={set("nascimento")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="CPF"      value={form.cpf}      readOnly />
            <Field label="Telefone" value={form.telefone} onChange={set("telefone")} type="tel" />
          </div>
          <div style={{ borderTop: "1px solid #eef0f6" }} />
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="E-mail"                value={form.email}     onChange={set("email")} type="email" />
            <Field label="Plano de Saúde"        value={form.plano}     onChange={set("plano")} />
            <Field label="Psicólogo Responsável" value={form.psicologo} onChange={set("psicologo")} />
          </div>
          <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>* O CPF não pode ser alterado após o cadastro.</p>
        </div>
      </div>
    </AppLayout>
  );
}