import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllRecepcionistas } from "../../shared/services/recepcionista.service";
import { editarRecepcionista, excluirRecepcionista } from "../../shared/services/auth.service";
import { RecepcionistaDTO } from "../../shared/types/dtos/Recepcionista.dto";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { formatCpf, formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { recepcionistaValidation, RecepcionistaFormData } from "../../shared/validations/recepcionista/recepcionista.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import ModalSendEmail from "../../shared/components/ModalSendEmail/ModalSendEmail";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

const statusCargoRecepcionista = StatusCargoEnum.stsRecepcionista;
const statusRoleColaborador = StatusRoleEnum.stsColaborador;

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#1a1a1a" }}>{valor || "—"}</span>
    </div>
  );
}

export default function VisualizarRecepcionistaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recepcionistaId = id ?? "";

  const [recepcionista, setRecepcionista] = useState<RecepcionistaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"update" | "credentials" | "delete" | null>(null);
  const [saving, setSaving] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [pendingValues, setPendingValues] = useState<RecepcionistaFormData | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [credenciais, setCredenciais] = useState<{ nome: string; email: string; senha: string } | null>(null);

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

    async function carregar() {
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
        if (isActive) setStatus({ type: "error", message: "Não foi possível carregar o recepcionista." });
      } finally {
        if (isActive) setLoading(false);
      }
    }

    carregar();
    return () => { isActive = false; };
  }, [recepcionistaId, reset]);

  const onSubmit = handleSubmit(values => {
    if (!recepcionistaId) return;
    setPendingValues(values);
    setConfirmAction("update");
  });

  const handleConfirmUpdate = async () => {
    if (!recepcionistaId || !pendingValues) return;

    const values = pendingValues;
    setSaving(true);

    try {
      const atualizado = await editarRecepcionista(recepcionistaId, {
        id: recepcionistaId,
        nome: values.nome.trim(),
        email: recepcionista?.email ?? "",
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        statusCargo: values.statusCargo,
        statusRole: values.statusRole,
        regenerarCredenciais: false
      });

      setConfirmAction(null);
      setPendingValues(null);
      setRecepcionista(prev => (prev ? { ...prev, ...atualizado } : prev));
      setEditMode(false);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.UPDATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmAction(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setSaving(false);
    }
  };

  const gerarNovasCredenciais = async () => {
    if (!recepcionista?.id) return;

    setGerando(true);

    try {
      const atualizado = await editarRecepcionista(recepcionista.id, {
        id: recepcionista.id,
        nome: recepcionista.nome,
        email: recepcionista.email,
        cpfCnpj: recepcionista.cpfCnpj,
        statusCargo: recepcionista.statusCargo,
        statusRole: recepcionista.statusRole,
        regenerarCredenciais: true,
      });

      setConfirmAction(null);
      setRecepcionista(prev => (prev ? { ...prev, email: atualizado.email } : prev));

      if (atualizado.senha) {
        setCredenciais({ nome: atualizado.nome, email: atualizado.email, senha: atualizado.senha });
      }
    } catch (err) {
      setConfirmAction(null);
      setStatus({ type: "error", message: parseApiError(err).message });
    } finally {
      setGerando(false);
    }
  };

  const cancelarEdicao = () => {
    if (recepcionista) {
      reset({
        nome: recepcionista.nome ?? "",
        email: recepcionista.email ?? "",
        cpfCnpj: recepcionista.cpfCnpj ?? "",
        statusCargo: recepcionista.statusCargo ?? statusCargoRecepcionista,
        statusRole: recepcionista.statusRole ?? statusRoleColaborador,
      });
    }
    setEditMode(false);
  };

  const handleConfirmDelete = async () => {
    if (!recepcionistaId) return;

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

  if (loading) {
    return (
      <AppLayout breadcrumb="Recepcionistas >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando recepcionista...</div>
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

      {confirmAction === "credentials" && (
        <ModalConfirm
          actionType="update"
          message="Deseja gerar novas credenciais de acesso para este recepcionista? O e-mail e a senha atuais deixarão de funcionar."
          loading={gerando}
          onConfirm={gerarNovasCredenciais}
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
            const wasDeleted = status.type === "success" && status.message === MESSAGES.SUCCESS.DELETED;
            setStatus(null);
            if (wasDeleted) {
              navigate("/recepcionistas");
            }
          }}
        />
      )}

      {credenciais && (
        <ModalSendEmail
          nome={credenciais.nome}
          cargo="Recepcionista"
          loginEmail={credenciais.email}
          senha={credenciais.senha}
          onClose={() => setCredenciais(null)}
        />
      )}

      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/recepcionistas")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Recepcionista</h1>
          {recepcionista && !editMode && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setEditMode(true)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
                  <line x1="13" y1="7" x2="17" y2="11" stroke="white" strokeWidth="2" />
                </svg>
                Editar
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("delete")}
                disabled={excluindo}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#922c2c", color: "white", border: "1px solid #ffd0d0", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: excluindo ? "not-allowed" : "pointer", opacity: excluindo ? 0.6 : 1 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7L7 20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20L18 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="10" y1="11" x2="10" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="14" y1="11" x2="14" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          )}
        </div>

        {!recepcionista ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
            Recepcionista não encontrado.
          </div>
        ) : editMode ? (
          <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
            <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Maria da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
            <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF *" placeholder="000.000.000-00" mask={formatCpf} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={cancelarEdicao}
                disabled={saving || excluindo}
                style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: saving || excluindo ? "not-allowed" : "pointer", opacity: saving || excluindo ? 0.6 : 1 }}
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
          </form>
        ) : (
          <div style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Campo label="Nome" valor={recepcionista.nome} />
            <Campo label="CPF" valor={formatCpf(recepcionista.cpfCnpj)} />

            {/* Credenciais */}
            <div style={{ borderTop: "1px solid #eef0f6", paddingTop: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <button
                  type="button"
                  onClick={() => setConfirmAction("credentials")}
                  disabled={gerando}
                  style={{ padding: "10px 22px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: gerando ? "not-allowed" : "pointer", opacity: gerando ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!gerando) e.currentTarget.style.filter = "brightness(1.12)"; }}
                  onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                >
                  {gerando ? "Gerando..." : "Gerar novas credenciais"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
