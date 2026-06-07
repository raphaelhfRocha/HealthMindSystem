import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useRecepcionista(id: string) {
    const [recepcionista, setRecepcionista] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadRecepcionista() {
        try {
            const response = await api.get(`/recepcionista/${id}`);
            setRecepcionista(response.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRecepcionista();
    }, [id]);

    return {
        recepcionista,
        loading,
        reload: loadRecepcionista
    };
}