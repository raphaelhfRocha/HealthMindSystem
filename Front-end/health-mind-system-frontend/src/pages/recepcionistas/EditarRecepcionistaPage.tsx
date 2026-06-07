import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { editarRecepcionista, excluirRecepcionista, getAllRecepcionistas } from "../../shared/services/recepcionista.service";
import { RecepcionistaDTO } from "../../shared/types/dtos/Recepcionista.dto";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { recepcionistaValidation, RecepcionistaFormData } from "../../shared/validations/recepcionista/recepcionista.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

const statusCargoRecepcionista = StatusCargoEnum.stsRecepcionista;
const statusRoleColaborador = StatusRoleEnum.stsColaborador;

export default function EditarRecepcionistaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recepcionistaId = id ?? "";
  const [loading, setLoading] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recepcionista, setRecepcionista] = useState<RecepcionistaDTO | null>(null);
  const [confirmAction, setConfirmAction] = useState<"update" | "delete" | null>(null);
  const [pendingValues, setPendingValues] = useState<RecepcionistaFormData | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RecepcionistaFormData>({
    resolver: zodResolver(recepcionistaValidation),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      statusCargo: statusCargoRecepcionista,
      statusRole: statusRoleColaborador,
    },
    mode: "onChange",
  });

  useEffect(() => {
    let isActive = true;

    async function carregarRecepcionista() {
      try {
        setLoading(true);

        const dados = await getAllRecepcionistas();
        if (!isActive) return;

        const encontrado = dados.find(item => item.id === recepcionistaId) ?? null;
        setRecepcionista(encontrado);

        if (encontrado) {
          reset({
            nome: encontrado.nome ?? "",
            email: encontrado.email ?? "",
            cpfCnpj: encontrado.cpfCnpj ?? "",
            statusCargo: encontrado.statusCargo ?? statusCargoRecepcionista,
            statusRole: encontrado.statusRole ?? statusRoleColaborador,
          });
        }
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar o recepcionista." });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarRecepcionista();

    return () => {
      isActive = false;
    };
  }, [recepcionistaId, reset]);

  if (loading) {
    return (
      <AppLayout breadcrumb="Recepcionistas >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
          Carregando recepcionista...
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
    if (!recepcionistaId) {
      return;
    }

    setPendingValues(values);
    setConfirmAction("update");
  });

  const handleConfirmUpdate = async () => {
    if (!recepcionistaId || !pendingValues) {
      return;
    }

    const values = pendingValues;
    setSaving(true);

    try {
      await editarRecepcionista(recepcionistaId, {
        id: recepcionistaId,
        nome: values.nome.trim(),
        email: values.email.trim(),
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        statusCargo: values.statusCargo,
        statusRole: values.statusRole,
      });

      setConfirmAction(null);
      setPendingValues(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!recepcionistaId) {
      return;
    }

    setExcluindo(true);

    try {
      await excluirRecepcionista(recepcionistaId);

      setConfirmAction(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <AppLayout breadcrumb="Recepcionistas >">
      {confirmAction === "update" && (
        <ModalConfirm
          actionType="update"
          message="Tem certeza que deseja salvar as alterações deste recepcionista?"
          loading={saving}
          onConfirm={handleConfirmUpdate}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === "delete" && (
        <ModalConfirm
          actionType="delete"
          message="Deseja realmente excluir este recepcionista? Esta ação não poderá ser desfeita."
          loading={excluindo}
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmAction(null)}
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
              navigate("/recepcionistas");
            }
          }}
        />
      )}

      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {!recepcionista ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
            Recepcionista não encontrado.
            <br />
            <button onClick={() => navigate("/recepcionistas")} style={{ marginTop: "12px", background: "none", border: "none", color: "#1A4FA3", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
              ← Voltar
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => navigate("/recepcionistas")}
                style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                ‹ Voltar
              </button>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>
                Editar Recepcionista
              </h1>
            </div>

            {/* Form card */}
            <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Recepcionista</h2>

              <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Maria da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF / CNPJ *" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <RHFTextField control={control} errors={errors} name="email" label="E-mail *" placeholder="email@exemplo.com" type="email" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setConfirmAction("delete")}
                  disabled={excluindo || isSubmitting || saving}
                  style={{ padding: "10px 22px", background: "#fff5f5", border: "1px solid #ffd0d0", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#e05050", cursor: excluindo || isSubmitting || saving ? "not-allowed" : "pointer", opacity: excluindo || isSubmitting || saving ? 0.6 : 1 }}
                >
                  {excluindo ? "Excluindo..." : "Excluir"}
                </button>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/recepcionistas")}
                    style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting || saving || excluindo || !recepcionistaId}
                    style={{ padding: "10px 22px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !isValid || isSubmitting || saving || excluindo || !recepcionistaId ? "not-allowed" : "pointer", opacity: !isValid || isSubmitting || saving || excluindo || !recepcionistaId ? 0.5 : 1 }}
                    onMouseEnter={e => { if (isValid && !isSubmitting && !saving && !excluindo && recepcionistaId) e.currentTarget.style.filter = "brightness(1.12)"; }}
                    onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </AppLayout>
  );
}
