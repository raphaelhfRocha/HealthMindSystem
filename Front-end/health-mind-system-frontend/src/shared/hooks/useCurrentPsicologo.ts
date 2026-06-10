import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllPsicologos } from "../services/psicologo.service";
import { PsicologoDTO } from "../types/dtos/Psicologo.dto";
import { ROLES } from "../constants/roles";

// O JWT identifica o usuário pelo e-mail. Como o psicólogo possui um registro
// próprio (PsicologoDTO) com id distinto do id de usuário, resolvemos o id do
// psicólogo logado casando o e-mail.
export function findPsicologoByEmail(
    psicologos: PsicologoDTO[],
    email?: string | null
): PsicologoDTO | undefined {
    if (!email) return undefined;
    const alvo = email.trim().toLowerCase();
    return psicologos.find(p => p.email?.trim().toLowerCase() === alvo);
}

export function useCurrentPsicologoId() {
    const { user } = useAuth();
    const isPsicologo = user?.role === ROLES.PSICOLOGO;

    const [psicologoId, setPsicologoId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(isPsicologo);

    useEffect(() => {
        if (!isPsicologo || !user?.email) {
            setPsicologoId(null);
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);

        getAllPsicologos()
            .then(lista => {
                if (!active) return;
                setPsicologoId(findPsicologoByEmail(lista, user.email)?.id ?? null);
            })
            .catch(() => {
                if (active) setPsicologoId(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [isPsicologo, user?.email]);

    return { psicologoId, loading, isPsicologo };
}
