import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useHistoricoMedico(id: string) {
    const [historicoMedico, setHistoricoMedico] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getAllHistoricosMedicos() {
        try {
            const response = await api.get(`/historico-medico/${id}`);
            setHistoricoMedico(response.data);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        getAllHistoricosMedicos();
    }, [id]);

    return {
        historicoMedico,
        loading,
        reload: getAllHistoricosMedicos
    };
}