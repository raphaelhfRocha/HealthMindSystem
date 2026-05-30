import { useEffect, useState } from "react";
import { getAllPsicologos } from "../services/psicologo.service";
import { PsicologoDTO } from "../types/dtos/Psicologo.dto";

export function usePsicologo(id: string) {
    const [psicologo, setPsicologo] = useState<PsicologoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadPsicologo() {
        setLoading(true);

        try {
            const response = await getAllPsicologos();
            setPsicologo(response.find(item => item.id === id) ?? null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) {
            setPsicologo(null);
            setLoading(false);
            return;
        }

        loadPsicologo();
    }, [id]);

    return {
        psicologo,
        loading,
        reload: loadPsicologo
    };
}