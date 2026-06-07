import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import SearchEnderecoByCEP from "../../shared/components/SearchEnderecoByCEP/SearchEnderecoByCEP";
import { editarProntuario, getProntuarioById } from "../../shared/services/prontuario.service";
import { ContatoEmergenciaDTO } from "../../shared/types/dtos/ContatoEmergencia.dto";
import { EnderecoDTO } from "../../shared/types/dtos/Endereco.dto";
import { ProntuarioDTO } from "../../shared/types/dtos/Prontuario.dto";

type FormData = {
  nome: string;
  telefone: string;
  relacaoParentesco: string;
  enderecoDTO: EnderecoDTO;
};

const EMPTY_ENDERECO: EnderecoDTO = {
  cep: "",
  logradouro: "",
  complemento: "",
  bairro: "",
  uf: "",
  localidade: "",
  regiao: "",
};

const inputStyle = {
  width: "100%", height: "38px", border: "1px solid #dde3f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "14px", color: "#1a1a1a", outline: "none",
  background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
};

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = "#1A4FA3"}
        onBlur={e => e.target.style.borderColor = "#dde3f0"}
      />
    </div>
  );
}

export default function EditarContatoEmergenciaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prontuario, setProntuario] = useState<ProntuarioDTO | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        setError("Prontuário não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const prontuarioCarregado = await getProntuarioById(id);
        if (!active) return;

        setProntuario(prontuarioCarregado);
        setForm({
          nome: prontuarioCarregado.contatoEmergenciaDTO?.nome ?? "",
          telefone: prontuarioCarregado.contatoEmergenciaDTO?.telefone ?? "",
          relacaoParentesco: prontuarioCarregado.contatoEmergenciaDTO?.relacaoParentesco ?? "",
          enderecoDTO: prontuarioCarregado.contatoEmergenciaDTO?.enderecoDTO ?? { ...EMPTY_ENDERECO },
        });
      } catch {
        if (active) {
          setError("Contato não encontrado.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    if (!prontuario || !form) return;

    try {
      setSaved(false);
      const payload: ProntuarioDTO = {
        ...prontuario,
        contatoEmergenciaDTO: {
          prontuarioId: prontuario.id ?? "",
          nome: form.nome,
          telefone: form.telefone,
          relacaoParentesco: form.relacaoParentesco,
          enderecoDTO: form.enderecoDTO,
        },
      };

      await editarProntuario(prontuario.id ?? id ?? "", payload);
      setSaved(true);
      setTimeout(() => navigate(`/prontuario/${prontuario.id ?? id}`), 1200);
    } catch {
      setError("Não foi possível salvar o contato de emergência.");
    }
  };

  if (loading) {
    return (
      <AppLayout breadcrumb="Prontuário > Editar Contato">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Carregando contato...</div>
      </AppLayout>
    );
  }

  if (!prontuario || !form) {
    return (
      <AppLayout breadcrumb="Prontuário > Editar Contato">
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>{error ?? "Contato não encontrado."}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb="Prontuário > Editar Contato de Emergência">
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(`/prontuario/${prontuario.id ?? id}`)}
              style={{ background: "none", border: "1px solid #dde3f0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#1A4FA3", fontWeight: "600" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              ‹ Cancelar
            </button>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: 0 }}>
              Editar — Contato de Emergência
            </h1>
          </div>

          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: saved ? "#3BB077" : "#1A4FA3", border: "none", borderRadius: "20px",
              padding: "9px 22px", color: "white", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "background 0.3s",
            }}
          >
            {saved
              ? "✓ Salvo!"
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Salvar</>
            }
          </button>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#fff5f5", border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: "14px", padding: "24px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "20px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>
            Contato de Emergência
          </h2>

          {/* Row 1: nome, telefone, relação */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
            <Field label="Nome" value={form.nome} onChange={val => setForm(current => current ? { ...current, nome: val } : current)} />
            <Field label="Telefone" value={form.telefone} onChange={val => setForm(current => current ? { ...current, telefone: val } : current)} type="tel" />
            <Field label="Relação/Parentesco" value={form.relacaoParentesco} onChange={val => setForm(current => current ? { ...current, relacaoParentesco: val } : current)} />
          </div>

          <div style={{ borderTop: "1px solid #eef0f6" }} />

          {/* Row 2: endereço, cep */}
          <SearchEnderecoByCEP
            value={form.enderecoDTO}
            onChangeEndereco={(endereco: EnderecoDTO) => setForm(current => current ? { ...current, enderecoDTO: endereco } : current)}
            inputStyle={{ width: "100%", height: "38px", border: "1px solid #dde3f0", borderRadius: "8px", padding: "0 12px", fontSize: "14px", color: "#1a1a1a", outline: "none", background: "white", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>
      </div>
    </AppLayout>
  );
}