import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";

const PACIENTES_DATA = {
  1:  { nomeCompleto: "Ana Clara Souza",   nascimento: "12/03/1998" },
  2:  { nomeCompleto: "Bruno Mendes",      nascimento: "07/11/1990" },
  3:  { nomeCompleto: "Carla Ferreira",    nascimento: "22/06/2002" },
  4:  { nomeCompleto: "Diego Almeida",     nascimento: "15/01/1983" },
  5:  { nomeCompleto: "Eduarda Lima",      nascimento: "30/09/1994" },
  6:  { nomeCompleto: "Felipe Costa",      nascimento: "18/04/1999" },
  7:  { nomeCompleto: "Gabriela Nunes",    nascimento: "03/12/1987" },
  8:  { nomeCompleto: "Henrique Rocha",    nascimento: "27/07/1995" },
  9:  { nomeCompleto: "Isabela Martins",   nascimento: "14/02/1979" },
  10: { nomeCompleto: "João Pedro Silva",  nascimento: "05/05/1997" },
};

const SESSOES_MOCK = {
  1: [
    { id: 1, numero: 1, data: "10/01/2026", duracao: "50 min", valor: 150, statusPagamento: "pago",     notas: "Primeira sessão de acolhimento. Paciente relatou histórico de ansiedade e dificuldades em estabelecer limites no ambiente de trabalho. Bom vínculo terapêutico estabelecido desde o início." },
    { id: 2, numero: 2, data: "17/01/2026", duracao: "50 min", valor: 150, statusPagamento: "pago",     notas: "Aprofundamento das queixas iniciais. Identificados padrões de autoexigência excessiva. Proposta de registro de pensamentos automáticos para a próxima semana." },
    { id: 3, numero: 3, data: "24/01/2026", duracao: "50 min", valor: 150, statusPagamento: "pendente", notas: "Revisão dos registros de pensamentos. Paciente demonstrou boa adesão à tarefa. Inicio da reestruturação cognitiva." },
  ],
  2: [
    { id: 1, numero: 1, data: "05/02/2026", duracao: "50 min", valor: 180, statusPagamento: "pago",     notas: "Sessão inicial. Paciente relata episódios de ansiedade antecipatória frequentes. Boa motivação para o processo terapêutico." },
    { id: 2, numero: 2, data: "12/02/2026", duracao: "50 min", valor: 180, statusPagamento: "pendente", notas: "Exploração dos gatilhos ansiosos. Situações sociais e profissionais identificadas como principais desencadeadores." },
  ],
  3: [],
  4: [
    { id: 1, numero: 1, data: "02/03/2026", duracao: "50 min", valor: 200, statusPagamento: "pago",     notas: "Paciente chegou visivelmente esgotado. Relata sobrecarga intensa no trabalho. Investigação inicial dos critérios de burnout." },
  ],
  5: [],
  6: [
    { id: 1, numero: 1, data: "15/02/2026", duracao: "50 min", valor: 150, statusPagamento: "pago",     notas: "Primeira sessão. Paciente demonstra dificuldade em lidar com críticas e feedbacks negativos." },
    { id: 2, numero: 2, data: "22/02/2026", duracao: "50 min", valor: 150, statusPagamento: "pendente", notas: "Exploração da história de vida. Padrão de comportamento defensivo vinculado a experiências na adolescência." },
  ],
  7: [],
  8: [
    { id: 1, numero: 1, data: "10/04/2026", duracao: "50 min", valor: 150, statusPagamento: "isento",   notas: "Bom progresso no manejo da raiva. Paciente relata aplicação das técnicas de regulação emocional em situações cotidianas." },
  ],
  9: [
    { id: 1, numero: 1, data: "01/02/2026", duracao: "50 min", valor: 200, statusPagamento: "pendente", notas: "Sessão focada no manejo da ansiedade generalizada. Revisão do uso da medicação com psiquiatra confirmado pelo paciente." },
  ],
  10: [
    { id: 1, numero: 1, data: "05/01/2026", duracao: "50 min", valor: 150, statusPagamento: "pago",     notas: "João chegou reservado. Evitou contato visual ao mencionar o chefe. Hipótese de transferência levantada internamente para investigação futura." },
    { id: 2, numero: 2, data: "12/01/2026", duracao: "50 min", valor: 150, statusPagamento: "pago",     notas: "Continuação da exploração da relação com figuras de autoridade. Paciente demonstrou resistência ao tocar no tema do pai." },
  ],
};

const EMPTY_FORM = { numero: "", data: "", duracao: "", notas: "", valor: "", statusPagamento: "pendente" };

const STATUS_PAGAMENTO = {
  pendente: { label: "Pendente", bg: "#FFF8E6", color: "#856404" },
  pago:     { label: "Pago",     bg: "#E8F5EE", color: "#2A8A55" },
  isento:   { label: "Isento",   bg: "#f0f0f0", color: "#888"    },
};

// ─── Histórico mock data ──────────────────────────────────────────────────────
const PERGUNTAS_HISTORICO = [
  { id: "queixa",      texto: "Queixa principal e motivo do atendimento?" },
  { id: "impacto",     texto: "Como esses sintomas/problemas afetam seu dia a dia (no trabalho, nos estudos, nos relacionamentos, no seu sono, etc.)?" },
  { id: "expectativa", texto: "O que você espera desse acompanhamento psicológico/psiquiátrico?" },
];

const PERGUNTAS_SAUDE_MENTAL = [
  { id: "diagnostico",   texto: "Você já teve algum diagnóstico prévio relacionado à saúde mental (ex: depressão, ansiedade, bipolaridade, TDAH, etc.)?" },
  { id: "tratamento",    texto: "Já fez psicoterapia ou acompanhamento psiquiátrico antes? Se sim, em que período e qual foi o resultado?" },
  { id: "internacao",    texto: "Já foi internado(a) em alguma instituição de saúde mental ou hospital psiquiátrico?" },
  { id: "historico_fam", texto: "Algum familiar próximo tem ou teve algum transtorno mental diagnosticado?" },
];

const HISTORICO_MOCK = {
  1: {
    queixa:        "Dificuldade em estabelecer limites com colegas e superiores no trabalho. Sente-se sobrecarregada e não consegue dizer não.",
    impacto:       "Relata cansaço excessivo, dificuldade para dormir e irritabilidade nos relacionamentos familiares. No trabalho, sente que sua produtividade caiu.",
    expectativa:   "Quer aprender a se posicionar melhor e reduzir o nível de ansiedade no dia a dia.",
    diagnostico:   "Nenhum diagnóstico formal. Médico clínico sugeriu avaliação para ansiedade.",
    tratamento:    "Fez terapia por cerca de 6 meses em 2020, relatou melhora parcial mas interrompeu por questões financeiras.",
    internacao:    "Não.",
    historico_fam: "Mãe com diagnóstico de transtorno de ansiedade generalizada.",
  },
  2: {
    queixa:        "Episódios frequentes de ansiedade antecipatória, especialmente antes de reuniões e apresentações no trabalho.",
    impacto:       "Evita situações sociais e profissionais. Apresenta insônia nas noites anteriores a eventos importantes.",
    expectativa:   "Conseguir controlar melhor a ansiedade e participar de situações que hoje evita.",
    diagnostico:   "",
    tratamento:    "Nunca realizou acompanhamento psicológico ou psiquiátrico anteriormente.",
    internacao:    "Não.",
    historico_fam: "Pai com histórico de depressão.",
  },
  3:  {},
  4: {
    queixa:        "Esgotamento profissional intenso. Sente que não consegue mais se desligar do trabalho.",
    impacto:       "Afeta sono, humor e relacionamento conjugal. Perdeu interesse em atividades que antes eram prazerosas.",
    expectativa:   "Recuperar o equilíbrio e entender os limites entre vida pessoal e profissional.",
    diagnostico:   "",
    tratamento:    "",
    internacao:    "Não.",
    historico_fam: "",
  },
  5:  {},
  6: {
    queixa:        "Dificuldade em lidar com críticas, tanto no trabalho quanto em relacionamentos pessoais.",
    impacto:       "Reage de forma defensiva, o que tem gerado conflitos frequentes com colegas e parceiro.",
    expectativa:   "Melhorar a autoestima e desenvolver respostas mais assertivas.",
    diagnostico:   "Sem diagnóstico prévio.",
    tratamento:    "Participou de grupo terapêutico por 3 meses em 2022.",
    internacao:    "Não.",
    historico_fam: "Irmão com TDAH diagnosticado na infância.",
  },
  7:  {},
  8: {
    queixa:        "Dificuldade no manejo da raiva, principalmente em ambiente doméstico.",
    impacto:       "Conflitos frequentes com familiares. Relata arrependimento após as crises.",
    expectativa:   "Desenvolver estratégias de regulação emocional.",
    diagnostico:   "",
    tratamento:    "Iniciou acompanhamento psiquiátrico há 6 meses. Fazia uso de Quetiapina, atualmente suspenso.",
    internacao:    "Não.",
    historico_fam: "",
  },
  9: {
    queixa:        "Ansiedade generalizada com preocupações excessivas sobre diversas áreas da vida.",
    impacto:       "Dificuldade de concentração, tensão muscular constante e insônia. Impacta o trabalho e os relacionamentos.",
    expectativa:   "Complementar o tratamento psiquiátrico com suporte psicoterápico.",
    diagnostico:   "Transtorno de Ansiedade Generalizada (TAG) — diagnóstico feito por psiquiatra em 2023.",
    tratamento:    "Acompanhamento psiquiátrico ativo. Primeira experiência com psicoterapia.",
    internacao:    "Não.",
    historico_fam: "Mãe com depressão. Avó com histórico de transtorno bipolar.",
  },
  10: {
    queixa:        "Dificuldades relacionais no ambiente de trabalho, especialmente com figuras de autoridade.",
    impacto:       "Desmotivação profissional e conflitos pontuais com o chefe. Relata distúrbios de sono.",
    expectativa:   "Entender os padrões que se repetem em seus relacionamentos profissionais.",
    diagnostico:   "",
    tratamento:    "Nenhum acompanhamento anterior.",
    internacao:    "Não.",
    historico_fam: "Sem histórico familiar conhecido.",
  },
};

// ─── Evolução mock data ───────────────────────────────────────────────────────
const STATUS_META = {
  nao_iniciada: { label: "Não iniciada", bg: "#f0f0f0",  color: "#888"    },
  em_andamento: { label: "Em andamento", bg: "#EBF3FF",  color: "#1A4FA3" },
  alcancada:    { label: "Alcançada",    bg: "#E8F5EE",  color: "#2A8A55" },
};

const METAS_MOCK = {
  1:  [
    { id: 1, titulo: "Estabelecer limites no trabalho",        status: "em_andamento", criadaEm: "10/01/2026", notas: "" },
    { id: 2, titulo: "Reduzir autoexigência e autocrítica",    status: "em_andamento", criadaEm: "17/01/2026", notas: "" },
  ],
  2:  [
    { id: 1, titulo: "Participar de situações sociais evitadas",            status: "nao_iniciada", criadaEm: "05/02/2026", notas: "" },
    { id: 2, titulo: "Desenvolver estratégias de regulação da ansiedade",   status: "em_andamento", criadaEm: "12/02/2026", notas: "" },
  ],
  3:  [],
  4:  [{ id: 1, titulo: "Equilibrar vida pessoal e profissional", status: "em_andamento", criadaEm: "02/03/2026", notas: "" }],
  5:  [],
  6:  [
    { id: 1, titulo: "Desenvolver assertividade e autoestima",               status: "em_andamento", criadaEm: "15/02/2026", notas: "" },
    { id: 2, titulo: "Reduzir comportamento defensivo diante de críticas",   status: "nao_iniciada", criadaEm: "22/02/2026", notas: "" },
  ],
  7:  [],
  8:  [{ id: 1, titulo: "Manejo da raiva em contexto familiar", status: "alcancada", criadaEm: "10/04/2026", notas: "Paciente reportou melhora significativa e consistente." }],
  9:  [
    { id: 1, titulo: "Reduzir preocupações excessivas generalizadas", status: "em_andamento", criadaEm: "01/02/2026", notas: "" },
    { id: 2, titulo: "Integrar técnicas de mindfulness à rotina",     status: "nao_iniciada", criadaEm: "01/02/2026", notas: "" },
  ],
  10: [{ id: 1, titulo: "Compreender padrões com figuras de autoridade", status: "em_andamento", criadaEm: "05/01/2026", notas: "" }],
};

const ESCALAS_MOCK = {
  1:  [
    { id: 1, sessaoNum: 1, data: "10/01/2026", humor: 4, ansiedade: 8, sono: 4, social: 5 },
    { id: 2, sessaoNum: 2, data: "17/01/2026", humor: 5, ansiedade: 7, sono: 6, social: 6 },
    { id: 3, sessaoNum: 3, data: "24/01/2026", humor: 7, ansiedade: 5, sono: 7, social: 7 },
  ],
  2:  [
    { id: 1, sessaoNum: 1, data: "05/02/2026", humor: 5, ansiedade: 7, sono: 5, social: 4 },
    { id: 2, sessaoNum: 2, data: "12/02/2026", humor: 6, ansiedade: 6, sono: 6, social: 5 },
  ],
  3:  [],
  4:  [{ id: 1, sessaoNum: 1, data: "02/03/2026", humor: 3, ansiedade: 9, sono: 3, social: 4 }],
  5:  [],
  6:  [
    { id: 1, sessaoNum: 1, data: "15/02/2026", humor: 5, ansiedade: 6, sono: 6, social: 4 },
    { id: 2, sessaoNum: 2, data: "22/02/2026", humor: 6, ansiedade: 5, sono: 7, social: 5 },
  ],
  7:  [],
  8:  [{ id: 1, sessaoNum: 1, data: "10/04/2026", humor: 7, ansiedade: 4, sono: 7, social: 8 }],
  9:  [{ id: 1, sessaoNum: 1, data: "01/02/2026", humor: 4, ansiedade: 8, sono: 4, social: 5 }],
  10: [
    { id: 1, sessaoNum: 1, data: "05/01/2026", humor: 5, ansiedade: 6, sono: 5, social: 4 },
    { id: 2, sessaoNum: 2, data: "12/01/2026", humor: 6, ansiedade: 5, sono: 6, social: 5 },
  ],
};

const SERIES_ESCALAS = [
  { key: "humor",     label: "Humor",             color: "#1A4FA3", nota: ""          },
  { key: "ansiedade", label: "Ansiedade",          color: "#E06B4A", nota: "↑ = pior"  },
  { key: "sono",      label: "Sono",               color: "#3BB077", nota: ""          },
  { key: "social",    label: "Func. Social",        color: "#7B5EA7", nota: ""          },
];

const EMPTY_ESCALA = { sessaoNum: "", data: "", humor: 5, ansiedade: 5, sono: 5, social: 5 };
const EMPTY_META   = { titulo: "", status: "nao_iniciada", notas: "" };

const TABS = [
  "Registro de Sessão",
  "Histórico",
  "Saúde Mental",
  "Evolução",
];

// ─── Tab: Registro de Sessão ──────────────────────────────────────────────────
function TabRegistroSessao({ pacienteId }) {
  const [sessoes, setSessoes] = useState(
    [...(SESSOES_MOCK[pacienteId] || [])].sort((a, b) => b.numero - a.numero)
  );
  const [editingId, setEditingId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const nextNumero = sessoes.length > 0 ? Math.max(...sessoes.map(s => s.numero)) + 1 : 1;

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, numero: String(nextNumero) });
    setShowNewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (sessao) => {
    setShowNewForm(false);
    setForm({ numero: String(sessao.numero), data: sessao.data, duracao: sessao.duracao, notas: sessao.notas, valor: sessao.valor ? String(sessao.valor) : "", statusPagamento: sessao.statusPagamento || "pendente" });
    setEditingId(sessao.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowNewForm(false);
    setForm({ ...EMPTY_FORM });
  };

  const handleSave = () => {
    if (!form.data.trim()) return;
    if (showNewForm) {
      const newId = sessoes.length > 0 ? Math.max(...sessoes.map(s => s.id)) + 1 : 1;
      const nova = { id: newId, numero: Number(form.numero) || nextNumero, data: form.data, duracao: form.duracao, notas: form.notas, valor: form.valor ? Number(form.valor) : null, statusPagamento: form.statusPagamento };
      setSessoes(prev => [nova, ...prev].sort((a, b) => b.numero - a.numero));
      setShowNewForm(false);
    } else {
      setSessoes(prev =>
        prev.map(s => s.id === editingId
          ? { ...s, numero: Number(form.numero) || s.numero, data: form.data, duracao: form.duracao, notas: form.notas, valor: form.valor ? Number(form.valor) : null, statusPagamento: form.statusPagamento }
          : s
        ).sort((a, b) => b.numero - a.numero)
      );
      setEditingId(null);
    }
    setForm({ ...EMPTY_FORM });
  };

  const inputStyle = {
    height: "36px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%",
  };

  const textareaStyle = {
    border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "10px", fontSize: "13px", outline: "none", resize: "vertical",
    lineHeight: "1.7", width: "100%", boxSizing: "border-box", minHeight: "120px",
    fontFamily: "inherit",
  };

  const focusBlue = (e) => e.target.style.borderColor = "#1A4FA3";
  const blurGray  = (e) => e.target.style.borderColor = "#dde3f0";

  const FormPanel = ({ title }) => (
    <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>{title}</span>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nº da Sessão</label>
          <input
            type="number" min="1"
            value={form.numero}
            onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
            style={inputStyle}
            onFocus={focusBlue} onBlur={blurGray}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Data da Sessão *</label>
          <input
            type="text" placeholder="DD/MM/AAAA"
            value={form.data}
            onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
            style={inputStyle}
            onFocus={focusBlue} onBlur={blurGray}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Duração</label>
          <input
            type="text" placeholder="ex: 50 min"
            value={form.duracao}
            onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
            style={inputStyle}
            onFocus={focusBlue} onBlur={blurGray}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Valor (R$)</label>
          <input
            type="number" min="0" step="0.01" placeholder="0,00"
            value={form.valor}
            onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
            style={inputStyle}
            onFocus={focusBlue} onBlur={blurGray}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status de Pagamento</label>
          <select
            value={form.statusPagamento}
            onChange={e => setForm(f => ({ ...f, statusPagamento: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={focusBlue} onBlur={blurGray}
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="isento">Isento</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Registro da Sessão</label>
        <textarea
          placeholder="Descreva as observações, temas abordados, evolução do paciente e próximos passos..."
          value={form.notas}
          onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
          style={textareaStyle}
          onFocus={focusBlue} onBlur={blurGray}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={cancelEdit} style={{ padding: "7px 18px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}>
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!form.data.trim()}
          style={{ padding: "7px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !form.data.trim() ? "not-allowed" : "pointer", opacity: !form.data.trim() ? 0.5 : 1 }}
          onMouseEnter={e => { if (form.data.trim()) e.currentTarget.style.filter = "brightness(1.12)"; }}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          Salvar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Registro de Sessão</h2>
        <button
          onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Novo Registro
        </button>
      </div>

      {/* New session form */}
      {showNewForm && <FormPanel title="Nova Sessão" />}

      {/* Sessions list */}
      {sessoes.length === 0 && !showNewForm ? (
        <div style={{ textAlign: "center", padding: "2.5rem 0", color: "#bbb", fontSize: "14px" }}>
          Nenhum registro de sessão encontrado. Clique em <strong style={{ color: "#999" }}>+ Novo Registro</strong> para começar.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sessoes.map(sessao => (
            <div key={sessao.id}>
              {editingId === sessao.id ? (
                <FormPanel title={`Editar Sessão #${sessao.numero}`} />
              ) : (
                <div
                  style={{
                    border: "1px solid #eef0f6", borderRadius: "12px",
                    padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "14px",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(26,79,163,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  {/* Session number badge */}
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px", background: "#EBF3FF",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#1A4FA3", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>Sess.</span>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: "#1A4FA3", lineHeight: 1.2 }}>#{sessao.numero}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{sessao.data}</span>
                      {sessao.duracao && (
                        <span style={{ background: "#f0f4ff", color: "#1A4FA3", fontSize: "11px", fontWeight: "600", borderRadius: "10px", padding: "2px 10px" }}>
                          {sessao.duracao}
                        </span>
                      )}
                      {sessao.valor != null && (
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#333" }}>
                          R$ {Number(sessao.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {sessao.statusPagamento && (
                        <span style={{ fontSize: "11px", fontWeight: "600", borderRadius: "10px", padding: "2px 10px", background: STATUS_PAGAMENTO[sessao.statusPagamento]?.bg, color: STATUS_PAGAMENTO[sessao.statusPagamento]?.color }}>
                          {STATUS_PAGAMENTO[sessao.statusPagamento]?.label}
                        </span>
                      )}
                    </div>
                    {sessao.notas ? (
                      <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {sessao.notas}
                      </p>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#bbb", margin: 0, fontStyle: "italic" }}>Sem registro escrito.</p>
                    )}
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => openEdit(sessao)}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 14px", background: "white", border: "1px solid #dde3f0",
                      borderRadius: "10px", fontSize: "12px", fontWeight: "600",
                      color: "#1A4FA3", cursor: "pointer", flexShrink: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                      <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                    </svg>
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Count footer */}
      {sessoes.length > 0 && (
        <div style={{ fontSize: "12px", color: "#aaa", textAlign: "right", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
          {sessoes.length} {sessoes.length === 1 ? "sessão registrada" : "sessões registradas"}
        </div>
      )}
    </div>
  );
}

// ─── Shared Q&A panel ─────────────────────────────────────────────────────────
function PainelPerguntas({ titulo, perguntas, respostas, setRespostas }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft]         = useState("");

  const openEdit = (id) => { setEditingId(id); setDraft(respostas[id] || ""); };
  const cancelEdit = ()  => { setEditingId(null); setDraft(""); };
  const handleSave = (id) => {
    setRespostas(prev => ({ ...prev, [id]: draft }));
    setEditingId(null);
    setDraft("");
  };

  const respondidas = perguntas.filter(p => respostas[p.id]?.trim()).length;

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>{titulo}</h2>
        <span style={{
          fontSize: "12px", fontWeight: "600",
          color: respondidas === perguntas.length ? "#2A8A55" : "#1A4FA3",
          background: respondidas === perguntas.length ? "#E8F5EE" : "#EBF3FF",
          borderRadius: "20px", padding: "3px 12px",
        }}>
          {respondidas}/{perguntas.length} respondidas
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {perguntas.map((pergunta, idx) => {
          const resposta  = respostas[pergunta.id]?.trim();
          const isEditing = editingId === pergunta.id;

          return (
            <div
              key={pergunta.id}
              style={{
                border: `1px solid ${isEditing ? "#1A4FA3" : "#eef0f6"}`,
                borderRadius: "12px", padding: "16px 18px",
                display: "flex", flexDirection: "column", gap: "10px",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{
                  minWidth: "22px", height: "22px", borderRadius: "50%",
                  background: isEditing ? "#1A4FA3" : resposta ? "#E8F5EE" : "#f0f0f0",
                  color: isEditing ? "white" : resposta ? "#2A8A55" : "#aaa",
                  fontSize: "11px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "1px",
                }}>
                  {resposta && !isEditing
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : idx + 1
                  }
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#222", lineHeight: "1.5" }}>
                  {pergunta.texto}
                </span>
              </div>

              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "32px" }}>
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="Digite a resposta do paciente..."
                    style={{
                      border: "1px solid #1A4FA3", borderRadius: "8px",
                      padding: "10px 12px", fontSize: "13px", lineHeight: "1.7",
                      resize: "vertical", minHeight: "90px", outline: "none",
                      fontFamily: "inherit", boxSizing: "border-box", width: "100%", color: "#1a1a1a",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button onClick={cancelEdit} style={{ padding: "6px 16px", background: "#e8e8e8", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer" }}>
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSave(pergunta.id)}
                      style={{ padding: "6px 16px", background: "#1A4FA3", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "white", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : resposta ? (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", paddingLeft: "32px" }}>
                  <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: "1.7", flex: 1 }}>{resposta}</p>
                  <button
                    onClick={() => openEdit(pergunta.id)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #dde3f0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                      <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                    </svg>
                    Editar
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "32px" }}>
                  <span style={{ fontSize: "13px", color: "#bbb", fontStyle: "italic" }}>Sem resposta cadastrada.</span>
                  <button
                    onClick={() => openEdit(pergunta.id)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 14px", background: "#EBF3FF", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                  >
                    <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> Cadastrar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Histórico ───────────────────────────────────────────────────────────
function TabHistorico({ pacienteId }) {
  const [respostas, setRespostas] = useState({ ...(HISTORICO_MOCK[pacienteId] || {}) });
  return <PainelPerguntas titulo="Histórico" perguntas={PERGUNTAS_HISTORICO} respostas={respostas} setRespostas={setRespostas} />;
}

// ─── Tab: Saúde Mental ────────────────────────────────────────────────────────
function TabSaudeMental({ pacienteId }) {
  const [respostas, setRespostas] = useState({ ...(HISTORICO_MOCK[pacienteId] || {}) });
  return <PainelPerguntas titulo="Saúde Mental" perguntas={PERGUNTAS_SAUDE_MENTAL} respostas={respostas} setRespostas={setRespostas} />;
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function GraficoEscalas({ escalas }) {
  const sorted = [...escalas].sort((a, b) => a.sessaoNum - b.sessaoNum);
  const W = 600, H = 210;
  const PAD = { top: 16, right: 16, bottom: 36, left: 36 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top  - PAD.bottom;

  const xPos = (i) => PAD.left + (sorted.length < 2 ? cW / 2 : (i / (sorted.length - 1)) * cW);
  const yPos = (v) => PAD.top  + cH - ((v - 1) / 9) * cH;

  const gridVals = [1, 3, 5, 7, 10];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* grid lines */}
      {gridVals.map(v => (
        <g key={v}>
          <line x1={PAD.left} y1={yPos(v)} x2={W - PAD.right} y2={yPos(v)} stroke="#eef0f6" strokeWidth="1" />
          <text x={PAD.left - 6} y={yPos(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#bbb">{v}</text>
        </g>
      ))}
      {/* x-axis session labels */}
      {sorted.map((e, i) => (
        <text key={e.id} x={xPos(i)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9" fill="#aaa">#{e.sessaoNum}</text>
      ))}
      {/* series */}
      {SERIES_ESCALAS.map(({ key, color }) => (
        <g key={key}>
          {sorted.length > 1 && (
            <polyline
              points={sorted.map((e, i) => `${xPos(i)},${yPos(e[key])}`).join(" ")}
              fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            />
          )}
          {sorted.map((e, i) => (
            <g key={e.id}>
              <circle cx={xPos(i)} cy={yPos(e[key])} r="5" fill="white" stroke={color} strokeWidth="2" />
              <text x={xPos(i)} y={yPos(e[key]) - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{e[key]}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── Seção: Metas Terapêuticas ────────────────────────────────────────────────
function SecaoMetas({ pacienteId }) {
  const [metas, setMetas]       = useState([...(METAS_MOCK[pacienteId] || [])]);
  const [editingId, setEditingId] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [form, setForm]         = useState({ ...EMPTY_META });

  const openNew  = () => { setEditingId(null); setForm({ ...EMPTY_META }); setShowNew(true); };
  const openEdit = (m) => { setShowNew(false); setForm({ titulo: m.titulo, status: m.status, notas: m.notas }); setEditingId(m.id); };
  const cancel   = ()  => { setEditingId(null); setShowNew(false); setForm({ ...EMPTY_META }); };

  const save = () => {
    if (!form.titulo.trim()) return;
    if (showNew) {
      const id = metas.length ? Math.max(...metas.map(m => m.id)) + 1 : 1;
      const hoje = new Date().toLocaleDateString("pt-BR");
      setMetas(prev => [...prev, { id, criadaEm: hoje, ...form }]);
      setShowNew(false);
    } else {
      setMetas(prev => prev.map(m => m.id === editingId ? { ...m, ...form } : m));
      setEditingId(null);
    }
    setForm({ ...EMPTY_META });
  };

  const inputStyle = { height: "34px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%", fontFamily: "inherit" };
  const focusBlue  = e => e.target.style.borderColor = "#1A4FA3";
  const blurGray   = e => e.target.style.borderColor = "#dde3f0";

  const FormMeta = ({ title }) => (
    <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>{title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Título da Meta *</label>
        <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Descreva o objetivo terapêutico..." style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "140px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusBlue} onBlur={blurGray}>
            {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Observações</label>
        <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="Anotações sobre a meta (opcional)..." style={{ ...inputStyle, height: "70px", resize: "vertical", padding: "8px 10px", lineHeight: "1.6" }} onFocus={focusBlue} onBlur={blurGray} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={cancel} style={{ padding: "6px 16px", background: "#e8e8e8", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer" }}>Cancelar</button>
        <button onClick={save} disabled={!form.titulo.trim()} style={{ padding: "6px 16px", background: "#1A4FA3", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "white", cursor: !form.titulo.trim() ? "not-allowed" : "pointer", opacity: !form.titulo.trim() ? 0.5 : 1 }}
          onMouseEnter={e => { if (form.titulo.trim()) e.currentTarget.style.filter = "brightness(1.12)"; }}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>
          Salvar
        </button>
      </div>
    </div>
  );

  const alcancadas  = metas.filter(m => m.status === "alcancada").length;
  const emAndamento = metas.filter(m => m.status === "em_andamento").length;

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Metas Terapêuticas</h2>
          {metas.length > 0 && (
            <div style={{ display: "flex", gap: "6px" }}>
              {alcancadas > 0  && <span style={{ fontSize: "11px", fontWeight: "600", background: "#E8F5EE", color: "#2A8A55", borderRadius: "20px", padding: "2px 10px" }}>{alcancadas} alcançada{alcancadas > 1 ? "s" : ""}</span>}
              {emAndamento > 0 && <span style={{ fontSize: "11px", fontWeight: "600", background: "#EBF3FF", color: "#1A4FA3", borderRadius: "20px", padding: "2px 10px" }}>{emAndamento} em andamento</span>}
            </div>
          )}
        </div>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Nova Meta
        </button>
      </div>

      {showNew && <FormMeta title="Nova Meta" />}

      {metas.length === 0 && !showNew ? (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "14px" }}>Nenhuma meta cadastrada ainda.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {metas.map(meta => (
            <div key={meta.id}>
              {editingId === meta.id ? <FormMeta title="Editar Meta" /> : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", border: "1px solid #eef0f6", borderRadius: "12px", padding: "13px 16px", transition: "box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(26,79,163,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  {/* status dot */}
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: STATUS_META[meta.status].color, flexShrink: 0, marginTop: "4px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{meta.titulo}</span>
                      <span style={{ fontSize: "11px", fontWeight: "600", borderRadius: "20px", padding: "2px 10px", background: STATUS_META[meta.status].bg, color: STATUS_META[meta.status].color, flexShrink: 0 }}>
                        {STATUS_META[meta.status].label}
                      </span>
                    </div>
                    {meta.notas && <p style={{ fontSize: "12px", color: "#777", margin: "4px 0 0", lineHeight: "1.5" }}>{meta.notas}</p>}
                    <span style={{ fontSize: "11px", color: "#ccc", marginTop: "4px", display: "block" }}>Criada em {meta.criadaEm}</span>
                  </div>
                  <button onClick={() => openEdit(meta)} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #dde3f0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                      <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                    </svg>
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Seção: Escalas por Sessão ────────────────────────────────────────────────
function SecaoEscalas({ pacienteId }) {
  const [escalas, setEscalas]     = useState([...(ESCALAS_MOCK[pacienteId] || [])]);
  const [editingId, setEditingId] = useState(null);
  const [showNew, setShowNew]     = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_ESCALA });

  const nextSessaoNum = escalas.length ? Math.max(...escalas.map(e => e.sessaoNum)) + 1 : 1;

  const openNew  = () => { setEditingId(null); setForm({ ...EMPTY_ESCALA, sessaoNum: String(nextSessaoNum) }); setShowNew(true); };
  const openEdit = (e) => { setShowNew(false); setForm({ sessaoNum: String(e.sessaoNum), data: e.data, humor: e.humor, ansiedade: e.ansiedade, sono: e.sono, social: e.social }); setEditingId(e.id); };
  const cancel   = ()  => { setEditingId(null); setShowNew(false); setForm({ ...EMPTY_ESCALA }); };

  const save = () => {
    if (!form.data.trim()) return;
    const entry = { sessaoNum: Number(form.sessaoNum) || nextSessaoNum, data: form.data, humor: Number(form.humor), ansiedade: Number(form.ansiedade), sono: Number(form.sono), social: Number(form.social) };
    if (showNew) {
      const id = escalas.length ? Math.max(...escalas.map(e => e.id)) + 1 : 1;
      setEscalas(prev => [...prev, { id, ...entry }].sort((a, b) => a.sessaoNum - b.sessaoNum));
      setShowNew(false);
    } else {
      setEscalas(prev => prev.map(e => e.id === editingId ? { ...e, ...entry } : e).sort((a, b) => a.sessaoNum - b.sessaoNum));
      setEditingId(null);
    }
    setForm({ ...EMPTY_ESCALA });
  };

  const Slider = ({ field, label, color, nota }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}{nota && <span style={{ fontWeight: "400", color: "#E06B4A", marginLeft: "4px" }}>{nota}</span>}
        </label>
        <span style={{ fontSize: "13px", fontWeight: "800", color }}>{form[field]}</span>
      </div>
      <input type="range" min="1" max="10" value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))}
        style={{ accentColor: color, width: "100%", cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "9px", color: "#ccc" }}>1</span>
        <span style={{ fontSize: "9px", color: "#ccc" }}>10</span>
      </div>
    </div>
  );

  const FormEscala = ({ title }) => (
    <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>{title}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nº da Sessão</label>
          <input type="number" min="1" value={form.sessaoNum} onChange={e => setForm(f => ({ ...f, sessaoNum: e.target.value }))}
            style={{ height: "34px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%" }}
            onFocus={e => e.target.style.borderColor = "#1A4FA3"} onBlur={e => e.target.style.borderColor = "#dde3f0"} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Data *</label>
          <input type="text" placeholder="DD/MM/AAAA" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
            style={{ height: "34px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%" }}
            onFocus={e => e.target.style.borderColor = "#1A4FA3"} onBlur={e => e.target.style.borderColor = "#dde3f0"} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
        {SERIES_ESCALAS.map(s => <Slider key={s.key} field={s.key} label={s.label} color={s.color} nota={s.nota} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={cancel} style={{ padding: "6px 16px", background: "#e8e8e8", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer" }}>Cancelar</button>
        <button onClick={save} disabled={!form.data.trim()} style={{ padding: "6px 16px", background: "#1A4FA3", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "white", cursor: !form.data.trim() ? "not-allowed" : "pointer", opacity: !form.data.trim() ? 0.5 : 1 }}
          onMouseEnter={e => { if (form.data.trim()) e.currentTarget.style.filter = "brightness(1.12)"; }}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>
          Salvar
        </button>
      </div>
    </div>
  );

  const sorted = [...escalas].sort((a, b) => a.sessaoNum - b.sessaoNum);

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 2px" }}>Escalas por Sessão</h2>
          <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>Avaliação de 1 (muito baixo) a 10 (muito alto) por sessão.</p>
        </div>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Adicionar Avaliação
        </button>
      </div>

      {showNew && <FormEscala title="Nova Avaliação" />}

      {escalas.length === 0 && !showNew ? (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "14px" }}>Nenhuma avaliação registrada ainda.</div>
      ) : (
        <>
          {/* Chart */}
          {escalas.length > 0 && (
            <div style={{ border: "1px solid #eef0f6", borderRadius: "12px", padding: "14px 10px 6px" }}>
              <GraficoEscalas escalas={sorted} />
              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", paddingTop: "4px", paddingBottom: "8px" }}>
                {SERIES_ESCALAS.map(s => (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "10px", height: "3px", background: s.color, borderRadius: "2px" }} />
                    <span style={{ fontSize: "11px", color: "#666" }}>{s.label}{s.nota && <span style={{ color: "#E06B4A", marginLeft: "3px" }}>{s.nota}</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Records list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sorted.map(e => (
              <div key={e.id}>
                {editingId === e.id ? <FormEscala title={`Editar Avaliação — Sessão #${e.sessaoNum}`} /> : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #eef0f6", borderRadius: "12px", padding: "12px 16px", transition: "box-shadow 0.15s" }}
                    onMouseEnter={el => el.currentTarget.style.boxShadow = "0 2px 10px rgba(26,79,163,0.07)"}
                    onMouseLeave={el => el.currentTarget.style.boxShadow = "none"}>
                    {/* session badge */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#EBF3FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "9px", fontWeight: "700", color: "#1A4FA3", textTransform: "uppercase", lineHeight: 1 }}>Sess.</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#1A4FA3", lineHeight: 1.2 }}>#{e.sessaoNum}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>{e.data}</span>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                        {SERIES_ESCALAS.map(s => (
                          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                            <span style={{ fontSize: "11px", color: "#888" }}>{s.label}:</span>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: s.color }}>{e[s.key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => openEdit(e)} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "5px 12px", background: "white", border: "1px solid #dde3f0", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}
                      onMouseEnter={el => el.currentTarget.style.background = "#f0f4ff"}
                      onMouseLeave={el => el.currentTarget.style.background = "white"}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                        <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2"/>
                      </svg>
                      Editar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tab: Evolução ────────────────────────────────────────────────────────────
function TabEvolucao({ pacienteId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SecaoMetas   pacienteId={pacienteId} />
      <SecaoEscalas pacienteId={pacienteId} />
    </div>
  );
}

// ─── Tab placeholder ──────────────────────────────────────────────────────────
function TabEmBreve({ nome }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "3rem 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center", color: "#bbb", fontSize: "14px" }}>
      A aba <strong style={{ color: "#888" }}>{nome}</strong> ainda não foi implementada.
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VisualizarHistoricoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const paciente = PACIENTES_DATA[Number(id)];

  if (!paciente) {
    return (
      <AppLayout breadcrumb="Histórico >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Paciente não encontrado.
          <br />
          <button onClick={() => navigate("/historico")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb="Histórico >">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/historico")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>
            Histórico — {paciente.nomeCompleto}
          </h1>
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
        {activeTab === 0 && <TabRegistroSessao pacienteId={Number(id)} />}
        {activeTab === 1 && <TabHistorico pacienteId={Number(id)} />}
        {activeTab === 2 && <TabSaudeMental pacienteId={Number(id)} />}
        {activeTab === 3 && <TabEvolucao pacienteId={Number(id)} />}

      </div>
    </AppLayout>
  );
}
