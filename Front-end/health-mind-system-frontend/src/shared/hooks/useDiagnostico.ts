import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useDignostico(id: string) {
    const [diagnostico, setDiagnostico] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadDiagnostico() {
        try {
            const response = await api.get(`/diagnostico/${id}`);
            setDiagnostico(response.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDiagnostico();
    }, [id]);

    return {
        diagnostico,
        loading,
        reload: loadDiagnostico
    };
}