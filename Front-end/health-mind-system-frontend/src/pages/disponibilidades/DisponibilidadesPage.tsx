import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { adicionarDisponibilidade, editarPsicologo, excluirDisponibilidade, getAllPsicologos, getDisponibilidadesByPsicologoId } from "../../shared/services/psicologo.service";
import { StatusDisponibilidadeEnum } from "../../shared/domain/enums/status-disponibilidade.enum";
import { StatusTipoAtendimentoEnum } from "../../shared/domain/enums/status-tipo-atendimento.enum";
import { PsicologoDTO } from "../../shared/types/dtos/Psicologo.dto";
import { DisponibilidadeDTO } from "../../shared/types/dtos/Disponibilidade.dto";
import { extractDateKey, formatDateLabel, formatTimeLabel, getDataHoraDisponibilidade, getDiaSemana } from "../../shared/utils/sessao";
import { Pagination, usePagination } from "../../shared/components/Pagination";
import { formatDate } from "../../shared/utils/dateUtils";
import ModalConfirm from "../../shared/components/ModalConfirm/ModalConfirm";
import ModalMessagesStatus, { ApiErrorDetail, parseApiError } from "../../shared/components/ModalMessagesStatus/ModalMessagesStatus";
import { MESSAGES } from "../../shared/constants/messages";
import { useAuth } from "../../shared/context/AuthContext";
import { usePermissions } from "../../shared/hooks/usePermissions";
import { findPsicologoByEmail } from "../../shared/hooks/useCurrentPsicologo";

type StatusMessage = { type: "success" | "error"; message: string; details?: ApiErrorDetail[] };

function tipoAtendimentoLabel(tipo: StatusTipoAtendimentoEnum): string {
  const labels: Record<number, string> = {
    [StatusTipoAtendimentoEnum.stsNone]: "Não informado",
    [StatusTipoAtendimentoEnum.stsPresencial]: "Presencial",
    [StatusTipoAtendimentoEnum.stsOnline]: "Online",
  };

  return labels[tipo] ?? "Presencial";
}

function statusDisponibilidadeLabel(status: StatusDisponibilidadeEnum): string {
  const labels: Record<number, string> = {
    [StatusDisponibilidadeEnum.stsNone]: "Indefinido",
    [StatusDisponibilidadeEnum.stsDisponivel]: "Disponível",
    [StatusDisponibilidadeEnum.stsReservado]: "Reservado",
  };

  return labels[status] ?? "Disponível";
}

function ordenarDisponibilidades(lista: DisponibilidadeDTO[]): DisponibilidadeDTO[] {
  return [...lista].sort((a, b) => getDataHoraDisponibilidade(a).getTime() - getDataHoraDisponibilidade(b).getTime());
}

const inputStyle = {
  height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "13px", outline: "none",
  boxSizing: "border-box" as const, width: "100%", fontFamily: "inherit", color: "#333", background: "white",
};

const labelStyle = {
  display: "flex", flexDirection: "column" as const, gap: "5px",
  fontSize: "12px", fontWeight: "600" as const, color: "#222",
};

interface ModalNovaDisponibilidadeProps {
  psicologoNome: string;
  saving: boolean;
  error: string | null;
  onSave: (dados: { dataDisponibilidade: string; horaInicio: string; statusTipoAtendimento: StatusTipoAtendimentoEnum }) => void;
  onClose: () => void;
}

function ModalNovaDisponibilidade({ psicologoNome, saving, error, onSave, onClose }: ModalNovaDisponibilidadeProps) {
  const [dataDisponibilidade, setDataDisponibilidade] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [statusTipoAtendimento, setStatusTipoAtendimento] = useState<StatusTipoAtendimentoEnum>(StatusTipoAtendimentoEnum.stsPresencial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ dataDisponibilidade, horaInicio, statusTipoAtendimento });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "440px", maxWidth: "90vw", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Nova Disponibilidade</h2>
          <button type="button" onClick={onClose} disabled={saving} style={{ background: "none", border: "none", cursor: saving ? "not-allowed" : "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        <div style={{ fontSize: "13px", color: "#555", background: "#f9fafc", borderRadius: "10px", padding: "10px 14px" }}>
          <strong style={{ color: "#222" }}>Psicólogo:</strong> {psicologoNome}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={labelStyle}>
            Data *
            <input type="date" value={dataDisponibilidade} onChange={e => setDataDisponibilidade(e.target.value)} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Horário *
            <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} style={inputStyle} required />
          </label>
        </div>

        <label style={labelStyle}>
          Tipo de Atendimento
          <select value={statusTipoAtendimento} onChange={e => setStatusTipoAtendimento(Number(e.target.value))} style={inputStyle}>
            <option value={StatusTipoAtendimentoEnum.stsPresencial}>Presencial</option>
            <option value={StatusTipoAtendimentoEnum.stsOnline}>Online</option>
          </select>
        </label>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #ffd0d0", background: "#fff5f5", color: "#b03a2e", fontSize: "12px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button type="button" onClick={onClose} disabled={saving} style={{ padding: "9px 20px", background: "#e8e8e8", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#555", cursor: saving ? "not-allowed" : "pointer" }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: "#1A4FA3", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "white", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Salvando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function DisponibilidadesPage() {
  const { user } = useAuth();
  const { isPsicologo, isRecepcionista } = usePermissions();
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [psicologoId, setPsicologoId] = useState("");
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeDTO[]>([]);
  const [loadingPsicologos, setLoadingPsicologos] = useState(true);
  const [loadingDisponibilidades, setLoadingDisponibilidades] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<DisponibilidadeDTO | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarPsicologos() {
      try {
        setLoadingPsicologos(true);
        const dados = await getAllPsicologos();
        if (!isActive) return;

        setPsicologos([...dados].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
      } catch {
        if (isActive) {
          setStatus({ type: "error", message: "Não foi possível carregar os psicólogos." });
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

  const psicologoSelecionado = useMemo(
    () => psicologos.find(item => item.id === psicologoId) ?? null,
    [psicologos, psicologoId]
  );

  // Psicólogo fica travado nas próprias disponibilidades (seleção automática).
  // O id do JWT (claim NameIdentifier) é o id do usuário de autenticação, que o
  // registro do psicólogo guarda em `usuarioId`. Resolvemos por esse vínculo —
  // confiável — e usamos id direto e e-mail apenas como fallback.
  useEffect(() => {
    if (isPsicologo && psicologos.length > 0 && !psicologoId) {
      const proprio =
        psicologos.find(item => item.usuarioId === user?.id) ??
        psicologos.find(item => item.id === user?.id) ??
        findPsicologoByEmail(psicologos, user?.email);
      if (proprio?.id) {
        setPsicologoId(proprio.id);
      }
    }
  }, [isPsicologo, psicologos, user?.id, user?.email, psicologoId]);

  // Recepcionista acessa esta tela apenas para consulta.
  const podeGerenciar = isPsicologo;

  async function carregarDisponibilidades(id: string) {
    try {
      setLoadingDisponibilidades(true);
      const dados = await getDisponibilidadesByPsicologoId(id);
      setDisponibilidades(ordenarDisponibilidades(dados));
    } catch {
      setStatus({ type: "error", message: "Não foi possível carregar as disponibilidades." });
      setDisponibilidades([]);
    } finally {
      setLoadingDisponibilidades(false);
    }
  }

  useEffect(() => {
    if (!psicologoId) {
      setDisponibilidades([]);
      return;
    }

    carregarDisponibilidades(psicologoId);
  }, [psicologoId]);

  async function handleSalvar(dados: { dataDisponibilidade: string; horaInicio: string; statusTipoAtendimento: StatusTipoAtendimentoEnum }) {
    if (!psicologoSelecionado) {
      return;
    }

    const novaDisponibilidade: DisponibilidadeDTO = {
      psicologoId: psicologoSelecionado.id as string,
      dataDisponibilidade: `${dados.dataDisponibilidade}T00:00:00` as unknown as Date,
      horaInicio: `${dados.horaInicio}:00`,
      statusTipoAtendimento: dados.statusTipoAtendimento,
      statusDisponibilidade: StatusDisponibilidadeEnum.stsDisponivel,
    };

    try {
      setSalvando(true);
      setErroModal(null);
      await adicionarDisponibilidade(psicologoSelecionado.id as string, novaDisponibilidade);
      await carregarDisponibilidades(psicologoSelecionado.id as string);
      setModalAberto(false);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.CREATED });
    } catch (err) {
      setErroModal(parseApiError(err).message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmExcluir() {
    const disponibilidadeId = confirmTarget?.id;
    if (!disponibilidadeId || !psicologoSelecionado) {
      return;
    }

    try {
      setExcluindoId(disponibilidadeId);
      await excluirDisponibilidade(psicologoSelecionado.id as string, disponibilidadeId);
      setDisponibilidades(prev => prev.filter(item => item.id !== disponibilidadeId));
      setConfirmTarget(null);
      setStatus({ type: "success", message: MESSAGES.SUCCESS.DELETED });
    } catch (err) {
      const parsed = parseApiError(err);
      setConfirmTarget(null);
      setStatus({ type: "error", message: parsed.message, details: parsed.details });
    } finally {
      setExcluindoId(null);
    }
  }

  const { pageItems, page, setPage, totalPages } = usePagination(disponibilidades, 5, psicologoId);

  const COL = "150px 120px 100px 140px 120px 110px";

  return (
    <AppLayout breadcrumb="Disponibilidades >">
      {modalAberto && psicologoSelecionado && (
        <ModalNovaDisponibilidade
          psicologoNome={psicologoSelecionado.nome}
          saving={salvando}
          error={erroModal}
          onSave={handleSalvar}
          onClose={() => { if (!salvando) setModalAberto(false); }}
        />
      )}

      {confirmTarget && (
        <ModalConfirm
          actionType="delete"
          message={`Deseja realmente excluir a disponibilidade de ${formatDateLabel(extractDateKey(confirmTarget.dataDisponibilidade))} às ${formatTimeLabel(confirmTarget.horaInicio)}? Esta ação não poderá ser desfeita.`}
          loading={excluindoId === confirmTarget.id}
          onConfirm={confirmExcluir}
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

      <div style={{ width: "100%", maxWidth: "860px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          {isPsicologo && (
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Disponibilidades</h1>
          )}
          {!isPsicologo && (
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Disponibilidades dos Psicólogos</h1>
          )}
          {podeGerenciar && (
            <button
              onClick={() => { setErroModal(null); setModalAberto(true); }}
              disabled={!psicologoSelecionado}
              style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: psicologoSelecionado ? "pointer" : "not-allowed", opacity: psicologoSelecionado ? 1 : 0.5, display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => { if (psicologoSelecionado) e.currentTarget.style.filter = "brightness(1.12)"; }}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
              Adicionar Disponibilidade
            </button>
          )}
        </div>

        {/* Seletor de psicólogo — psicólogo logado fica restrito às próprias disponibilidades */}
        {!isPsicologo && (
          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "18px 20px" }}>
            <label style={{ ...labelStyle, maxWidth: "420px" }}>
              Psicólogo
              <select
                value={psicologoId}
                onChange={e => setPsicologoId(e.target.value)}
                style={inputStyle}
                disabled={loadingPsicologos}
              >
                <option value="">{loadingPsicologos ? "Carregando..." : "Selecione um psicólogo..."}</option>
                {psicologos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </label>
          </div>
        )}

        {/* Lista de disponibilidades */}
        {!psicologoSelecionado ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#999", fontSize: "15px" }}>
            Selecione um psicólogo para visualizar suas disponibilidades.
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
              {["Dia", "Data", "Horário", "Atendimento", "Status", isPsicologo ? "Ação" : ""].map(h => (
                <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
              ))}
            </div>

            {loadingDisponibilidades ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Carregando disponibilidades...</div>
            ) : disponibilidades.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Nenhuma disponibilidade cadastrada para este psicólogo.</div>
            ) : (
              pageItems.map((d, i) => {
                const rowBg = i % 2 === 0 ? "white" : "#f9fafc";
                const disponivel = d.statusDisponibilidade === StatusDisponibilidadeEnum.stsDisponivel;
                return (
                  <div
                    key={d.id ?? i}
                    style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                    onMouseLeave={e => e.currentTarget.style.background = rowBg}
                  >
                    <div style={{ fontSize: "13px", color: "#222", fontWeight: "600" }}>{getDiaSemana(d.dataDisponibilidade)}</div>
                    <div style={{ fontSize: "13px", color: "#222", fontWeight: "600" }}>{formatDate(d.dataDisponibilidade)}</div>
                    {/* <div style={{ fontSize: "13px", color: "#222", fontWeight: "600" }}>{formatDateLabel(extractDateKey(d.dataDisponibilidade))}</div> */}
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1A4FA3" }}>{formatTimeLabel(d.horaInicio)}</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>{tipoAtendimentoLabel(d.statusTipoAtendimento)}</div>
                    <div>
                      <span style={{
                        fontSize: "12px", fontWeight: "600", borderRadius: "20px", padding: "3px 12px",
                        background: disponivel ? "#E8F5EE" : "#FFF7E6",
                        color: disponivel ? "#2A8A55" : "#B5790B",
                        marginLeft: "-10px"
                      }}>
                        {statusDisponibilidadeLabel(d.statusDisponibilidade)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {podeGerenciar ? (
                        <button
                          onClick={() => setConfirmTarget(d)}
                          disabled={excluindoId === d.id}
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 14px", background: "#FFF0F0", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#B03A2E", cursor: excluindoId === d.id ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: excluindoId === d.id ? 0.6 : 1, marginLeft: "-10px" }}
                          onMouseEnter={e => { if (excluindoId !== d.id) e.currentTarget.style.background = "#ffdede"; }}
                          onMouseLeave={e => e.currentTarget.style.background = "#FFF0F0"}
                        >
                          {excluindoId === d.id ? "Excluindo..." : "Excluir"}
                        </button>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#ccc" }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {psicologoSelecionado && !loadingDisponibilidades && disponibilidades.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#888" }}>
              {disponibilidades.length} {disponibilidades.length === 1 ? "disponibilidade encontrada" : "disponibilidades encontradas"}
            </span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
