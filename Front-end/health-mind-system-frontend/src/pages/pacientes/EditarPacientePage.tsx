import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { RHFTextField } from "../../shared/components/RHFTextField";
import { RHFSelectField } from "../../shared/components/RHFSelectField";
import { editarPaciente, getPacienteById } from "../../shared/services/paciente.service";
import { getAllPlanosSaude } from "../../shared/services/plano-saude.service";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { PacienteDTO } from "../../shared/types/dtos/Paciente.dto";
import { PlanoSaudeDTO } from "../../shared/types/dtos/PlanoSaude.dto";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { formatPhone } from "../../shared/utils/formatPhone";
import { pacienteValidation, PacienteFormData } from "../../shared/validations/paciente/paciente.validation";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

function sortByNome<T extends { nome: string }>(items: T[]) {
  return [...items].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function toIsoDateString(value: string) {
  return new Date(`${value}T00:00:00`).toISOString();
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

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function buildBirthDateLabel(value?: string | Date) {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "—";
  }

  return date.toLocaleDateString("pt-BR");
}

export function EditarPacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pacienteId = id ?? "";
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingValues, setPendingValues] = useState<PacienteFormData | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [planosSaude, setPlanosSaude] = useState<PlanoSaudeDTO[]>([]);

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

  useEffect(() => {
    let isActive = true;

    async function carregarPaciente() {
      try {
        setLoading(true);

        const [pacienteCarregado, psicologosCarregados, planosCarregados] = await Promise.all([
          getPacienteById(pacienteId),
          getAllPsicologos(),
          getAllPlanosSaude(),
        ]);

        if (!isActive) {
          return;
        }

        setPaciente(pacienteCarregado);
        setPsicologos(sortByNome(psicologosCarregados));
        setPlanosSaude(sortByNome(planosCarregados));

        const planoPaciente = pacienteCarregado.planoSaudePacienteDTO;

        reset({
          nome: pacienteCarregado.nome ?? "",
          email: pacienteCarregado.email ?? "",
          cpfCnpj: formatCpfCnpj(pacienteCarregado.cpfCnpj ?? ""),
          telefone: formatPhone(pacienteCarregado.telefone) ? formatPhone(pacienteCarregado.telefone.replace(/\D/g, "")) : "",
          dataNascimento: toDateInputValue(pacienteCarregado.dataNascimento),
          psicologoId: pacienteCarregado.psicologoId ?? "",
          hasPlanoSaude: Boolean(planoPaciente),
          pacienteId: pacienteCarregado.id ?? "",
          planoSaudeId: planoPaciente?.planoSaudeId ?? "",
          numeroCarteirinha: planoPaciente?.numeroCarteirinha ?? "",
          dataValidadeCarteirinha: toDateInputValue(planoPaciente?.dataValidade),
        });
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar o paciente." });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarPaciente();

    return () => {
      isActive = false;
    };
  }, [pacienteId, reset]);

  const inputStyle = {
    height: "40px",
    border: "1px solid #dde3f0",
    borderRadius: "10px",
    padding: "0 12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: "inherit",
    color: "#1a1a1a",
    background: "white",
  };
  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#1A4FA3";
  };
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#dde3f0";
  };

  const onSubmit = handleSubmit(values => {
    if (!pacienteId) {
      return;
    }

    setPendingValues(values);
    setConfirmOpen(true);
  });

  const handleConfirmUpdate = async () => {
    if (!pacienteId || !pendingValues) {
      return;
    }

    const values = pendingValues;
    setSaving(true);

    try {
      const atualizado = await editarPaciente(pacienteId, {
        id: pacienteId,
        nome: values.nome.trim(),
        email: values.email.trim(),
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        telefone: normalizePhone(values.telefone),
        dataNascimento: values.dataNascimento,
        psicologoId: values.psicologoId,
        planoSaudePacienteDTO: values.hasPlanoSaude
          ? {
            pacienteId: pacienteId,
            planoSaudeId: values.planoSaudeId,
            numeroCarteirinha: values.numeroCarteirinha.trim(),
            dataValidade: toIsoDateString(values.dataValidadeCarteirinha),
          }
          : undefined,
      });

      setPaciente(atualizado);
      setConfirmOpen(false);
      setPendingValues(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmOpen(false);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout breadcrumb="Pacientes >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Carregando paciente...
        </div>
      </AppLayout>
    );
  }

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

  const psicologoOptions = psicologos.map(psicologo => ({
    value: psicologo.id ?? "",
    label: `${psicologo.nome} - ${psicologo.crp}`,
  }));

  const planoOptions = sortByNome(planosSaude).map(plano => ({
    value: plano.id ?? "",
    label: `${plano.nome} - ${plano.codigo}`,
  }));

  return (
    <AppLayout breadcrumb="Pacientes >">
      {confirmOpen && (
        <ModalConfirm
          actionType="update"
          message="Tem certeza que deseja salvar as alterações deste paciente?"
          loading={saving}
          onConfirm={handleConfirmUpdate}
          onClose={() => setConfirmOpen(false)}
        />
      )}

      {status && (
        <ModalMessagesStatus
          type={status.type}
          message={status.message}
          details={status.details}
          onClose={() => {
            const wasSuccess = status.type === "success";
            setStatus(null);
            if (wasSuccess) {
              navigate("/paciente");
            }
          }}
        />
      )}

      <div style={{ width: "100%", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/paciente")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Editar Paciente</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Paciente</h2>

          <RHFTextField
           control={control}
           errors={errors}
           name="nome"
           label="Nome Completo *"
           placeholder="Nome completo do paciente"
           inputStyle={inputStyle}
           onFocus={focusBlue}
           onBlur={blurGray}
           />
          <RHFTextField
           control={control}
           errors={errors}
           name="email"
           label="E-mail *"
           placeholder="email@exemplo.com" type="email"
           inputStyle={inputStyle}
           onFocus={focusBlue}
           onBlur={blurGray}
           />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <RHFTextField
             control={control}
             errors={errors}
             name="cpfCnpj"
             label="CPF / CNPJ *"
             placeholder="000.000.000-00 ou 00.000.000/0000-00"
             mask={formatCpfCnpj}
             inputStyle={inputStyle}
             onFocus={focusBlue}
             onBlur={blurGray}
             />
            <RHFTextField
              control={control}
              errors={errors}
              name="telefone"
              label="Telefone *"
              placeholder="(00) 00000-0000"
              mask={formatPhone}
              inputStyle={inputStyle}
              onFocus={focusBlue}
              onBlur={blurGray}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <RHFTextField
             control={control}
             errors={errors}
             name="dataNascimento"
             label="Data de Nascimento *"
             type="date"
             inputStyle={inputStyle}
             onFocus={focusBlue}
             onBlur={blurGray}
             />
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
                setValue("hasPlanoSaude", checked,
                  { shouldValidate: true, shouldDirty: true });

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#8b96a8" }}>
                {hasPlanoSaude ? "Campos de convênio ativos" : "Campos de convênio desativados"}
              </span>
            </div> */}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/paciente")}
              style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || saving || !psicologos.length}
              style={{ padding: "10px 22px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !isValid || isSubmitting || saving || !psicologos.length ? "not-allowed" : "pointer", opacity: !isValid || isSubmitting || saving || !psicologos.length ? 0.5 : 1 }}
              onMouseEnter={e => { if (isValid && !isSubmitting && !saving && psicologos.length) e.currentTarget.style.filter = "brightness(1.12)"; }}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

          {/* <p style={{ margin: 0, fontSize: "11px", color: "#8b96a8" }}>
            CPF: {formatCpfCnpj(paciente.cpfCnpj)} | Telefone: {formatPhone(paciente.telefone || "")} | Nascimento: {buildBirthDateLabel(paciente.dataNascimento)}
          </p> */}
        </form>
      </div>
    </AppLayout>
  );
}

export default EditarPacientePage;