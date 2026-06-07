import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { cadastrarRecepcionista, excluirRecepcionista, getAllRecepcionistas } from "../../shared/services/recepcionista.service";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { RecepcionistaDTO } from "../../shared/types/dtos/Recepcionista.dto";
import { formatCpfCnpj, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { recepcionistaValidation, RecepcionistaFormData } from "../../shared/validations/recepcionista/recepcionista.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import { Pagination, usePagination } from "../../shared/components/Pagination";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

const statusCargoEnum = StatusCargoEnum.stsRecepcionista;
const statusRoleEnum = StatusRoleEnum.stsColaborador;

function getInitials(nome) {
  const safeName = nome?.trim() || "";
  const parts = safeName.split(" ").filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?";
}

function ordenarRecepcionistas(lista: RecepcionistaDTO[]) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}


// ─── Modal: Novo Recepcionista ────────────────────────────────────────────────
function ModalNovoRecepcionista({ onSave, onClose }) {
  const inputStyle = {
    height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
    padding: "0 12px", fontSize: "13px", outline: "none",
    boxSizing: "border-box", width: "100%", fontFamily: "inherit",
  };
  const focusBlue = e => e.target.style.borderColor = "#1A4FA3";
  const blurGray = e => e.target.style.borderColor = "#dde3f0";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RecepcionistaFormData>({
    resolver: zodResolver(recepcionistaValidation),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      statusCargo: statusCargoEnum,
      statusRole: statusRoleEnum,
    },
    mode: "onChange",
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form onSubmit={handleSubmit(onSave)} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "480px", maxWidth: "90vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Recepcionista</h2>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        {/* Fields */}
        <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Maria da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF *" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <RHFTextField control={control} errors={errors} name="email" label="E-mail *" placeholder="email@exemplo.com" type="email" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: !isValid || isSubmitting ? "not-allowed" : "pointer", opacity: !isValid || isSubmitting ? 0.5 : 1 }}
            onMouseEnter={e => { if (isValid && !isSubmitting) e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            {isSubmitting ? "Salvando..." : "Salvar Recepcionista"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecepcionistasPage() {
  const navigate = useNavigate();
  const [recepcionistas, setRecepcionistas] = useState<RecepcionistaDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<RecepcionistaDTO | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarRecepcionistas() {
      try {
        setLoading(true);

        const dados = await getAllRecepcionistas();
        if (!isActive) return;

        setRecepcionistas(ordenarRecepcionistas(dados));
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar os recepcionistas." });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarRecepcionistas();

    return () => {
      isActive = false;
    };
  }, []);

  const filtrados = recepcionistas.filter(r =>
    r.nome.toLowerCase().includes(busca.toLowerCase()) ||
    r.email.toLowerCase().includes(busca.toLowerCase())
  );

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  const openModal = () => { setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleAdd = async (values: RecepcionistaFormData) => {
    try {
      const criado = await cadastrarRecepcionista({
        ...values,
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
      });

      setRecepcionistas(prev => ordenarRecepcionistas([...prev, criado]));
      setShowModal(false);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.CREATED });
    } catch (err) {
      const parsed = parseApiError(err);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    }
  };

  const confirmDelete = async () => {
    const recepcionistaId = confirmTarget?.id;
    if (!recepcionistaId) return;

    try {
      setExcluindoId(recepcionistaId);

      await excluirRecepcionista(recepcionistaId);

      setRecepcionistas(prev => prev.filter(r => r.id !== recepcionistaId));
      setConfirmTarget(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmTarget(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoId(null);
    }
  };

  const COL = "260px 200px 270px 210px";

  return (
    <AppLayout breadcrumb="Recepcionistas >">
      {showModal && (
        <ModalNovoRecepcionista onSave={handleAdd} onClose={closeModal} />
      )}

      {confirmTarget && (
        <ModalConfirm
          actionType="delete"
          message={`Deseja realmente excluir o recepcionista "${confirmTarget.nome}"? Esta ação não poderá ser desfeita.`}
          loading={excluindoId === confirmTarget.id}
          onConfirm={confirmDelete}
          onClose={() => setConfirmTarget(null)}
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

      <div style={{ width: "100%", maxWidth: "980px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Recepcionistas</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 32px", fontSize: "13px", outline: "none", width: "240px", color: "#333", background: "white" }}
              />
            </div>

            {/* Add */}
            <button
              onClick={openModal}
              style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
              Adicionar Recepcionista
            </button>
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Recepcionista", "CPF", "E-mail", "Ações"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Carregando recepcionistas...
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum recepcionista encontrado.
            </div>
          ) : (
            pageItems.map((r, i) => {
              const recepcionistaId = r.id ?? "";
              const rowBg = i % 2 === 0 ? "white" : "#f9fafc";
              return (
                <div
                  key={recepcionistaId || `${r.nome}-${i}`}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  {/* Avatar + nome */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: AVATAR_COLORS[(Number(recepcionistaId) || i) % AVATAR_COLORS.length], color: "white", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {getInitials(r.nome)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{r.nome}</span>
                  </div>

                  {/* CPF / CNPJ */}
                  <div style={{ fontSize: "13px", color: "#555" }}>{r.cpfCnpj ? formatCpfCnpj(r.cpfCnpj) : "—"}</div>

                  {/* E-mail */}
                  <div style={{ fontSize: "13px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.email || "—"}</div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/recepcionistas/${recepcionistaId}/editar`)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#d0e4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#1A4FA3" strokeWidth="2" strokeLinejoin="round" fill="none" />
                        <line x1="13" y1="7" x2="17" y2="11" stroke="#1A4FA3" strokeWidth="2" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmTarget(r)}
                      disabled={excluindoId === recepcionistaId}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindoId === recepcionistaId ? "not-allowed" : "pointer", opacity: excluindoId === recepcionistaId ? 0.6 : 1, whiteSpace: "nowrap" }}
                      onMouseEnter={e => { if (excluindoId !== recepcionistaId) e.currentTarget.style.background = "#ffdede"; }}
                      onMouseLeave={e => e.currentTarget.style.background = "#FFF0F0"}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M5 7H19M10 11V16M14 11V16M6 7L7 19C7 20 7.5 20.5 8.5 20.5H15.5C16.5 20.5 17 20 17 19L18 7M9 7V4.5C9 4 9.5 3.5 10 3.5H14C14.5 3.5 15 4 15 4.5V7" stroke="#B03A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                      {excluindoId === recepcionistaId ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer count + pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "recepcionista encontrado" : "recepcionistas encontrados"}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AppLayout>
  );
}
