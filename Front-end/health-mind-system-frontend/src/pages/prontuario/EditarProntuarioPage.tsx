import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProntuarioById } from "../../shared/services/prontuario.service";

export default function EditarProntuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const prontuario = await getProntuarioById(id);
        if (!active) return;
        navigate(`/paciente/${prontuario.pacienteId}/editar`, { replace: true });
      } catch {
        if (active) {
          setNotFound(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => { active = false; };
  }, [id, navigate]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Carregando editor...</div>;
  }

  if (notFound) {
    return <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Prontuário não encontrado.</div>;
  }

  return <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Redirecionando...</div>;
}
