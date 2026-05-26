import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PSICOLOGOS_MOCK = {
  1: { nome: "Dr. Marcos Oliveira",   email: "marcos.oliveira@healthmind.com", cpfCnpj: "111.222.333-44", crp: "06/98765", especialidade: "Terapia Cognitivo-Comportamental" },
  2: { nome: "Dra. Carla Mendonça",   email: "carla.mendonca@healthmind.com",  cpfCnpj: "222.333.444-55", crp: "06/87654", especialidade: "Psicanálise"                      },
  3: { nome: "Dr. Rafael Souza",      email: "rafael.souza@healthmind.com",    cpfCnpj: "333.444.555-66", crp: "06/76543", especialidade: "Psicologia Clínica"               },
  4: { nome: "Dra. Ana Beatriz Lima", email: "ana.lima@healthmind.com",        cpfCnpj: "444.555.666-77", crp: "06/65432", especialidade: "Neuropsicologia"                  },
};

export default function EditarPsicologoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const psicologo = PSICOLOGOS_MOCK[Number(id)];

  const [form, setForm] = useState(
    psicologo
      ? { nome: psicologo.nome, email: psicologo.email, cpfCnpj: psicologo.cpfCnpj, crp: psicologo.crp, especialidade: psicologo.especialidade }
      : { nome: "", email: "", cpfCnpj: "", crp: "", especialidade: "" }
  );

  if (!psicologo) {
    return (
      <AppLayout breadcrumb="Psicólogos >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Psicólogo não encontrado.
          <br />
          <button onClick={() => navigate("/psicologos")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  const inputStyle = {
    height: "40px", border: "1px solid #dde3f0", borderRadius: "10px",
    padding: "0 12px", fontSize: "14px", outline: "none",
    boxSizing: "border-box", width: "100%", fontFamily: "inherit", color: "#1a1a1a",
  };
  const focusBlue = e => e.target.style.borderColor = "#1A4FA3";
  const blurGray  = e => e.target.style.borderColor = "#dde3f0";

  const Field = ({ label, field, placeholder, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        style={inputStyle}
        onFocus={focusBlue}
        onBlur={blurGray}
      />
    </div>
  );

  return (
    <AppLayout breadcrumb="Psicólogos >">
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/psicologos")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>
            Editar Psicólogo
          </h1>
        </div>

        {/* Form card */}
        <div style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Psicólogo</h2>

          <Field label="Nome Completo *"  field="nome"         placeholder="Ex: Dr. João da Silva" />
          <Field label="Especialidade"    field="especialidade" placeholder="Ex: Terapia Cognitivo-Comportamental" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="CPF / CNPJ"    field="cpfCnpj"      placeholder="000.000.000-00" />
            <Field label="CRP"           field="crp"          placeholder="Ex: 06/12345" />
          </div>
          <Field label="E-mail"          field="email"        placeholder="email@exemplo.com" type="email" />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={() => navigate("/psicologos")}
            style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => navigate("/psicologos")}
            disabled={!form.nome.trim()}
            style={{ padding: "10px 22px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !form.nome.trim() ? "not-allowed" : "pointer", opacity: !form.nome.trim() ? 0.5 : 1 }}
            onMouseEnter={e => { if (form.nome.trim()) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
