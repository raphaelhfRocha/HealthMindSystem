import { useState } from "react";
import { api } from "../services/api";

export function useSessao() {
    const [loading, setLoading] = useState(false);

    async function agendarSessao(data: any) {
        setLoading(true);

        try {
            await api.post("/sessao", data);
        } finally {
            setLoading(false);
        }
    }

    return {
        agendarSessao,
        loading
    };
}