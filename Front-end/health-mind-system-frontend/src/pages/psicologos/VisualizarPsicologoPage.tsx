import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { editarPsicologo } from "../../shared/services/auth.service";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { formatCpfCnpj, formatCrp, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { psicologoValidation, PsicologoFormData } from "../../shared/validations/psicologo/psicologo.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import ModalSendEmail from "../../shared/components/ModalSendEmail/ModalSendEmail";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

const statusCargoPsicologo = StatusCargoEnum.stsPsicologo;
const statusRoleAdmin = StatusRoleEnum.stsAdmin;

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#1a1a1a" }}>{valor || "—"}</span>
    </div>
  );
}

export default function VisualizarPsicologoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const psicologoId = id ?? "";

  const [psicologo, setPsicologo] = useState<PsicologoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"update" | "credentials" | null>(null);
  const [saving, setSaving] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [pendingValues, setPendingValues] = useState<PsicologoFormData | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [credenciais, setCredenciais] = useState<{ nome: string; email: string; senha: string } | null>(null);

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

    async function carregar() {
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
        if (isActive) setStatus({ type: "error", message: "Não foi possível carregar o psicólogo." });
      } finally {
        if (isActive) setLoading(false);
      }
    }

    carregar();
    return () => { isActive = false; };
  }, [psicologoId, reset]);

  const onSubmit = handleSubmit(values => {
    if (!psicologoId) return;
    setPendingValues(values);
    setConfirmAction("update");
  });

  const handleConfirmUpdate = async () => {
    if (!psicologoId || !pendingValues) return;

    const values = pendingValues;
    setSaving(true);

    try {
      const atualizado = await editarPsicologo(psicologoId, {
        id: psicologoId,
        nome: values.nome.trim(),
        email: psicologo?.email ?? "",
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        statusCargo: values.statusCargo,
        statusRole: values.statusRole,
        crp: values.crp.trim(),
        especialidade: values.especialidade.trim(),
        valorConsulta: values.valorConsulta,
        regenerarCredenciais: false
      });

      setConfirmAction(null);
      setPendingValues(null);
      setPsicologo(prev => (prev ? { ...prev, ...atualizado } : prev));
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
    if (!psicologo?.id) return;

    setGerando(true);

    try {
      const atualizado = await editarPsicologo(psicologo.id, {
        id: psicologo.id,
        nome: psicologo.nome,
        email: psicologo.email,
        cpfCnpj: psicologo.cpfCnpj,
        crp: psicologo.crp,
        especialidade: psicologo.especialidade,
        valorConsulta: psicologo.valorConsulta,
        statusCargo: psicologo.statusCargo,
        statusRole: psicologo.statusRole,
        regenerarCredenciais: true,
      });

      setConfirmAction(null);
      setPsicologo(prev => (prev ? { ...prev, email: atualizado.email } : prev));

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
    if (psicologo) {
      reset({
        nome: psicologo.nome ?? "",
        email: psicologo.email ?? "",
        cpfCnpj: psicologo.cpfCnpj ?? "",
        crp: psicologo.crp ?? "",
        especialidade: psicologo.especialidade ?? "",
        valorConsulta: psicologo.valorConsulta ?? 0,
        statusCargo: psicologo.statusCargo ?? statusCargoPsicologo,
        statusRole: psicologo.statusRole ?? statusRoleAdmin,
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <AppLayout breadcrumb="Psicólogos >">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>Carregando psicólogo...</div>
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
    <AppLayout breadcrumb="Psicólogos >">
      {confirmAction === "update" && (
        <ModalConfirm
          actionType="update"
          message="Tem certeza que deseja salvar as alterações deste psicólogo?"
          loading={saving}
          onConfirm={handleConfirmUpdate}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === "credentials" && (
        <ModalConfirm
          actionType="update"
          message="Deseja gerar novas credenciais de acesso para este psicólogo? O e-mail e a senha atuais deixarão de funcionar."
          loading={gerando}
          onConfirm={gerarNovasCredenciais}
          onClose={() => setConfirmAction(null)}
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

      {credenciais && (
        <ModalSendEmail
          nome={credenciais.nome}
          cargo="Psicólogo"
          loginEmail={credenciais.email}
          senha={credenciais.senha}
          onClose={() => setCredenciais(null)}
        />
      )}

      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/psicologos")}
            style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            ‹ Voltar
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Dados do Psicólogo</h1>
          {psicologo && !editMode && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <line x1="13" y1="7" x2="17" y2="11" stroke="white" strokeWidth="2" />
              </svg>
              Editar
            </button>
          )}
        </div>

        {!psicologo ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "15px" }}>
            Psicólogo não encontrado.
          </div>
        ) : editMode ? (
          <form onSubmit={onSubmit} style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
            <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Dr. João da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
            <RHFTextField control={control} errors={errors} name="especialidade" label="Especialidade *" placeholder="Ex: Terapia Cognitivo-Comportamental" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF / CNPJ *" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
              <RHFTextField control={control} errors={errors} name="crp" label="CRP *" placeholder="Ex: 06/12345" mask={formatCrp} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
            </div>
            <RHFTextField control={control} errors={errors} name="valorConsulta" label="Valor da Consulta (R$) *" placeholder="Ex: 150" type="number" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={cancelarEdicao}
                disabled={saving}
                style={{ padding: "10px 22px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
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
        ) : (
          <div style={{ background: "white", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Campo label="Nome" valor={psicologo.nome} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Campo label="CPF / CNPJ" valor={formatCpfCnpj(psicologo.cpfCnpj)} />
              <Campo label="CRP" valor={formatCrp(psicologo.crp)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Campo label="Especialidade" valor={psicologo.especialidade} />
              <Campo label="Valor da Consulta" valor={formatCurrency(psicologo.valorConsulta)} />
            </div>

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
