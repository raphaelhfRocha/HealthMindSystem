import { useEffect, useState } from "react";
import { api } from "../services/api";

export function usePsicologo(id: string) {
    const [psicologo, setPsicologo] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadPsicologo() {
        try {
            const response = await api.get(`/psicologo/${id}`);
            setPsicologo(response.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPsicologo();
    }, [id]);

    return {
        psicologo,
        loading,
        reload: loadPsicologo
    };
}