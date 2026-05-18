import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES_INICIAL = [
  { id: 1,  nome: "Ana Clara Souza",  email: "ana.clara@email.com",    cpf: "123.456.789-00", nascimento: "12/03/1998" },
  { id: 2,  nome: "Bruno Mendes",     email: "bruno.m@email.com",      cpf: "234.567.890-11", nascimento: "07/11/1990" },
  { id: 3,  nome: "Carla Ferreira",   email: "carla.f@email.com",      cpf: "345.678.901-22", nascimento: "22/06/2002" },
  { id: 4,  nome: "Diego Almeida",    email: "diego.almeida@email.com", cpf: "456.789.012-33", nascimento: "15/01/1983" },
  { id: 5,  nome: "Eduarda Lima",     email: "edu.lima@email.com",     cpf: "567.890.123-44", nascimento: "30/09/1994" },
  { id: 6,  nome: "Felipe Costa",     email: "felipe.c@email.com",     cpf: "678.901.234-55", nascimento: "18/04/1999" },
  { id: 7,  nome: "Gabriela Nunes",   email: "gabi.nunes@email.com",   cpf: "789.012.345-66", nascimento: "03/12/1987" },
  { id: 8,  nome: "Henrique Rocha",   email: "henri.r@email.com",      cpf: "890.123.456-77", nascimento: "27/07/1995" },
  { id: 9,  nome: "Isabela Martins",  email: "isa.martins@email.com",  cpf: "901.234.567-88", nascimento: "14/02/1979" },
  { id: 10, nome: "João Pedro Silva", email: "joao.pedro@email.com",   cpf: "012.345.678-99", nascimento: "05/05/1997" },
];

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

const EMPTY_FORM = { nome: "", email: "", cpf: "", nascimento: "" };

function getInitials(nome) {
  const parts = nome.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

// ─── Modal: Novo Paciente ─────────────────────────────────────────────────────
function ModalNovoPaciente({ form, setForm, onSave, onClose }) {
  const inputStyle = {
    height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 12px", fontSize: "13px", outline: "none",
    boxSizing: "border-box", width: "100%", fontFamily: "inherit",
  };
  const focusBlue = e => e.target.style.borderColor = "#1A4FA3";
  const blurGray  = e => e.target.style.borderColor = "#dde3f0";

  const Field = ({ label, field, placeholder, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "460px", maxWidth: "90vw", display: "flex", flexDirection: "column", gap: "18px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Paciente</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        {/* Fields */}
        <Field label="Nome Completo *"    field="nome"       placeholder="Nome completo do paciente" />
        <Field label="CPF"                field="cpf"        placeholder="000.000.000-00" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="E-mail"           field="email"      placeholder="email@exemplo.com" type="email" />
          <Field label="Data de Nascimento" field="nascimento" placeholder="DD/MM/AAAA" />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!form.nome.trim()}
            style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !form.nome.trim() ? "not-allowed" : "pointer", opacity: !form.nome.trim() ? 0.5 : 1 }}
            onMouseEnter={e => { if (form.nome.trim()) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            Salvar Paciente
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PacientesPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState(
    [...PACIENTES_INICIAL].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
  );
  const [busca, setBusca]               = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState({ ...EMPTY_FORM });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const openModal = () => { setForm({ ...EMPTY_FORM }); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleAdd = () => {
    if (!form.nome.trim()) return;
    const id = pacientes.length ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
    setPacientes(prev =>
      [...prev, { id, ...form }].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    );
    setShowModal(false);
    setForm({ ...EMPTY_FORM });
  };

  const handleDelete = (id) => {
    setPacientes(prev => prev.filter(p => p.id !== id));
    setConfirmDeleteId(null);
  };

  const COL = "200px 130px 190px 120px 200px";

  return (
    <AppLayout breadcrumb="Pacientes >">
      {showModal && (
        <ModalNovoPaciente form={form} setForm={setForm} onSave={handleAdd} onClose={closeModal} />
      )}

      <div style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Pacientes</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none"/>
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 32px", fontSize: "13px", outline: "none", width: "200px", color: "#333", background: "white" }}
              />
            </div>

            {/* Add patient */}
            <button
              onClick={openModal}
              style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
              Adicionar Paciente
            </button>
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Paciente", "CPF", "E-mail", "Nascimento", "Ações"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum paciente encontrado.
            </div>
          ) : (
            filtrados.map((p, i) => {
              const isConfirming = confirmDeleteId === p.id;
              const rowBg = i % 2 === 0 ? "white" : "#f9fafc";

              return isConfirming ? (
                /* ── Delete confirmation row ── */
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#fff5f5", borderBottom: "1px solid #ffd0d0", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#e05050" strokeWidth="2" fill="none"/>
                      <line x1="12" y1="7" x2="12" y2="13" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="16.5" r="1" fill="#e05050"/>
                    </svg>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#c0392b" }}>
                      Excluir <strong>{p.nome}</strong>? Esta ação não pode ser desfeita.
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{ padding: "6px 16px", background: "#e8e8e8", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer" }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ padding: "6px 16px", background: "#e05050", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "white", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                    >
                      Sim, excluir
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Normal row ── */
                <div
                  key={p.id}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  {/* Avatar + nome */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: AVATAR_COLORS[p.id % AVATAR_COLORS.length], color: "white", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {getInitials(p.nome)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{p.nome}</span>
                  </div>

                  {/* CPF */}
                  <div style={{ fontSize: "13px", color: "#555" }}>{p.cpf || "—"}</div>

                  {/* E-mail */}
                  <div style={{ fontSize: "13px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email || "—"}</div>

                  {/* Nascimento */}
                  <div style={{ fontSize: "13px", color: "#555" }}>{p.nascimento || "—"}</div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/paciente/${p.id}/editar`)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                        <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#fff0f0", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#e05050", cursor: "pointer", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#ffd8d8"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff0f0"}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <polyline points="3 6 5 6 21 6" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19 6l-1 14H6L5 6" stroke="#e05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <path d="M10 11v6M14 11v6" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M9 6V4h6v2" stroke="#e05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
          {filtrados.length} {filtrados.length === 1 ? "paciente encontrado" : "pacientes encontrados"}
        </div>
      </div>
    </AppLayout>
  );
}
