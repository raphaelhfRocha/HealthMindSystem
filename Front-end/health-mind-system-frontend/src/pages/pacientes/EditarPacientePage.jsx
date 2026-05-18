import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES_MOCK = {
  1:  { nome: "Ana Clara Souza",  email: "ana.clara@email.com",    cpf: "123.456.789-00", nascimento: "12/03/1998" },
  2:  { nome: "Bruno Mendes",     email: "bruno.m@email.com",      cpf: "234.567.890-11", nascimento: "07/11/1990" },
  3:  { nome: "Carla Ferreira",   email: "carla.f@email.com",      cpf: "345.678.901-22", nascimento: "22/06/2002" },
  4:  { nome: "Diego Almeida",    email: "diego.almeida@email.com", cpf: "456.789.012-33", nascimento: "15/01/1983" },
  5:  { nome: "Eduarda Lima",     email: "edu.lima@email.com",     cpf: "567.890.123-44", nascimento: "30/09/1994" },
  6:  { nome: "Felipe Costa",     email: "felipe.c@email.com",     cpf: "678.901.234-55", nascimento: "18/04/1999" },
  7:  { nome: "Gabriela Nunes",   email: "gabi.nunes@email.com",   cpf: "789.012.345-66", nascimento: "03/12/1987" },
  8:  { nome: "Henrique Rocha",   email: "henri.r@email.com",      cpf: "890.123.456-77", nascimento: "27/07/1995" },
  9:  { nome: "Isabela Martins",  email: "isa.martins@email.com",  cpf: "901.234.567-88", nascimento: "14/02/1979" },
  10: { nome: "João Pedro Silva", email: "joao.pedro@email.com",   cpf: "012.345.678-99", nascimento: "05/05/1997" },
};

export default function EditarPacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paciente = PACIENTES_MOCK[Number(id)];

  const [form, setForm] = useState(
    paciente
      ? { nome: paciente.nome, email: paciente.email, cpf: paciente.cpf, nascimento: paciente.nascimento }
      : { nome: "", email: "", cpf: "", nascimento: "" }
  );

  if (!paciente) {
    return (
      <AppLayout breadcrumb="Pacientes >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Paciente não encontrado.
          <br />
          <button onClick={() => navigate("/paciente")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
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
    <AppLayout breadcrumb="Pacientes >">
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/paciente")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>
            Editar Paciente
          </h1>
        </div>

        {/* Form card */}
        <div style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>
            Dados do Paciente
          </h2>

          <Field label="Nome Completo *"     field="nome"       placeholder="Nome completo do paciente" />
          <Field label="CPF"                 field="cpf"        placeholder="000.000.000-00" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="E-mail"            field="email"      placeholder="email@exemplo.com" type="email" />
            <Field label="Data de Nascimento" field="nascimento" placeholder="DD/MM/AAAA" />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={() => navigate("/paciente")}
            style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => navigate("/paciente")}
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
