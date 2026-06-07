import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getPacienteById } from "../../shared/services/paciente.service";
import {
  editarMedicamento,
  excluirMedicamento,
  getProntuarioById,
  registrarMedicamento,
} from "../../shared/services/prontuario.service";
import { ProntuarioDTO } from "../../shared/types/dtos/Prontuario.dto";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { StatusMedicamentoUsoEnum } from "../../shared/domain/enums/status-medicamento-uso.enum";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { formatPhone } from "../../shared/utils/formatPhone";
import { getAllPlanosSaude } from "../../shared/services/plano-saude.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { formatCep } from "../../shared/utils";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };


const TABS = ["Informações do Paciente", "Contato de Emergência", "Anotações", "Medicamentos"];

function getInitials(nome: string) {
  const parts = nome.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const AVATAR_COLORS = ["#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7", "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0"];

function formatDateBR(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

function InfoField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{value}</span>
    </div>
  );
}

function TabInfoPaciente({ paciente, planoNome, psicologoNome }: { paciente: PacienteDTO; planoNome: string; psicologoNome: string }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "20px" }}>Informações do Paciente</h2>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 0.8fr", gap: "24px 20px", marginBottom: "24px" }}>
        <InfoField label="Nome Completo" value={paciente.nome} />
        <InfoField label="Data de Nascimento" value={formatDateBR(paciente.dataNascimento)} />
        <InfoField label="CPF/CNPJ" value={formatCpfCnpj(paciente.cpfCnpj)} />
        <InfoField label="Telefone" value={formatPhone(paciente.telefone)} />
        <InfoField label="Psicólogo Responsável" value={psicologoNome} />
      </div>
      <div style={{ borderTop: "1px solid #eef0f6", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "24px 20px" }}>
        <InfoField label="E-mail" value={paciente.email} />
        <InfoField label="Plano de Saúde" value={planoNome || "—"} />
      </div>
    </div>
  );
}

function TabContatoEmergencia({ prontuario }: { prontuario: ProntuarioDTO }) {
  const contato = prontuario.contatoEmergenciaDTO;

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "20px" }}>Contato de Emergência</h2>
      {contato ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px 20px", marginBottom: "24px" }}>
            <InfoField label="Nome" value={contato.nome} />
            <InfoField label="Telefone" value={formatPhone(contato.telefone)} />
            <InfoField label="Relação/Parentesco" value={contato.relacaoParentesco} />
          </div>
          <div style={{ borderTop: "1px solid #eef0f6", marginBottom: "20px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px 20px" }}>
            <InfoField label="CEP" value={formatCep(contato.enderecoDTO?.cep ?? "") || "—"} />
            <InfoField label="Logradouro" value={contato.enderecoDTO.logradouro ?? "—"} />
            <InfoField label="Complemento" value={contato.enderecoDTO?.complemento ?? "—"} />
            <InfoField label="Bairro" value={contato.enderecoDTO?.bairro ?? "—"} />
            <InfoField label="uf" value={contato.enderecoDTO?.uf ?? "—"} />
            <InfoField label="Localidade" value={contato.enderecoDTO?.localidade ?? "—"} />
            <InfoField label="Região" value={contato.enderecoDTO?.regiao ?? "—"} />
          </div>
        </>
      ) : (
        <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>Nenhum contato de emergência cadastrado.</p>
      )}
    </div>
  );
}

function TabAnotacoes({ prontuario }: { prontuario: ProntuarioDTO }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Anotações</h2>
      <div style={{ background: "#FFF8E6", border: "1px solid #FFD97D", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#856404", display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="12" cy="12" r="10" stroke="#856404" strokeWidth="2" fill="none" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="#856404" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="#856404" />
        </svg>
        <span>Este campo contém impressões subjetivas do psicólogo e não compõe o prontuário oficial do paciente.</span>
      </div>
      <div>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notas do Psicólogo (Privado)</span>
        <div style={{ fontSize: "14px", color: prontuario.anotacoes ? "#1a1a1a" : "#bbb", lineHeight: "1.8", whiteSpace: "pre-wrap", marginTop: "8px", minHeight: "60px" }}>
          {prontuario.anotacoes || "Nenhuma anotação registrada. Clique em Editar para adicionar."}
        </div>
      </div>
    </div>
  );
}

type MedForm = { nome: string; dosagem: string; frequencia: string; statusMedicamentoUso: StatusMedicamentoUsoEnum };

function TabMedicamentos({
  prontuario,
  onAdd,
  onEdit,
  onDelete,
}: {
  prontuario: ProntuarioDTO;
  onAdd: (med: MedForm) => Promise<void>;
  onEdit: (id: string, med: MedForm) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  function statusLabel(status?: StatusMedicamentoUsoEnum) {
    if (status === StatusMedicamentoUsoEnum.stsEmUso) return "Em uso";
    if (status === StatusMedicamentoUsoEnum.stsUsado) return "Usado";
    return "—";
  }
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MedForm>({ nome: "", dosagem: "", frequencia: "", statusMedicamentoUso: StatusMedicamentoUsoEnum.stsEmUso });

  const meds = prontuario.medicamentosDTO ?? [];

  const openNew = () => {
    setForm({ nome: "", dosagem: "", frequencia: "", statusMedicamentoUso: StatusMedicamentoUsoEnum.stsEmUso });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (med: { id?: string; nome: string; dosagem: string; frequencia: string; statusMedicamentoUso?: StatusMedicamentoUsoEnum }) => {
    if (!med.id) return;
    setForm({ nome: med.nome, dosagem: med.dosagem, frequencia: med.frequencia, statusMedicamentoUso: med.statusMedicamentoUso ?? StatusMedicamentoUsoEnum.stsEmUso });
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) return;

    if (editingId) {
      await onEdit(editingId, form);
    } else {
      await onAdd(form);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ nome: "", dosagem: "", frequencia: "" });
  };

  return (
    <div style={{ background: "white", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Medicamentos</h2>
        <button
          onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#1A4FA3", border: "none", borderRadius: "16px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
        >
          <span style={{ fontSize: "17px", lineHeight: 1 }}>+</span> Adicionar
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f7f9ff", border: "1px solid #dde3f0", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>
            {editingId ? "Editar Medicamento" : "Novo Medicamento"}
          </span>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input placeholder="Nome do medicamento *" value={form.nome} onChange={e => setForm(current => ({ ...current, nome: e.target.value }))} style={{ flex: 1, minWidth: "180px", height: "36px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", outline: "none" }} />
            <input placeholder="Dose (ex: 50mg)" value={form.dosagem} onChange={e => setForm(current => ({ ...current, dosagem: e.target.value }))} style={{ width: "120px", height: "36px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", outline: "none" }} />
            <input placeholder="Frequência (ex: 1x ao dia)" value={form.frequencia} onChange={e => setForm(current => ({ ...current, frequencia: e.target.value }))} style={{ flex: 1, minWidth: "160px", height: "36px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 10px", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="radio" name="statusUso" checked={form.statusMedicamentoUso === StatusMedicamentoUsoEnum.stsEmUso} onChange={() => setForm(f => ({ ...f, statusMedicamentoUso: StatusMedicamentoUsoEnum.stsEmUso }))} style={{ width: "15px", height: "15px", accentColor: "#1A4FA3" }} />
              <span style={{ fontSize: "13px", color: "#555" }}>Em uso</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="radio" name="statusUso" checked={form.statusMedicamentoUso === StatusMedicamentoUsoEnum.stsUsado} onChange={() => setForm(f => ({ ...f, statusMedicamentoUso: StatusMedicamentoUsoEnum.stsUsado }))} style={{ width: "15px", height: "15px", accentColor: "#1A4FA3" }} />
              <span style={{ fontSize: "13px", color: "#555" }}>Usado</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ padding: "6px 16px", background: "#e0e0e0", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}>Cancelar</button>
            <button onClick={handleSave} style={{ padding: "6px 16px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}>Salvar</button>
          </div>
        </div>
      )}

      {meds.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "14px" }}>
          Nenhum medicamento cadastrado.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {meds.map(med => (
            <div key={med.id ?? `${med.nome}-${med.dosagem}`} style={{ display: "flex", alignItems: "center", gap: "14px", border: "1px solid #eef0f6", borderRadius: "12px", padding: "12px 16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="10" width="18" height="4" rx="2" stroke="#1A4FA3" strokeWidth="2" fill="none" />
                  <rect x="7" y="6" width="10" height="12" rx="5" stroke="#1A4FA3" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>{med.nome}</div>
                <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>
                  {med.dosagem && <span>{med.dosagem}</span>}
                  {med.dosagem && med.frequencia && <span style={{ margin: "0 6px", color: "#ccc" }}>·</span>}
                  {med.frequencia && <span>{med.frequencia}</span>}
                  <span style={{ marginLeft: "8px", color: "#999" }}>• {statusLabel(med.statusMedicamentoUso)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => med.id && openEdit(med)} title="Editar" style={{ width: "32px", height: "32px", border: "1px solid #dde3f0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none" /><line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2" /></svg>
                </button>
                <button onClick={() => med.id && onDelete(med.id)} title="Remover" style={{ width: "32px", height: "32px", border: "1px solid #ffd0d0", borderRadius: "8px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="6" y1="6" x2="18" y2="18" stroke="#e05050" strokeWidth="2" strokeLinecap="round" /><line x1="18" y1="6" x2="6" y2="18" stroke="#e05050" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VisualizarProntuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [prontuario, setProntuario] = useState<ProntuarioDTO | null>(null);
  const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planosPorId, setPlanosPorId] = useState<Record<string, string>>({});
  const [psicologosPorId, setPsicologosPorId] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [confirmMedId, setConfirmMedId] = useState<string | null>(null);
  const [excluindoMed, setExcluindoMed] = useState(false);

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

  useEffect(() => {
    let active = true;

    async function loadPsicologos() {
      try {
        const psicologos = await getAllPsicologos();
        if (!active) return;

        const map = psicologos.reduce<Record<string, string>>((acc, psicologo) => {
          if (psicologo.id) {
            acc[psicologo.id] = psicologo.nome;
          }
          return acc;
        }, {});

        setPsicologosPorId(map);
      } catch {
        if (active) {
          setPsicologosPorId({});
        }
      }
    }

    loadPsicologos();

    return () => {
      active = false;
    };
  }, []);

  const loadData = async () => {
    if (!id) {
      setError("Prontuário não informado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const prontuarioCarregado = await getProntuarioById(id);
      setProntuario(prontuarioCarregado);

      const pacienteCarregado = await getPacienteById(prontuarioCarregado.pacienteId);
      setPaciente(pacienteCarregado);
    } catch {
      setError("Prontuário não encontrado ou indisponível.");
      setProntuario(null);
      setPaciente(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pacienteResumo = useMemo(() => {
    if (!paciente) return null;

    const nomePlano =
      paciente.planoSaudePacienteDTO?.planoSaudeDTO?.nome ??
      (paciente.planoSaudePacienteDTO?.planoSaudeId ? planosPorId[paciente.planoSaudePacienteDTO.planoSaudeId] : undefined) ??
      "—";

    return {
      nome: paciente.nome,
      nascimento: formatDateBR(paciente.dataNascimento),
      cpf: paciente.cpfCnpj,
      telefone: paciente.telefone,
      email: paciente.email,
      plano: nomePlano,
      psicologo: (paciente.psicologoId ? psicologosPorId[paciente.psicologoId] : undefined) ?? "—",
    };
  }, [paciente, planosPorId, psicologosPorId]);

  const handleAddMedication = async (med: { nome: string; dosagem: string; frequencia: string }) => {
    if (!prontuario?.id) return;
    try {
      await registrarMedicamento(prontuario.id, { prontuarioId: prontuario.id, ...med });
      await loadData();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.CREATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    }
  };

  const handleEditMedication = async (medId: string, med: { nome: string; dosagem: string; frequencia: string; statusMedicamentoUso?: StatusMedicamentoUsoEnum }) => {
    if (!prontuario?.id) return;
    try {
      await editarMedicamento(prontuario.id, medId, { id: medId, prontuarioId: prontuario.id, ...med });
      await loadData();
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    }
  };

  const handleDeleteMedication = async (medId: string) => {
    setConfirmMedId(medId);
  };

  const confirmDeleteMedication = async () => {
    if (!prontuario?.id || !confirmMedId) return;
    try {
      setExcluindoMed(true);
      await excluirMedicamento(prontuario.id, confirmMedId);
      await loadData();
      setConfirmMedId(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmMedId(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoMed(false);
    }
  };

  if (loading) {
    return (
      <AppLayout breadcrumb="Prontuário >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando prontuário...</div>
      </AppLayout>
    );
  }

  if (error || !prontuario || !paciente || !pacienteResumo) {
    return (
      <AppLayout breadcrumb="Prontuário >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          {error ?? "Prontuário não encontrado."}
          <br />
          <button onClick={() => navigate("/prontuario")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            ← Voltar
          </button>
        </div>
      </AppLayout>
    );
  }

  const editRoute =
    activeTab === 1 ? `/prontuario/${prontuario.id}/editar-contato` :
      activeTab === 2 ? `/prontuario/${prontuario.id}/editar-anotacoes` :
        null;

  return (
    <AppLayout breadcrumb="Prontuário >">
      {confirmMedId && (
        <ModalConfirm
          actionType="delete"
          message="Deseja realmente excluir este medicamento? Esta ação não poderá ser desfeita."
          loading={excluindoMed}
          onConfirm={confirmDeleteMedication}
          onClose={() => setConfirmMedId(null)}
        />
      )}

      {status && (
        <ModalMessagesStatus
          type={status.type}
          message={status.message}
          details={status.details}
          onClose={() => setStatus(null)}
        />
      )}

      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => navigate("/prontuario")} style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}>‹ Voltar</button>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Prontuário</h1>
          </div>

          {editRoute && (
            <button onClick={() => navigate(editRoute)} style={{ display: "flex", alignItems: "center", gap: "7px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "9px 20px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" /><line x1="13" y1="7" x2="17" y2="11" stroke="white" strokeWidth="2" /></svg>
              Editar
            </button>
          )}
        </div>

        <div style={{ display: "flex", borderBottom: "2px solid #dde3f0", overflowX: "auto" }}>
          {TABS.map((tab, index) => (
            <div key={tab} onClick={() => setActiveTab(index)} style={{ padding: "8px 14px", fontSize: "12px", fontWeight: activeTab === index ? "700" : "500", color: activeTab === index ? "#1A4FA3" : "#888", borderBottom: activeTab === index ? "2px solid #1A4FA3" : "2px solid transparent", marginBottom: "-2px", cursor: "pointer", whiteSpace: "nowrap" }}>
              {tab}
            </div>
          ))}
        </div>

        {activeTab === 0 && <TabInfoPaciente paciente={paciente} planoNome={pacienteResumo.plano} psicologoNome={pacienteResumo.psicologo} />}
        {activeTab === 1 && <TabContatoEmergencia prontuario={prontuario} />}
        {activeTab === 2 && <TabAnotacoes prontuario={prontuario} />}
        {activeTab === 3 && <TabMedicamentos prontuario={prontuario} onAdd={handleAddMedication} onEdit={handleEditMedication} onDelete={handleDeleteMedication} />}
      </div>
    </AppLayout>
  );
}