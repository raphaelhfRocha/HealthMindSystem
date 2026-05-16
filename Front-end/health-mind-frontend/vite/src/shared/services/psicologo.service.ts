import { DisponibilidadeDTO } from "shared/types/dtos/Disponibilidade.dto";
import { api } from "./api";
import { PsicologoDTO } from "shared/types/dtos/Psicologo.dto";

export async function getAllPsicologos(): Promise<PsicologoDTO[]> {
    try {
        const response = await api.get<PsicologoDTO[]>("psicologo");
        console.log("[API] Psicologos carregados:", response.data);
        return response.data;
    } catch (error) {
        console.error("[API] Erro ao carregar psicologos:", error);
        throw error;
    }
}

export async function getDisponibilidadesByPsicologoId(psicologoId: string): Promise<DisponibilidadeDTO[]> {
    const response = await api.get<DisponibilidadeDTO[]>(`psicologo/${psicologoId}/disponibilidades`);
    return response.data;
}

export async function registrarPsicologo(psicologoDto: PsicologoDTO): Promise<PsicologoDTO> {
    const response = await api.post("psicologo", psicologoDto);
    return response.data;
}

export async function editarPsicologo(psicologoId: string, psicologoDto: PsicologoDTO): Promise<PsicologoDTO> {
    const response = await api.put(`psicologo/${psicologoId}`, psicologoDto);
    return response.data;
}

export async function excluirDisponibilidade(psicologoId: string, disponibilidadeId: string): Promise<void> {
    const response = await api.delete(`psicologo/${psicologoId}/disponibilidades/${disponibilidadeId}`);
    return response.data;
}
