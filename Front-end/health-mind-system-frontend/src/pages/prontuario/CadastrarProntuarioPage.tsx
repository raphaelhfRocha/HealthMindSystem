import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import SearchEnderecoByCEP from "../../shared/components/SearchEnderecoByCEP/SearchEnderecoByCEP";
import { registrarProntuario } from "../../shared/services/prontuario.service";
import { getPacienteById } from "../../shared/services/paciente.service";
import { getAllPlanosSaude } from "../../shared/services/plano-saude.service";
import { StatusProntuarioEnum } from "../../shared/domain/enums/status-prontuario.enum";
import { StatusMedicamentoUsoEnum } from "../../shared/domain/enums/status-medicamento-uso.enum";
import { EnderecoDTO } from "../../shared/types/dtos/Endereco.dto";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { ContatoEmergenciaDTO } from "../../shared/types/dtos/ContatoEmergencia.dto";
import { ProntuarioDTO } from "../../shared/types/dtos/Prontuario.dto";
import { formatPhone } from "../../shared/utils/formatPhone";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";

type MedicamentoForm = {
  id: number;
  nome: string;
  dosagem: string;
  frequencia: string;
  statusMedicamentoUso: StatusMedicamentoUsoEnum;
};

type ContatoForm = {
  nome: string;
  telefone: string;
  relacaoParentesco: string;
  enderecoDTO: EnderecoDTO;
};

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

function formatDateBR(value?: string | Date | null) {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("pt-BR");
}

const EMPTY_ENDERECO: EnderecoDTO = {
  cep: "",
  logradouro: "",
  complemento: "",
  bairro: "",
  uf: "",
  localidade: "",
  regiao: "",
};

function createEmptyContato(): ContatoForm {
  return {
    nome: "",
    telefone: "",
    relacaoParentesco: "",
    enderecoDTO: { ...EMPTY_ENDERECO },
  };
}

function createEmptyMedicamento(): Omit<MedicamentoForm, "id"> {
  return {
    nome: "",
    dosagem: "",
    frequencia: "",
    statusMedicamentoUso: StatusMedicamentoUsoEnum.stsEmUso,
  };
}

export default function CadastrarProntuarioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("paciente") ?? "";

  const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
  const [carregandoPaciente, setCarregandoPaciente] = useState(false);
  const [erroPaciente, setErroPaciente] = useState<string | null>(null);
  const [planosPorId, setPlanosPorId] = useState<Record<string, string>>({});

  const [contato, setContato] = useState<ContatoForm>(createEmptyContato);
  const [anotacoes, setAnotacoes] = useState("");
  const [meds, setMeds] = useState<MedicamentoForm[]>([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [editingMedId, setEditingMedId] = useState<number | null>(null);
  const [medForm, setMedForm] = useState<Omit<MedicamentoForm, "id">>(createEmptyMedicamento);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPaciente() {
      if (!pacienteId) {
        setErroPaciente("Paciente não informado na abertura da tela.");
        setPaciente(null);
        return;
      }

      try {
        setCarregandoPaciente(true);
        setErroPaciente(null);

        const response = await getPacienteById(pacienteId);

        if (!active) {
          return;
        }

        setPaciente(response);
      } catch {
        if (!active) {
          return;
        }

        setPaciente(null);
        setErroPaciente("Não foi possível carregar os dados do paciente.");
      } finally {
        if (active) {
          setCarregandoPaciente(false);
        }
      }
    }

    loadPaciente();

    return () => {
      active = false;
    };
  }, [pacienteId]);

  useEffect(() => {
    let active = true;

    async function loadPlanos() {
      try {
        const planos = await getAllPlanosSaude();
        if (!active) return;

        const map = planos.reduce<Record<string, string>>((acc, plano) => {
          if (plano.id) {
            acc[plano.id] = plano.nome;
          }
          return acc;
        }, {});

        setPlanosPorId(map);
      } catch {
        if (active) {
          setPlanosPorId({});
        }
      }
    }

    loadPlanos();

    return () => {
      active = false;
    };
  }, []);

  const podeSalvar = Boolean(pacienteId) && Boolean(anotacoes.trim()) && !saving && !carregandoPaciente && !erroPaciente;

  const pacienteResumo = useMemo(() => {
    if (!paciente) {
      return null;
    }

    const nomePlano =
      paciente.planoSaudePacienteDTO?.planoSaudeDTO?.nome ??
      (paciente.planoSaudePacienteDTO?.planoSaudeId ? planosPorId[paciente.planoSaudePacienteDTO.planoSaudeId] : undefined) ??
      "—";

    return {
      nome: paciente.nome,
      nascimento: formatDateBR(paciente.dataNascimento),
      cpfCnpj: formatCpfCnpj(paciente.cpfCnpj),
      telefone: formatPhone(paciente.telefone),
      email: paciente.email,
      psicologoId: paciente.psicologoId,
      plano: nomePlano,
    };
  }, [paciente, planosPorId]);

  const handleSave = async () => {
    if (!podeSalvar) return;

    try {
      setSaving(true);

      const prontoarioPayload: ProntuarioDTO = {
        pacienteId,
        anotacoes,
        dataAbertura: new Date().toISOString(),
        statusProntuario: StatusProntuarioEnum.stsAtivo,
        medicamentosDTO: meds.map((medicamento) => ({
          nome: medicamento.nome,
          dosagem: medicamento.dosagem,
          frequencia: medicamento.frequencia,
          statusMedicamentoUso: medicamento.statusMedicamentoUso,
        })),
      };

      const contatoTemDados = Boolean(
        contato.nome.trim() ||
        contato.telefone.trim() ||
        contato.relacaoParentesco.trim() ||
        contato.enderecoDTO.cep.trim() ||
        contato.enderecoDTO.logradouro.trim() ||
        contato.enderecoDTO.bairro.trim() ||
        contato.enderecoDTO.localidade.trim()
      );

      if (contatoTemDados) {
        prontoarioPayload.contatoEmergenciaDTO = {
          prontuarioId: "",
          nome: contato.nome,
          telefone: contato.telefone,
          relacaoParentesco: contato.relacaoParentesco,
          enderecoDTO: contato.enderecoDTO,
        };
      }

      const response = await registrarProntuario(prontoarioPayload);
      setSaved(true);
      setTimeout(() => navigate(response.id ? `/prontuario/${response.id}` : "/prontuario"), 1200);
    } catch (e) {
      alert("Não foi possível salvar o prontuário. Verifique os campos obrigatórios e tente novamente.");
    } finally {
      setSaving(false);
    }
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
                  <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cadastrado!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {saving ? "Salvando..." : "Cadastrar Prontuário"}
              </>
            )}
          </button>
        </div>

        <SectionCard title="Informações do Paciente">
          {carregandoPaciente ? (
            <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Carregando dados do paciente...</p>
          ) : erroPaciente ? (
            <p style={{ margin: 0, color: "#b84545", fontSize: "13px" }}>{erroPaciente}</p>
          ) : pacienteResumo ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
                <Field label="Nome Completo" value={pacienteResumo.nome} readOnly />
                <Field label="Data de Nascimento" value={pacienteResumo.nascimento} readOnly />
                <Field label="CPF/CNPJ" value={pacienteResumo.cpfCnpj} readOnly />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.45fr 1fr", gap: "16px" }}>
                <Field label="Telefone" value={pacienteResumo.telefone} readOnly />
                <Field label="E-mail" value={pacienteResumo.email} readOnly />
                <Field label="Plano de Saúde" value={pacienteResumo.plano} readOnly />
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Nenhum paciente carregado.</p>
          )}
        </SectionCard>

        <SectionCard title="Contato de Emergência">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="Nome do Contato" value={contato.nome} onChange={(val) => setContato(current => ({ ...current, nome: val }))} placeholder="Nome completo" />
            <Field label="Telefone" value={formatPhone(contato.telefone)} onChange={(val) => setContato(current => ({ ...current, telefone: val }))} placeholder="(00) 00000-0000" type="tel" />
            <Field label="Relação/Parentesco" value={contato.relacaoParentesco} onChange={(val) => setContato(current => ({ ...current, relacaoParentesco: val }))} placeholder="Ex: Mãe, Pai, Cônjuge" />
          </div>

          <div>
            <SearchEnderecoByCEP
              value={contato.enderecoDTO}
              onChangeEndereco={(end) => {
                setContato(c => ({
                  ...c,
                  enderecoDTO: end,
                }));
              }}
              inputStyle={inputStyle}
            />
          </div>
        </SectionCard>

        <SectionCard title="Anotações">
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            background: "#fffbec", border: "1px solid #f5dfa0", borderRadius: "8px", padding: "12px 14px",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="9" stroke="#c4900a" strokeWidth="2" fill="none" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="#c4900a" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="#c4900a" />
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
              value={anotacoes}
              onChange={e => setAnotacoes(e.target.value)}
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

        <SectionCard title="Medicamentos">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
              {meds.length === 0 ? "Nenhum medicamento cadastrado." : `${meds.length} medicamento(s) cadastrado(s).`}
            </p>
            {!showMedForm && editingMedId === null && (
              <button
                onClick={() => { setMedForm(createEmptyMedicamento()); setShowMedForm(true); }}
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
                  <line x1="12" y1="5" x2="12" y2="19" stroke="#1A4FA3" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" stroke="#1A4FA3" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Adicionar
              </button>
            )}
          </div>

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
                  { label: "Dose", key: "dosagem", placeholder: "Ex: 20mg" },
                  { label: "Frequência", key: "frequencia", placeholder: "Ex: 1x ao dia" },
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

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="statusUso"
                    checked={medForm.statusMedicamentoUso === StatusMedicamentoUsoEnum.stsEmUso}
                    onChange={() => setMedForm(f => ({ ...f, statusMedicamentoUso: StatusMedicamentoUsoEnum.stsEmUso }))}
                    style={{ width: "15px", height: "15px", accentColor: "#1A4FA3", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}>Em uso</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="statusUso"
                    checked={medForm.statusMedicamentoUso === StatusMedicamentoUsoEnum.stsUsado}
                    onChange={() => setMedForm(f => ({ ...f, statusMedicamentoUso: StatusMedicamentoUsoEnum.stsUsado }))}
                    style={{ width: "15px", height: "15px", accentColor: "#1A4FA3", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}>Usado</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    if (!medForm.nome.trim()) return;
                    if (editingMedId !== null) {
                      setMeds(ms => ms.map(m => m.id === editingMedId ? { ...m, ...medForm, id: editingMedId } : m));
                      setEditingMedId(null);
                    } else {
                      setMeds(ms => [...ms, { ...medForm, id: Date.now() }]);
                      setShowMedForm(false);
                    }
                    setMedForm(createEmptyMedicamento());
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
                  onClick={() => { setShowMedForm(false); setEditingMedId(null); setMedForm(createEmptyMedicamento()); }}
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
                    </div>
                    <span style={{ fontSize: "12px", color: "#777" }}>
                      {[m.dosagem, m.frequencia].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
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
