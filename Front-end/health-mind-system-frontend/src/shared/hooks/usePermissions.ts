import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

export function usePermissions() {
    const { user } = useAuth();
    const role = user?.role ?? "";

    return {
        role,
        isPsicologo: role === ROLES.PSICOLOGO,
        isRecepcionista: role === ROLES.RECEPCIONISTA,
    };
}
