import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useProgressao(id: string) {
    const [progressao, setProgressao] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadProgressao() {
        try {
            const response = await api.get(`/progressao/${id}`);
            setProgressao(response.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProgressao();
    }, [id]);

    return {
        progressao,
        loading,
        reload: loadProgressao
    };
}