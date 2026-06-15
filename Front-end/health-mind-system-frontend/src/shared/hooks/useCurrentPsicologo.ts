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

// Resolve o registro do psicólogo logado de forma robusta. O id do JWT
// (NameIdentifier) é o id do usuário de autenticação, que o psicólogo guarda em
// `usuarioId`. Resolvemos por esse vínculo — confiável — e usamos id direto e
// e-mail apenas como fallback. Casar só por e-mail é frágil (e-mail divergente
// entre login e cadastro deixa a lista vazia).
export function findPsicologoLogado(
    psicologos: PsicologoDTO[],
    user?: { id?: string | null; email?: string | null } | null
): PsicologoDTO | undefined {
    if (!user) return undefined;
    return (
        (user.id ? psicologos.find(p => p.usuarioId === user.id) : undefined) ??
        (user.id ? psicologos.find(p => p.id === user.id) : undefined) ??
        findPsicologoByEmail(psicologos, user.email)
    );
}

export function useCurrentPsicologoId() {
    const { user } = useAuth();
    const isPsicologo = user?.role === ROLES.PSICOLOGO;

    const [psicologoId, setPsicologoId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(isPsicologo);

    useEffect(() => {
        if (!isPsicologo || !user) {
            setPsicologoId(null);
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);

        getAllPsicologos()
            .then(lista => {
                if (!active) return;
                // Resolve por usuarioId (vínculo confiável); e-mail é só fallback.
                // Psicólogos são cadastrados sem e-mail no registro, então casar
                // apenas por e-mail deixaria a lista de agendamentos vazia.
                setPsicologoId(findPsicologoLogado(lista, user)?.id ?? null);
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
    }, [isPsicologo, user?.id, user?.email]);

    return { psicologoId, loading, isPsicologo };
}
