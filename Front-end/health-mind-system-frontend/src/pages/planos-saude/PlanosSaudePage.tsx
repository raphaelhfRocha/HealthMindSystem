import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getAllPlanosSaude, registrarPlanoSaude } from "../../shared/services/plano-saude.service";
import { StatusPlanoSaudeEnum } from "../../shared/domain/enums/status-plano-saude.enum";
import { PlanoSaudeDTO } from "../../shared/types/dtos/PlanoSaude.dto";
import { CoberturaPlanoDTO } from "../../shared/types/dtos/CoberturaPlano.dto";
import { formatPhone } from "../../shared/utils/formatPhone";
import { Pagination, usePagination } from "../../shared/components/Pagination";

function statusPlanoLabel(status: StatusPlanoSaudeEnum): string {
  const labels: Record<number, string> = {
    [StatusPlanoSaudeEnum.stsNone]: "Indefinido",
    [StatusPlanoSaudeEnum.stsAtivo]: "Ativo",
    [StatusPlanoSaudeEnum.stsInativo]: "Inativo",
  };

  return labels[status] ?? "Indefinido";
}

function ordenarPlanos(lista: PlanoSaudeDTO[]) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
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

type CoberturaForm = { especialidade: string; percentualCobertura: string; valorMaximoCobertura: string };

const coberturaVazia: CoberturaForm = { especialidade: "", percentualCobertura: "", valorMaximoCobertura: "" };

interface ModalPlanoSaudeProps {
  saving: boolean;
  error: string | null;
  onSave: (plano: PlanoSaudeDTO) => void;
  onClose: () => void;
}

function ModalPlanoSaude({ saving, error, onSave, onClose }: ModalPlanoSaudeProps) {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [coberturas, setCoberturas] = useState<CoberturaForm[]>([{ ...coberturaVazia }]);

  function atualizarCobertura(index: number, campo: keyof CoberturaForm, valor: string) {
    setCoberturas(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  }

  function adicionarCobertura() {
    setCoberturas(prev => [...prev, { ...coberturaVazia }]);
  }

  function removerCobertura(index: number) {
    setCoberturas(prev => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coberturasPlanoDTO: CoberturaPlanoDTO[] = coberturas
      .filter(c => c.especialidade.trim())
      .map(c => ({
        especialidade: c.especialidade.trim(),
        percentualCobertura: Number(c.percentualCobertura) || 0,
        valorMaximoCobertura: Number(c.valorMaximoCobertura) || 0,
      }));

    onSave({
      nome: nome.trim(),
      codigo: codigo.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      statusPlanoSaude: StatusPlanoSaudeEnum.stsAtivo,
      coberturasPlanoDTO,
    });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "560px", maxWidth: "92vw", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Novo Plano de Saúde</h2>
          <button type="button" onClick={onClose} disabled={saving} style={{ background: "none", border: "none", cursor: saving ? "not-allowed" : "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={labelStyle}>
            Nome *
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Amil, Unimed..." style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Código *
            <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: ANS 12345" style={inputStyle} required />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={labelStyle}>
            Telefone
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            E-mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@plano.com" style={inputStyle} />
          </label>
        </div>

        <div style={{ borderTop: "1px solid #eef0f6", paddingTop: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#1A4FA3" }}>Coberturas</div>
            <button type="button" onClick={adicionarCobertura} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "#EBF3FF", border: "none", borderRadius: "14px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: "pointer" }}>
              <span style={{ fontSize: "15px", lineHeight: 1 }}>+</span> Adicionar cobertura
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {coberturas.map((c, index) => (
              <div key={index} style={{ border: "1px solid #eef0f6", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", background: "#fbfcff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#888" }}>Cobertura {index + 1}</span>
                  {coberturas.length > 1 && (
                    <button type="button" onClick={() => removerCobertura(index)} title="Remover" style={{ background: "none", border: "none", color: "#B03A2E", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Remover</button>
                  )}
                </div>
                <label style={labelStyle}>
                  Especialidade coberta
                  <input value={c.especialidade} onChange={e => atualizarCobertura(index, "especialidade", e.target.value)} placeholder="Ex: Psicologia Clínica" style={inputStyle} />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label style={labelStyle}>
                    Percentual (%)
                    <input type="number" min="0" max="100" step="1" value={c.percentualCobertura} onChange={e => atualizarCobertura(index, "percentualCobertura", e.target.value)} placeholder="0 a 100" style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Valor máximo (R$)
                    <input type="number" min="0" step="0.01" value={c.valorMaximoCobertura} onChange={e => atualizarCobertura(index, "valorMaximoCobertura", e.target.value)} placeholder="0,00" style={inputStyle} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {saving ? "Salvando..." : "Cadastrar Plano"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PlanosSaudePage() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoSaudeDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function carregarPlanos() {
      try {
        setLoading(true);
        setError(null);

        const dados = await getAllPlanosSaude();
        if (!isActive) return;

        setPlanos(ordenarPlanos(dados));
      } catch {
        if (isActive) {
          setError("Não foi possível carregar os planos de saúde.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    carregarPlanos();

    return () => {
      isActive = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return planos.filter(plano =>
      plano.nome.toLowerCase().includes(termo) ||
      plano.codigo.toLowerCase().includes(termo) ||
      (plano.coberturasPlanoDTO ?? []).some(c => c.especialidade.toLowerCase().includes(termo))
    );
  }, [planos, busca]);

  const { pageItems, page, setPage, totalPages } = usePagination(filtrados, 5, busca);

  async function handleSalvar(plano: PlanoSaudeDTO) {
    try {
      setSalvando(true);
      setErroModal(null);

      const criado = await registrarPlanoSaude(plano);
      setPlanos(prev => ordenarPlanos([...prev, criado ?? plano]));

      setModalAberto(false);
    } catch {
      setErroModal("Não foi possível salvar o plano de saúde. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  const COL = "210px 130px 160px 210px 110px 120px";

  return (
    <AppLayout breadcrumb="Planos de Saúde >">
      {modalAberto && (
        <ModalPlanoSaude
          saving={salvando}
          error={erroModal}
          onSave={handleSalvar}
          onClose={() => { if (!salvando) setModalAberto(false); }}
        />
      )}

      <div style={{ width: "100%", maxWidth: "1080px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>Planos de Saúde atendidos</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome, código ou especialidade..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ height: "36px", border: "1px solid #dde3f0", borderRadius: "20px", padding: "0 14px 0 32px", fontSize: "13px", outline: "none", width: "280px", color: "#333", background: "white" }}
              />
            </div>
            <button
              onClick={() => { setErroModal(null); setModalAberto(true); }}
              style={{ height: "36px", background: "#1A4FA3", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
              Adicionar Plano
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        {/* Table card */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: COL, background: "#1A4FA3", padding: "10px 20px", gap: "12px" }}>
            {["Plano", "Código", "Coberturas", "Contato", "Status", "Ações"].map(h => (
              <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Carregando planos...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "14px" }}>Nenhum plano de saúde encontrado.</div>
          ) : (
            pageItems.map((plano, i) => {
              const rowBg = i % 2 === 0 ? "white" : "#f9fafc";
              const ativo = plano.statusPlanoSaude === StatusPlanoSaudeEnum.stsAtivo;
              const coberturas = plano.coberturasPlanoDTO ?? [];
              return (
                <div
                  key={plano.id ?? `${plano.nome}-${i}`}
                  style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", gap: "12px", alignItems: "center", background: rowBg, borderBottom: "1px solid #eef0f6", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}
                >
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#222" }}>{plano.nome}</div>

                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "600", background: "#EBF3FF", color: "#1A4FA3", borderRadius: "10px", padding: "2px 10px" }}>{plano.codigo || "—"}</span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {coberturas.length === 0
                      ? "—"
                      : `${coberturas.length} ${coberturas.length === 1 ? "cobertura" : "coberturas"}`}
                  </div>

                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {plano.telefone ? <div>{formatPhone(plano.telefone)}</div> : null}
                    {plano.email ? <div style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{plano.email}</div> : null}
                    {!plano.telefone && !plano.email ? "—" : null}
                  </div>

                  <div>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", borderRadius: "20px", padding: "3px 12px",
                      background: ativo ? "#E8F5EE" : "#FFF0F0",
                      color: ativo ? "#2A8A55" : "#B03A2E",
                    }}>
                      {statusPlanoLabel(plano.statusPlanoSaude)}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => plano.id && navigate(`/planos-saude/${plano.id}`)}
                      disabled={!plano.id}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#EBF3FF", border: "none", borderRadius: "16px", fontSize: "12px", fontWeight: "600", color: "#1A4FA3", cursor: plano.id ? "pointer" : "not-allowed", whiteSpace: "nowrap", opacity: plano.id ? 1 : 0.5 }}
                      onMouseEnter={e => { if (plano.id) e.currentTarget.style.background = "#d0e4ff"; }}
                      onMouseLeave={e => e.currentTarget.style.background = "#EBF3FF"}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12 C4 7 8 4 12 4 C16 4 20 7 22 12 C20 17 16 20 12 20 C8 20 4 17 2 12Z" stroke="#1A4FA3" strokeWidth="2" fill="none" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="#1A4FA3" strokeWidth="2" fill="none" />
                      </svg>
                      Visualizar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {filtrados.length} {filtrados.length === 1 ? "plano encontrado" : "planos encontrados"}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AppLayout>
  );
}
