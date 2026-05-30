import { useEffect, useState } from "react";
import { api } from "../services/api";

export function usePaciente(id: string) {
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadPaciente() {
        try {
            const response = await api.get(`/paciente/${id}`);
            setPaciente(response.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPaciente();
    }, [id]);

    return {
        paciente,
        loading,
        reload: loadPaciente
    };
}