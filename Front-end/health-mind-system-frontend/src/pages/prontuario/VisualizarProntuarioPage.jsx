import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

// ─── Mock data ────────────────────────────────────────────────────────────────
const PACIENTES_DATA = {
  1:  { nomeCompleto: "Ana Clara Souza",   nascimento: "12/03/1998", cpf: "123.456.789-00", telefone: "(11) 96985-8216", email: "ana.clara@email.com",    plano: "Particular",     psicologo: "Dr. Marcos"  },
  2:  { nomeCompleto: "Bruno Mendes",      nascimento: "07/11/1990", cpf: "234.567.890-11", telefone: "(11) 91234-5678", email: "bruno.m@email.com",       plano: "Unimed",         psicologo: "Dra. Carla"  },
  3:  { nomeCompleto: "Carla Ferreira",    nascimento: "22/06/2002", cpf: "345.678.901-22", telefone: "(21) 98877-6655", email: "carla.f@email.com",       plano: "Bradesco Saúde", psicologo: "Dr. Marcos"  },
  4:  { nomeCompleto: "Diego Almeida",     nascimento: "15/01/1983", cpf: "456.789.012-33", telefone: "(31) 97766-5544", email: "diego.almeida@email.com", plano: "Amil",           psicologo: "Dra. Carla"  },
  5:  { nomeCompleto: "Eduarda Lima",      nascimento: "30/09/1994", cpf: "567.890.123-44", telefone: "(11) 95544-3322", email: "edu.lima@email.com",       plano: "Particular",     psicologo: "Dr. Marcos"  },
  6:  { nomeCompleto: "Felipe Costa",      nascimento: "18/04/1999", cpf: "678.901.234-55", telefone: "(41) 94433-2211", email: "felipe.c@email.com",       plano: "SulAmérica",     psicologo: "Dra. Carla"  },
  7:  { nomeCompleto: "Gabriela Nunes",    nascimento: "03/12/1987", cpf: "789.012.345-66", telefone: "(51) 93322-1100", email: "gabi.nunes@email.com",     plano: "Unimed",         psicologo: "Dr. Marcos"  },
  8:  { nomeCompleto: "Henrique Rocha",    nascimento: "27/07/1995", cpf: "890.123.456-77", telefone: "(85) 92211-0099", email: "henri.r@email.com",        plano: "Particular",     psicologo: "Dra. Carla"  },
  9:  { nomeCompleto: "Isabela Martins",   nascimento: "14/02/1979", cpf: "901.234.567-88", telefone: "(11) 91100-9988", email: "isa.martins@email.com",    plano: "Porto Seguro",   psicologo: "Dr. Marcos"  },
  10: { nomeCompleto: "João Pedro Silva",  nascimento: "05/05/1997", cpf: "012.345.678-99", telefone: "(11) 96985-8216", email: "joao.pedro@email.com",     plano: "Bradesco Saúde", psicologo: "Dra. Carla"  },
};

const CONTATOS_EMERGENCIA = {
  1:  { nome: "Carlos Souza",                 telefone: "(11) 97777-1111", relacao: "Pai",     endereco: "Rua das Flores, 123, Jardim Primavera",  cep: "01234-567" },
  2:  { nome: "Fernanda Mendes",              telefone: "(11) 96666-2222", relacao: "Esposa",  endereco: "Av. Brasil, 456, Centro",                cep: "02345-678" },
  3:  { nome: "Paulo Ferreira",               telefone: "(21) 95555-3333", relacao: "Irmão",   endereco: "Rua do Comércio, 78, Tijuca",            cep: "03456-789" },
  4:  { nome: "Mariana Almeida",              telefone: "(31) 94444-4444", relacao: "Mãe",     endereco: "Rua São Paulo, 910, Savassi",            cep: "04567-890" },
  5:  { nome: "Roberto Lima",                 telefone: "(11) 93333-5555", relacao: "Pai",     endereco: "Rua das Palmeiras, 12, Moema",           cep: "05678-901" },
  6:  { nome: "Juliana Costa",                telefone: "(41) 92222-6666", relacao: "Mãe",     endereco: "Rua XV de Novembro, 34, Batel",          cep: "06789-012" },
  7:  { nome: "Ricardo Nunes",                telefone: "(51) 91111-7777", relacao: "Cônjuge", endereco: "Av. Ipiranga, 56, Moinhos de Vento",    cep: "07890-123" },
  8:  { nome: "Sandra Rocha",                 telefone: "(85) 90000-8888", relacao: "Mãe",     endereco: "Rua Dragão do Mar, 89, Meireles",        cep: "08901-234" },
  9:  { nome: "Eduardo Martins",              telefone: "(11) 99999-9999", relacao: "Filho",   endereco: "Rua Augusta, 101, Consolação",           cep: "09012-345" },
  10: { nome: "Daniel Silva Santos Carneiro", telefone: "(11) 90691-6969", relacao: "Pai",     endereco: "Rua dos Três Reis, Parque Novo Mundo",   cep: "06958-192" },
};

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

const MEDICAMENTOS_MOCK = {
  1:  [{ id: 1, nome: "Sertralina", dose: "50mg", frequencia: "1x ao dia", emUso: true  }],
  2:  [{ id: 1, nome: "Clonazepam", dose: "0,5mg", frequencia: "2x ao dia", emUso: true  },
       { id: 2, nome: "Fluoxetina", dose: "20mg", frequencia: "1x ao dia", emUso: false }],
  3:  [],
  4:  [{ id: 1, nome: "Escitalopram", dose: "10mg", frequencia: "1x ao dia", emUso: true }],
  5:  [],
  6:  [{ id: 1, nome: "Bupropiona", dose: "150mg", frequencia: "2x ao dia", emUso: true  }],
  7:  [],
  8:  [{ id: 1, nome: "Quetiapina", dose: "25mg", frequencia: "1x à noite", emUso: false }],
  9:  [{ id: 1, nome: "Venlafaxina", dose: "75mg", frequencia: "1x ao dia", emUso: true  },
       { id: 2, nome: "Alprazolam",  dose: "0,25mg", frequencia: "1x ao dia", emUso: true }],
  10: [],
};

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  "Informações do Paciente",
  "Contato de Emergência",
  "Anotações",
  "Medicamentos",
];

// edit routes for tabs that navigate away (null = no top-level Edit button)
const EDIT_ROUTES = {
  0: (id) => `/prontuario/${id}/editar`,
  1: (id) => `/prontuario/${id}/editar-contato`,
  2: (id) => `/prontuario/${id}/editar-anotacoes`,
  3: null,
};

// ─── Shared display field ─────────────────────────────────────────────────────
function InfoField({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{value}</span>
    </div>
  );
}

// ─── Tab: Informações do Paciente ─────────────────────────────────────────────
function TabInfoPaciente({ paciente }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "20px" }}>Informações do Paciente</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "24px 20px", marginBottom: "24px" }}>
        <InfoField label="Nome Completo"      value={paciente.nomeCompleto} />
        <InfoField label="Data de Nascimento" value={paciente.nascimento}   />
        <InfoField label="CPF"                value={paciente.cpf}          />
        <InfoField label="Telefone"           value={paciente.telefone}     />
      </div>
      <div style={{ borderTop: "1px solid #eef0f6", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px 20px" }}>
        <InfoField label="E-mail"                value={paciente.email}     />
        <InfoField label="Plano de Saúde"        value={paciente.plano}     />
        <InfoField label="Psicólogo Responsável" value={paciente.psicologo} />
      </div>
    </div>
  );
}

// ─── Tab: Contato de Emergência ───────────────────────────────────────────────
function TabContatoEmergencia({ contato }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "20px" }}>Contato de Emergência</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px 20px", marginBottom: "24px" }}>
        <InfoField label="Nome"               value={contato.nome}     />
        <InfoField label="Telefone"           value={contato.telefone} />
        <InfoField label="Relação/Parentesco" value={contato.relacao}  />
      </div>
      <div style={{ borderTop: "1px solid #eef0f6", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px 20px" }}>
        <InfoField label="Endereço" value={contato.endereco} />
        <InfoField label="CEP"      value={contato.cep}      />
      </div>
    </div>
  );
}

// ─── Tab: Anotações ───────────────────────────────────────────────────────────
function TabAnotacoes({ pacienteId }) {
  const anotacao = ANOTACOES_MOCK[pacienteId] || "";
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Anotações</h2>
      <div style={{ background: "#FFF8E6", border: "1px solid #FFD97D", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#856404", display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="12" cy="12" r="10" stroke="#856404" strokeWidth="2" fill="none"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="#856404" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="#856404"/>
        </svg>
        <span>Este campo contém impressões subjetivas do psicólogo e não compõe o prontuário oficial do paciente.</span>
      </div>
      <div>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notas do Psicólogo (Privado)</span>
        <div style={{ fontSize: "14px", color: anotacao ? "#1a1a1a" : "#bbb", lineHeight: "1.8", whiteSpace: "pre-wrap", marginTop: "8px", minHeight: "60px" }}>
          {anotacao || "Nenhuma anotação registrada. Clique em Editar para adicionar."}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Medicamentos ────────────────────────────────────────────────────────
const EMPTY_MED = { nome: "", dose: "", frequencia: "", emUso: true };

function TabMedicamentos({ pacienteId }) {
  const [meds, setMeds] = useState(MEDICAMENTOS_MOCK[pacienteId] || []);
  const [filtro, setFiltro] = useState("emUso"); // "emUso" | "historico"
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_MED });

  const filtered = meds.filter(m => filtro === "emUso" ? m.emUso : !m.emUso);

  const openNew = () => {
    setForm({ ...EMPTY_MED });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (med) => {
    setForm({ nome: med.nome, dose: med.dose, frequencia: med.frequencia, emUso: med.emUso });
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) return;
    if (editingId !== null) {
      setMeds(prev => prev.map(m => m.id === editingId ? { ...m, ...form } : m));
    } else {
      const newId = meds.length > 0 ? Math.max(...meds.map(m => m.id)) + 1 : 1;
      setMeds(prev => [...prev, { id: newId, ...form }]);
    }
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, emUso: !m.emUso } : m));
  };

  const handleDelete = (id) => {
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const inputStyle = {
    flex: 1, height: "36px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Medicamentos</h2>
        <button
          onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Adicionar
        </button>
      </div>

      {/* Sub-filter pills */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[["emUso", "Em Uso"], ["historico", "Histórico"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFiltro(val)}
            style={{
              padding: "5px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: "none",
              background: filtro === val ? "#1A4FA3" : "#EBF3FF",
              color: filtro === val ? "white" : "#1A4FA3",
              transition: "background 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>
            {editingId !== null ? "Editar Medicamento" : "Novo Medicamento"}
          </span>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              placeholder="Nome do medicamento *"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              style={{ ...inputStyle, minWidth: "180px" }}
              onFocus={e => e.target.style.borderColor = "#1A4FA3"}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
            <input
              placeholder="Dose (ex: 50mg)"
              value={form.dose}
              onChange={e => setForm(f => ({ ...f, dose: e.target.value }))}
              style={{ ...inputStyle, maxWidth: "120px" }}
              onFocus={e => e.target.style.borderColor = "#1A4FA3"}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
            <input
              placeholder="Frequência (ex: 1x ao dia)"
              value={form.frequencia}
              onChange={e => setForm(f => ({ ...f, frequencia: e.target.value }))}
              style={{ ...inputStyle, minWidth: "160px" }}
              onFocus={e => e.target.style.borderColor = "#1A4FA3"}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#444", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.emUso}
                onChange={e => setForm(f => ({ ...f, emUso: e.target.checked }))}
                style={{ width: "15px", height: "15px", accentColor: "#1A4FA3" }}
              />
              Em uso atualmente
            </label>
            <div style={{ flex: 1 }} />
            <button onClick={() => setShowForm(false)} style={{ padding: "6px 16px", background: "#e0e0e0", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{ padding: "6px 16px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer", opacity: !form.nome.trim() ? 0.5 : 1 }}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "14px" }}>
          {filtro === "emUso" ? "Nenhum medicamento em uso." : "Nenhum medicamento no histórico."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(med => (
            <div key={med.id} style={{
              display: "flex", alignItems: "center", gap: "14px",
              border: "1px solid #eef0f6", borderRadius: "12px", padding: "12px 16px",
              transition: "box-shadow 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(26,79,163,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              {/* Pill icon */}
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: med.emUso ? "#EBF3FF" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="10" width="18" height="4" rx="2" stroke={med.emUso ? "#1A4FA3" : "#aaa"} strokeWidth="2" fill="none"/>
                  <rect x="7" y="6" width="10" height="12" rx="5" stroke={med.emUso ? "#1A4FA3" : "#aaa"} strokeWidth="2" fill="none"/>
                </svg>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>{med.nome}</div>
                <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>
                  {med.dose && <span>{med.dose}</span>}
                  {med.dose && med.frequencia && <span style={{ margin: "0 6px", color: "#ccc" }}>·</span>}
                  {med.frequencia && <span>{med.frequencia}</span>}
                </div>
              </div>

              {/* Status badge */}
              <div style={{
                padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                background: med.emUso ? "#E8F5EE" : "#f0f0f0",
                color: med.emUso ? "#2A8A55" : "#888",
                flexShrink: 0,
              }}>
                {med.emUso ? "Em uso" : "Inativo"}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {/* Toggle status */}
                <button
                  onClick={() => toggleStatus(med.id)}
                  title={med.emUso ? "Marcar como inativo" : "Marcar como em uso"}
                  style={{ width: "32px", height: "32px", border: "1px solid #dde3f0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12C4 7.6 7.6 4 12 4C14.2 4 16.2 4.9 17.7 6.3L20 4V10H14L16.4 7.6C15.3 6.6 13.7 6 12 6C8.7 6 6 8.7 6 12" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 12C20 16.4 16.4 20 12 20C9.8 20 7.8 19.1 6.3 17.7L4 20V14H10L7.6 16.4C8.7 17.4 10.3 18 12 18C15.3 18 18 15.3 18 12" stroke="#1A4FA3" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {/* Edit */}
                <button
                  onClick={() => openEdit(med)}
                  title="Editar"
                  style={{ width: "32px", height: "32px", border: "1px solid #dde3f0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                  </svg>
                </button>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(med.id)}
                  title="Remover"
                  style={{ width: "32px", height: "32px", border: "1px solid #ffd0d0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff0f0"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <line x1="6" y1="6" x2="18" y2="18" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18" y1="6" x2="6" y2="18" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Evolução placeholder ────────────────────────────────────────────────
function TabEmBreve({ nome }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "3rem 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center", color: "#bbb", fontSize: "14px" }}>
      A aba <strong style={{ color: "#888" }}>{nome}</strong> ainda não foi implementada.
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VisualizarProntuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const paciente = PACIENTES_DATA[Number(id)];
  const contato  = CONTATOS_EMERGENCIA[Number(id)];

  if (!paciente) {
    return (
      <AppLayout breadcrumb="Prontuário >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Paciente não encontrado.
          <br />
          <button onClick={() => navigate("/prontuario")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  const editRouteFn = EDIT_ROUTES[activeTab];
  const editRoute   = typeof editRouteFn === "function" ? editRouteFn(id) : null;

  return (
    <AppLayout breadcrumb="Prontuário >">
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
              ‹ Voltar
            </button>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Prontuário</h1>
          </div>

          {editRoute && (
            <button
              onClick={() => navigate(editRoute)}
              style={{ display: "flex", alignItems: "center", gap: "7px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "9px 20px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <line x1="13" y1="7" x2="17" y2="11" stroke="white" strokeWidth="2"/>
              </svg>
              Editar
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #dde3f0", overflowX: "auto" }}>
          {TABS.map((tab, i) => (
            <div
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "8px 14px", fontSize: "12px",
                fontWeight: activeTab === i ? "700" : "500",
                color: activeTab === i ? "#1A4FA3" : "#888",
                borderBottom: activeTab === i ? "2px solid #1A4FA3" : "2px solid transparent",
                marginBottom: "-2px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
              }}
              onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = "#555"; }}
              onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = "#888"; }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 0 && <TabInfoPaciente paciente={paciente} />}
        {activeTab === 1 && <TabContatoEmergencia contato={contato} />}
        {activeTab === 2 && <TabAnotacoes pacienteId={Number(id)} />}
        {activeTab === 3 && <TabMedicamentos pacienteId={Number(id)} />}

      </div>
    </AppLayout>
  );
}