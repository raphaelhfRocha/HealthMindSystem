import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { editarPsicologo, getAllPsicologos } from "../../shared/services/psicologo.service";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { formatCpfCnpj, formatCrp, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { psicologoValidation, PsicologoFormData } from "../../shared/validations/psicologo/psicologo.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

const statusCargoPsicologo = StatusCargoEnum.stsPsicologo;
const statusRoleAdmin = StatusRoleEnum.stsAdmin;

export default function EditarPsicologoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const psicologoId = id ?? "";
  const [loading, setLoading] = useState(true);
  const [psicologo, setPsicologo] = useState<PsicologoDTO | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingValues, setPendingValues] = useState<PsicologoFormData | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PsicologoFormData>({
    resolver: zodResolver(psicologoValidation),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      crp: "",
      especialidade: "",
      valorConsulta: 0,
      statusCargo: statusCargoPsicologo,
      statusRole: statusRoleAdmin,
    },
    mode: "onChange",
  });

  useEffect(() => {
    let isActive = true;

    async function carregarPsicologo() {
      try {
        setLoading(true);

        const dados = await getAllPsicologos();
        if (!isActive) return;

        const encontrado = dados.find(item => item.id === psicologoId) ?? null;
        setPsicologo(encontrado);

        if (encontrado) {
          reset({
            nome: encontrado.nome ?? "",
            email: encontrado.email ?? "",
            cpfCnpj: encontrado.cpfCnpj ?? "",
            crp: encontrado.crp ?? "",
            especialidade: encontrado.especialidade ?? "",
            valorConsulta: encontrado.valorConsulta ?? 0,
            statusCargo: encontrado.statusCargo ?? statusCargoPsicologo,
            statusRole: encontrado.statusRole ?? statusRoleAdmin,
          });
        }
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar o psicólogo." });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarPsicologo();

    return () => {
      isActive = false;
    };
  }, [psicologoId, reset]);

  if (loading) {
    return (
      <AppLayout breadcrumb="Psicólogos >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Carregando psicólogo...
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
  const blurGray = e => e.target.style.borderColor = "#dde3f0";

  const onSubmit = handleSubmit(values => {
    if (!psicologoId) {
      return;
    }

    setPendingValues(values);
    setConfirmOpen(true);
  });

  const handleConfirmUpdate = async () => {
    if (!psicologoId || !pendingValues) {
      return;
    }

    const values = pendingValues;
    setSaving(true);

    try {
      await editarPsicologo(psicologoId, {
        id: psicologoId,
        nome: values.nome.trim(),
        email: values.email.trim(),
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        crp: values.crp.trim(),
        especialidade: values.especialidade.trim(),
        valorConsulta: values.valorConsulta,
        statusCargo: values.statusCargo,
        statusRole: values.statusRole,
      });

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

  return (
    <AppLayout breadcrumb="Psicólogos >">
      {confirmOpen && (
        <ModalConfirm
          actionType="update"
          message="Tem certeza que deseja salvar as alterações deste psicólogo?"
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
              navigate("/psicologos");
            }
          }}
        />
      )}

      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {!psicologo ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
            Psicólogo não encontrado.
            <br />
            <button onClick={() => navigate("/psicologos")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
              ← Voltar
            </button>
          </div>
        ) : (
          <>
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
            <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Psicólogo</h2>

              <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Dr. João da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <RHFTextField control={control} errors={errors} name="especialidade" label="Especialidade *" placeholder="Ex: Terapia Cognitivo-Comportamental" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF / CNPJ *" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                <RHFTextField control={control} errors={errors} name="crp" label="CRP *" placeholder="Ex: 06/12345" mask={formatCrp} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              </div>
              <RHFTextField control={control} errors={errors} name="email" label="E-mail *" placeholder="email@exemplo.com" type="email" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <RHFTextField control={control} errors={errors} name="valorConsulta" label="Valor da Consulta (R$) *" placeholder="Ex: 150" type="number" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/psicologos")}
                  style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || saving || !psicologoId}
                  style={{ padding: "10px 22px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !isValid || isSubmitting || saving || !psicologoId ? "not-allowed" : "pointer", opacity: !isValid || isSubmitting || saving || !psicologoId ? 0.5 : 1 }}
                  onMouseEnter={e => { if (isValid && !isSubmitting && !saving && psicologoId) e.currentTarget.style.filter = "brightness(1.12)"; }}
                  onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </AppLayout>
  );
}
