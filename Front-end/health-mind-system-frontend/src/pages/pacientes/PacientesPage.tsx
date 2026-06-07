import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { RHFTextField } from "../../shared/components/RHFTextField";
import { RHFSelectField } from "../../shared/components/RHFSelectField";
import { getAllPacientes, registrarPaciente } from "../../shared/services/paciente.service";
import { getAllPlanosSaude } from "../../shared/services/plano-saude.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { PlanoSaudeDTO } from "../../shared/types/dtos/PlanoSaude.dto";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { formatPhone } from "../../shared/utils/formatPhone";
import { pacienteValidation, PacienteFormData } from "../../shared/validations/paciente/paciente.validation";
import { Pagination, usePagination } from "../../shared/components/Pagination";

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?";
}

function sortByNome<T extends { nome: string }>(items: T[]) {
  return [...items].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function toDateInputValue(value?: string | Date) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function toIsoDateString(value: string) {
  return new Date(`${value}T00:00:00`).toISOString();
}

function ModalNovoPaciente({
  psicologos,
  planosSaude,
  onClose,
  onSaved,
}: {
  psicologos: PsicologoDTO[];
  planosSaude: PlanoSaudeDTO[];
  onClose: () => void;
  onSaved: (paciente: PacienteDTO) => void;
}) {
  const inputStyle = {
    height: "38px",
    border: "1px solid #dde3f0",
    borderRadius: "8px",
    padding: "0 12px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: "inherit",
    background: "white",
    color: "#1a1a1a",
  };
  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#1A4FA3";
  };
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#dde3f0";
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteValidation),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      telefone: "",
      dataNascimento: "",
      psicologoId: "",
      hasPlanoSaude: false,
      planoSaudeId: "",
      numeroCarteirinha: "",
      dataValidadeCarteirinha: "",
    },
    mode: "onChange",
  });

  const hasPlanoSaude = watch("hasPlanoSaude");

  const psicologoOptions = sortByNome(psicologos).map(psicologo => ({
    value: psicologo.id ?? "",
    label: `${psicologo.nome} - ${psicologo.crp}`,
  }));

  const planoOptions = sortByNome(planosSaude).map(plano => ({
    value: plano.id ?? "",
    label: `${plano.nome} - ${plano.codigo}`,
  }));

  const onSubmit = handleSubmit(async values => {
    const criado = await registrarPaciente({
      nome: values.nome.trim(),
      email: values.email.trim(),
      cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
      telefone: values.telefone.replace(/\D/g, ""),
      dataNascimento: values.dataNascimento,
      psicologoId: values.psicologoId,
      planoSaudePacienteDTO: values.hasPlanoSaude
        ? {
          planoSaudeId: values.planoSaudeId,
          numeroCarteirinha: values.numeroCarteirinha.trim(),
          dataValidade: values.dataValidadeCarteirinha,
          // dataValidade: toIsoDateString(values.dataValidadeCarteirinha),
        }
        : undefined,
    });

    onSaved(criado);
    reset();
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "540px", maxWidth: "92vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Paciente</h2>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Nome completo do paciente" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <RHFTextField control={control} errors={errors} name="email" label="E-mail *" placeholder="email@exemplo.com" type="email" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF / CNPJ *" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
          <RHFTextField control={control} errors={errors} name="telefone" label="Telefone *" placeholder="(00) 00000-0000" mask={formatPhone} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <RHFTextField control={control} errors={errors} name="dataNascimento" label="Data de Nascimento *" type="date" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
          <RHFSelectField
            control={control}
            errors={errors}
            name="psicologoId"
            label="Psicólogo Responsável *"
            placeholder={psicologos.length ? "Selecione o psicólogo" : "Nenhum psicólogo disponível"}
            options={psicologoOptions}
            inputStyle={inputStyle}
            disabled={!psicologos.length}
            onFocus={focusBlue}
            onBlur={blurGray}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0 0" }}>
          <input
            type="checkbox"
            checked={hasPlanoSaude}
            onChange={e => {
              const checked = e.target.checked;
              setValue("hasPlanoSaude", checked, { shouldValidate: true, shouldDirty: true });

              if (!checked) {
                setValue("planoSaudeId", "", { shouldValidate: true, shouldDirty: true });
                setValue("numeroCarteirinha", "", { shouldValidate: true, shouldDirty: true });
                setValue("dataValidadeCarteirinha", "", { shouldValidate: true, shouldDirty: true });
              }
            }}
            style={{ width: "16px", height: "16px", accentColor: "#1A4FA3" }}
          />
          <span style={{ fontSize: "13px", color: "#333", fontWeight: 600 }}>
            Paciente possui convênio / plano de saúde
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <RHFSelectField
            control={control}
            errors={errors}
            name="planoSaudeId"
            label="Plano de Saúde *"
            placeholder={planoOptions.length ? "Selecione o plano" : "Nenhum plano disponível"}
            options={planoOptions}
            inputStyle={inputStyle}
            disabled={!hasPlanoSaude || !planoOptions.length}
            onFocus={focusBlue}
            onBlur={blurGray}
          />
          <RHFTextField
            control={control}
            errors={errors}
            name="numeroCarteirinha"
            label="Número da carteirinha *"
            placeholder="Digite o número da carteirinha"
            disabled={!hasPlanoSaude}
            inputStyle={inputStyle}
            onFocus={focusBlue}
            onBlur={blurGray}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <RHFTextField
            control={control}
            errors={errors}
            name="dataValidadeCarteirinha"
            label="Validade da carteirinha *"
            type="date"
            disabled={!hasPlanoSaude}
            inputStyle={inputStyle}
            onFocus={focusBlue}
            onBlur={blurGray}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !isValid || isSubmitting || !psicologos.length ? "not-allowed" : "pointer", opacity: !isValid || isSubmitting || !psicologos.length ? 0.5 : 1 }}
            onMouseEnter={e => { if (isValid && !isSubmitting && psicologos.length) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            {isSubmitting ? "Salvando..." : "Salvar Paciente"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PacientesPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [planosSaude, setPlanosSaude] = useState<PlanoSaudeDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [loadingPsicologos, setLoadingPsicologos] = useState(true);
  const [loadingPlanos, setLoadingPlanos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarPacientes() {
      try {
        setLoadingPacientes(true);
        const dados = await getAllPacientes();

        if (!isActive) {
          return;
        }

        setPacientes(sortByNome(dados));
      } catch {
        if (isActive) {
          setError("Não foi possível carregar os pacientes.");
        }
      } finally {
        if (isActive) {
          setLoadingPacientes(false);
        }
      }
    }

    carregarPacientes();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function carregarPsicologos() {
      try {
        setLoadingPsicologos(true);
        const dados = await getAllPsicologos();

        if (!isActive) {
          return;
        }

        setPsicologos(sortByNome(dados));
      } catch {
        if (isActive) {
          setError("Não foi possível carregar os psicólogos para o cadastro.");
        }
      } finally {
        if (isActive) {
          setLoadingPsicologos(false);
        }
      }
    }

    carregarPsicologos();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function carregarPlanosSaude() {
      try {
        setLoadingPlanos(true);
        const dados = await getAllPlanosSaude();

        if (!isActive) {
          return;
        }

        setPlanosSaude(sortByNome(dados));
      } catch {
        if (isActive) {
          setError("Não foi possível carregar os planos de saúde para o cadastro.");
        }
      } finally {
        if (isActive) {
          setLoadingPlanos(false);
        }
      }
    }

    carregarPlanosSaude();

    return () => {
      isActive = false;
    };
  }, []);

  const filtrados = pacientes.filter(paciente =>
    [paciente.nome, paciente.email, paciente.cpfCnpj, paciente.telefone]
      .filter(Boolean)
      .some(campo => campo.toLowerCase().includes(busca.toLowerCase()))
  );

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  const handleSaved = (novoPaciente: PacienteDTO) => {
    setPacientes(prev => sortByNome([...prev, novoPaciente]));
    setShowModal(false);
  };

  const COL = "220px 140px 150px minmax(0, 1fr) 140px";

  return (
    <AppLayout breadcrumb="Pacientes >">
      {showModal && (
        <ModalNovoPaciente
          psicologos={psicologos}
          planosSaude={planosSaude}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}

      <div style={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Pacientes</h1>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 32px", fontSize: "13px", outline: "none", width: "240px", color: "#333", background: "white" }}
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
              Adicionar Paciente
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Paciente", "CPF/CNPJ", "Telefone", "E-mail", "Ações"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
            ))}
          </div>

          {loadingPacientes || loadingPsicologos ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Carregando pacientes...
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum paciente encontrado.
            </div>
          ) : (
            pageItems.map((paciente, index) => {
              const pacienteId = paciente.id ?? "";
              const rowBg = index % 2 === 0 ? "white" : "#f9fafc";
              const avatarColorIndex = (Number(pacienteId) || index) % AVATAR_COLORS.length;

              return (
                <div
                  key={pacienteId || `${paciente.nome}-${index}`}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: AVATAR_COLORS[avatarColorIndex], color: "white", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {getInitials(paciente.nome)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{paciente.nome}</span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#555" }}>{formatCpfCnpj(paciente.cpfCnpj) || "—"}</div>
                  <div style={{ fontSize: "13px", color: "#555" }}>{formatPhone(paciente.telefone) || "—"}</div>
                  <div style={{ fontSize: "13px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{paciente.email || "—"}</div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/paciente/${pacienteId}/editar`)}
                      disabled={!pacienteId}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: !pacienteId ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: !pacienteId ? 0.55 : 1 }}
                      onMouseEnter={e => { if (pacienteId) e.currentTarget.style.background = "#d0e4ff"; }}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none" />
                        <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2" />
                      </svg>
                      Editar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "paciente encontrado" : "pacientes encontrados"}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AppLayout>
  );
}

