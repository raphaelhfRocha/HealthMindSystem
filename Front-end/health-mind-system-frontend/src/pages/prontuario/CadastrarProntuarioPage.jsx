import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES_PREFILL = {
  3:  { nomeCompleto: "Carla Ferreira",  nascimento: "22/06/2002", cpf: "345.678.901-22", telefone: "(21) 98877-6655", email: "carla.f@email.com"    },
  5:  { nomeCompleto: "Eduarda Lima",    nascimento: "30/09/1994", cpf: "567.890.123-44", telefone: "(11) 95544-3322", email: "edu.lima@email.com"    },
  7:  { nomeCompleto: "Gabriela Nunes",  nascimento: "03/12/1987", cpf: "789.012.345-66", telefone: "(51) 93322-1100", email: "gabi.nunes@email.com"  },
};

const PSICOLOGOS = [
  "Dr. Marcos Oliveira",
  "Dra. Carla Mendonça",
  "Dr. Rafael Souza",
  "Dra. Ana Beatriz Lima",
];

const PLANOS = ["Particular", "Unimed", "Bradesco Saúde", "Amil", "SulAmérica", "Porto Seguro", "Outro"];

const inputStyle = {
  width: "100%", height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", color: "#1a1a1a", outline: "none",
  background: "white", boxSizing: "border-box", fontFamily: "inherit",
};

function Field({ label, value, onChange, readOnly = false, type = "text", required = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: "#e05050", marginLeft: "2px" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        style={{ ...inputStyle, background: readOnly ? "#f5f5f5" : "white", color: readOnly ? "#999" : "#1a1a1a", cursor: readOnly ? "not-allowed" : "text" }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = "#1A4FA3"; }}
        onBlur={e => { e.target.style.borderColor = "#dde3f0"; }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: "#e05050", marginLeft: "2px" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, cursor: "pointer" }}
        onFocus={e => e.target.style.borderColor = "#1A4FA3"}
        onBlur={e => e.target.style.borderColor = "#dde3f0"}
      >
        <option value="">Selecione...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function CadastrarProntuarioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteId = Number(searchParams.get("paciente"));
  const prefill = PACIENTES_PREFILL[pacienteId] || {};

  const [paciente, setPaciente] = useState({
    nomeCompleto: prefill.nomeCompleto || "",
    nascimento:   prefill.nascimento   || "",
    cpf:          prefill.cpf          || "",
    telefone:     prefill.telefone     || "",
    email:        prefill.email        || "",
    plano:        "",
    psicologo:    "",
  });

  const [contato, setContato] = useState({
    nome:     "",
    telefone: "",
    relacao:  "",
    endereco: "",
    cep:      "",
  });

  const [anotacao, setAnotacao] = useState("");

  const [meds, setMeds]           = useState([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [medForm, setMedForm]     = useState({ nome: "", dose: "", frequencia: "", emUso: true });

  const [saved, setSaved] = useState(false);

  const setp = (field) => (val) => setPaciente(f => ({ ...f, [field]: val }));
  const setc = (field) => (val) => setContato(f => ({ ...f, [field]: val }));

  const podeSalvar = paciente.nomeCompleto.trim() && paciente.psicologo;

  const handleSave = () => {
    if (!podeSalvar) return;
    setSaved(true);
    setTimeout(() => navigate("/prontuario"), 1200);
  };

  return (
    <AppLayout breadcrumb="Prontuário > Novo Cadastro">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate("/prontuario")}
              style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              ‹ Cancelar
            </button>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Prontuário</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={!podeSalvar}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: saved ? "#3BB077" : !podeSalvar ? "#a0b4d0" : "#1A4FA3",
              border: "none", borderRadius: "20px", padding: "9px 22px",
              color: "white", fontSize: "13px", fontWeight: "600",
              cursor: !podeSalvar ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
            onMouseEnter={e => { if (podeSalvar && !saved) e.currentTarget.style.filter = "brightness(1.1)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cadastrado!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cadastrar Prontuário
              </>
            )}
          </button>
        </div>

        {/* ── Seção 1: Dados do Paciente ── */}
        <SectionCard title="Informações do Paciente">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <Field label="Nome Completo"      value={paciente.nomeCompleto} onChange={setp("nomeCompleto")} required />
            <Field label="Data de Nascimento" value={paciente.nascimento}   onChange={setp("nascimento")} placeholder="DD/MM/AAAA" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="CPF" value={paciente.cpf} onChange={setp("cpf")} placeholder="000.000.000-00" />
            <Field label="Telefone" value={paciente.telefone} onChange={setp("telefone")} placeholder="(00) 00000-0000" type="tel" />
          </div>

          <div style={{ borderTop: "1px solid #eef0f6" }} />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="E-mail" value={paciente.email} onChange={setp("email")} placeholder="email@exemplo.com" type="email" />
            <SelectField label="Plano de Saúde"        value={paciente.plano}     onChange={setp("plano")}     options={PLANOS}      />
            <SelectField label="Psicólogo Responsável" value={paciente.psicologo} onChange={setp("psicologo")} options={PSICOLOGOS} required />
          </div>

          <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
            * Nome completo e psicólogo responsável são obrigatórios.
          </p>
        </SectionCard>

        {/* ── Seção 2: Contato de Emergência ── */}
        <SectionCard title="Contato de Emergência">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="Nome do Contato"    value={contato.nome}     onChange={setc("nome")}     placeholder="Nome completo" />
            <Field label="Telefone"           value={contato.telefone} onChange={setc("telefone")} placeholder="(00) 00000-0000" type="tel" />
            <Field label="Relação/Parentesco" value={contato.relacao}  onChange={setc("relacao")}  placeholder="Ex: Mãe, Pai, Cônjuge" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <Field label="Endereço" value={contato.endereco} onChange={setc("endereco")} placeholder="Rua, número, bairro" />
            <Field label="CEP"      value={contato.cep}      onChange={setc("cep")}      placeholder="00000-000" />
          </div>
        </SectionCard>

        {/* ── Seção 3: Anotações ── */}
        <SectionCard title="Anotações">
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            background: "#fffbec", border: "1px solid #f5dfa0", borderRadius: "8px", padding: "12px 14px",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="9" stroke="#c4900a" strokeWidth="2" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#c4900a" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#c4900a"/>
            </svg>
            <p style={{ margin: 0, fontSize: "12px", color: "#7a5c00", lineHeight: 1.5 }}>
              Este campo contém impressões subjetivas do psicólogo e não substitui o prontuário clínico formal.
              Acesso restrito a profissionais autorizados.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Anotações do Psicólogo
            </label>
            <textarea
              value={anotacao}
              onChange={e => setAnotacao(e.target.value)}
              placeholder="Registre aqui observações clínicas, impressões da sessão inicial ou informações relevantes..."
              rows={5}
              style={{
                width: "100%", border: "1px solid #dde3f0", borderRadius: "8px",
                padding: "10px 12px", fontSize: "14px", color: "#1a1a1a", outline: "none",
                background: "white", boxSizing: "border-box", fontFamily: "inherit",
                resize: "vertical", lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = "#1A4FA3"}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
          </div>
        </SectionCard>

        {/* ── Seção 4: Medicamentos ── */}
        <SectionCard title="Medicamentos">
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
              {meds.length === 0 ? "Nenhum medicamento cadastrado." : `${meds.length} medicamento(s) cadastrado(s).`}
            </p>
            {!showMedForm && editingMedId === null && (
              <button
                onClick={() => { setMedForm({ nome: "", dose: "", frequencia: "", emUso: true }); setShowMedForm(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "#EBF3FF", border: "none", borderRadius: "16px",
                  padding: "7px 16px", fontSize: "12px", fontWeight: "600",
                  color: "#1A4FA3", cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="#1A4FA3" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="#1A4FA3" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Adicionar
              </button>
            )}
          </div>

          {/* Inline form (new or edit) */}
          {(showMedForm || editingMedId !== null) && (
            <div style={{
              background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "10px", padding: "16px",
              display: "flex", flexDirection: "column", gap: "14px",
            }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>
                {editingMedId !== null ? "Editar Medicamento" : "Novo Medicamento"}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Nome do Medicamento", key: "nome", placeholder: "Ex: Fluoxetina" },
                  { label: "Dose",                key: "dose", placeholder: "Ex: 20mg"       },
                  { label: "Frequência",          key: "frequencia", placeholder: "Ex: 1x ao dia" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </label>
                    <input
                      type="text"
                      value={medForm[key]}
                      onChange={e => setMedForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ ...inputStyle }}
                      onFocus={e => e.target.style.borderColor = "#1A4FA3"}
                      onBlur={e => e.target.style.borderColor = "#dde3f0"}
                    />
                  </div>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "fit-content" }}>
                <input
                  type="checkbox"
                  checked={medForm.emUso}
                  onChange={e => setMedForm(f => ({ ...f, emUso: e.target.checked }))}
                  style={{ width: "15px", height: "15px", accentColor: "#1A4FA3", cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}>Em uso atualmente</span>
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    if (!medForm.nome.trim()) return;
                    if (editingMedId !== null) {
                      setMeds(ms => ms.map(m => m.id === editingMedId ? { ...m, ...medForm } : m));
                      setEditingMedId(null);
                    } else {
                      setMeds(ms => [...ms, { ...medForm, id: Date.now() }]);
                      setShowMedForm(false);
                    }
                    setMedForm({ nome: "", dose: "", frequencia: "", emUso: true });
                  }}
                  style={{
                    background: "#1A4FA3", border: "none", borderRadius: "16px",
                    padding: "8px 20px", fontSize: "12px", fontWeight: "600",
                    color: "white", cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                >
                  {editingMedId !== null ? "Salvar" : "Adicionar"}
                </button>
                <button
                  onClick={() => { setShowMedForm(false); setEditingMedId(null); setMedForm({ nome: "", dose: "", frequencia: "", emUso: true }); }}
                  style={{
                    background: "none", border: "1px solid #dde3f0", borderRadius: "16px",
                    padding: "8px 20px", fontSize: "12px", fontWeight: "600",
                    color: "#666", cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Medication list */}
          {meds.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {meds.map(m => (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#f9fafc", border: "1px solid #eef0f6", borderRadius: "10px", padding: "12px 16px",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{m.nome}</span>
                      <span style={{
                        fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px",
                        background: m.emUso ? "#E8F5EE" : "#f0f0f0",
                        color: m.emUso ? "#2A8A55" : "#999",
                      }}>
                        {m.emUso ? "Em uso" : "Suspenso"}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#777" }}>
                      {[m.dose, m.frequencia].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => { setMedForm({ nome: m.nome, dose: m.dose, frequencia: m.frequencia, emUso: m.emUso }); setEditingMedId(m.id); setShowMedForm(false); }}
                      style={{
                        background: "#EBF3FF", border: "none", borderRadius: "12px",
                        padding: "5px 12px", fontSize: "12px", fontWeight: "600",
                        color: "#1A4FA3", cursor: "pointer",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setMeds(ms => ms.filter(x => x.id !== m.id))}
                      style={{
                        background: "#fff0f0", border: "none", borderRadius: "12px",
                        padding: "5px 12px", fontSize: "12px", fontWeight: "600",
                        color: "#e05050", cursor: "pointer",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#ffd8d8"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff0f0"}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>
    </AppLayout>
  );
}
