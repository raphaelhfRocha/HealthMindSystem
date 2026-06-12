import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPsicologos } from "../../shared/services/psicologo.service";
import { cadastrarPsicologo } from "../../shared/services/auth.service";
import { StatusCargoEnum } from "../../shared/domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../shared/domain/enums/status-role.enum";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { formatCpfCnpj, formatCrp, normalizeCpfCnpj } from "../../shared/utils/formMasks";
import { psicologoValidation, PsicologoFormData } from "../../shared/validations/psicologo/psicologo.validation";
import { RHFTextField } from "../../shared/components/RHFTextField";
import { Pagination, usePagination } from "../../shared/components/Pagination";
import { usePermissions } from "../../shared/hooks/usePermissions";
import ModalSendEmail from "../../shared/components/ModalSendEmail/ModalSendEmail";

const AVATAR_COLORS = [
  "#1A4FA3", "#3BB077", "#E06B4A", "#7B5EA7",
  "#D4884A", "#3A9BA8", "#B04A6B", "#4A7BB0",
];

const statusCargoEnum = StatusCargoEnum.stsPsicologo;
const statusRoleEnum = StatusRoleEnum.stsAdmin;

function getInitials(nome) {
  const safeName = nome?.replace(/^Dr[a]?\.\s*/i, "").trim() || "";
  const parts = safeName.split(" ").filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?";
}

function ordenarPsicologos(lista: PsicologoDTO[]) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}


// ─── Modal: Novo Psicólogo ────────────────────────────────────────────────────
function ModalNovoPsicologo({ onSave, onClose }) {
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
  } = useForm<PsicologoFormData>({
    resolver: zodResolver(psicologoValidation),
    defaultValues: {
      nome: "",
      cpfCnpj: "",
      crp: "",
      especialidade: "",
      valorConsulta: 0,
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
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Psicólogo</h2>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        {/* Fields */}
        <RHFTextField control={control} errors={errors} name="nome" label="Nome Completo *" placeholder="Ex: Dr. João da Silva" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <RHFTextField control={control} errors={errors} name="especialidade" label="Especialidade" placeholder="Ex: Terapia Cognitivo-Comportamental" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <RHFTextField control={control} errors={errors} name="cpfCnpj" label="CPF / CNPJ" placeholder="000.000.000-00 ou 00.000.000/0000-00" mask={formatCpfCnpj} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
          <RHFTextField control={control} errors={errors} name="crp" label="CRP" placeholder="Ex: 06/12345" mask={formatCrp} inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        </div>
        <RHFTextField control={control} errors={errors} name="valorConsulta" label="Valor da Consulta (R$)" placeholder="Ex: 150" type="number" inputStyle={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
        <p style={{ fontSize: "12px", color: "#888", margin: 0, lineHeight: 1.5 }}>
          O e-mail de acesso e a senha serão gerados automaticamente e exibidos após o cadastro.
        </p>

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
            {isSubmitting ? "Salvando..." : "Salvar Psicólogo"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PsicologosPage() {
  const navigate = useNavigate();
  const { isRecepcionista } = usePermissions();
  // Recepcionista acessa a tela de psicólogos apenas para consulta.
  const podeGerenciar = !isRecepcionista;
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credenciais, setCredenciais] = useState<{ nome: string; email: string; senha: string } | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarPsicologos() {
      try {
        setLoading(true);
        setError(null);

        const dados = await getAllPsicologos();
        if (!isActive) return;

        setPsicologos(ordenarPsicologos(dados));
      } catch {
        if (isActive) {
          setError("Não foi possível carregar os psicólogos.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarPsicologos();

    return () => {
      isActive = false;
    };
  }, []);

  const filtrados = psicologos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  const openModal = () => { setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleAdd = async (values: PsicologoFormData) => {
    try {
      setError(null);

      const criado = await cadastrarPsicologo({
        ...values,
        cpfCnpj: normalizeCpfCnpj(values.cpfCnpj),
        crp: values.crp.trim(),
      });

      setPsicologos(prev => ordenarPsicologos([...prev, criado]));
      setShowModal(false);

      if (criado.senha) {
        setCredenciais({ nome: criado.nome, email: criado.email, senha: criado.senha });
      }
    } catch {
      setError("Não foi possível cadastrar o psicólogo.");
    }
  };

  // Recepcionista não tem coluna de ação (visualização apenas), então a tabela
  // usa 3 colunas para não deixar um espaço vazio à direita. A coluna de nome
  // é mais estreita para aproximar o CRP da esquerda.
  const COL = isRecepcionista
    ? "minmax(0, 1.5fr) 120px minmax(0, 2.5fr)"
    : "minmax(0, 2.2fr) 120px minmax(0, 2fr) 130px";

  return (
    <AppLayout breadcrumb="Psicólogos >">
      {showModal && (
        <ModalNovoPsicologo onSave={handleAdd} onClose={closeModal} />
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

      <div style={{ width: "100%", maxWidth: "980px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Psicólogos</h1>
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
                placeholder="Buscar por nome ou especialidade..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 32px", fontSize: "13px", outline: "none", width: "240px", color: "#333", background: "white" }}
              />
            </div>

            {/* Add */}
            {podeGerenciar && (
              <button
                onClick={openModal}
                style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
                Adicionar Psicólogo
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        {/* Table card */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {(isRecepcionista
              ? ["Psicólogo", "CRP", "Especialidade"]
              : ["Psicólogo", "CRP", "Especialidade", "Ação"]
            ).map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em", marginLeft: isRecepcionista && h === "Especialidade" ? "100px" : undefined }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Carregando psicólogos...
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>
              Nenhum psicólogo encontrado.
            </div>
          ) : (
            pageItems.map((p, i) => {
              const psicologoId = p.id ?? "";
              const rowBg = i % 2 === 0 ? "white" : "#f9fafc";
              return (
                <div
                  key={psicologoId || `${p.nome}-${i}`}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  {/* Avatar + nome */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: AVATAR_COLORS[(Number(psicologoId) || i) % AVATAR_COLORS.length], color: "white", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {getInitials(p.nome)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{p.nome}</span>
                  </div>

                  {/* CRP */}
                  <div>
                    {p.crp
                      ? <span style={{ fontSize: "12px", fontWeight: "600", background: "#EBF3FF", color: "#1A4FA3", borderRadius: "10px", padding: "2px 10px" }}>{p.crp}</span>
                      : <span style={{ fontSize: "13px", color: "#ccc" }}>—</span>
                    }
                  </div>

                  {/* Especialidade */}
                  <div style={{ fontSize: "13px", color: "#555", marginLeft: isRecepcionista ? "100px" : undefined }}>{p.especialidade || "—"}</div>

                  {/* E-mail */}
                  {/* <div style={{ fontSize: "13px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email || "—"}</div> */}

                  {/* Actions (oculto para recepcionista, que tem acesso somente de leitura) */}
                  {podeGerenciar && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => navigate(`/psicologos/${psicologoId}`)}
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer", whiteSpace: "nowrap", marginLeft: "-20px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e0e5f0"}
                        onMouseLeave={e => e.currentTarget.style.background = "#EEF1F8"}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M2 12 C4 7 8 4 12 4 C16 4 20 7 22 12 C20 17 16 20 12 20 C8 20 4 17 2 12Z" stroke="#1A4FA3" strokeWidth="2" fill="none" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="#1A4FA3" strokeWidth="2" fill="none" />
                        </svg>
                        Visualizar
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer count + pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "psicólogo encontrado" : "psicólogos encontrados"}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AppLayout>
  );
}
