import { ProgressaoDTO } from "shared/types/dtos/Progressao.dto";
import { api } from "./api";

const controller = "progressao";

export async function getAllProgressoes(): Promise<ProgressaoDTO[]> {
    const response = await api.get<ProgressaoDTO[]>(controller);
    return response.data;
}

export async function getProgressoesByProntuarioId(prontuarioId: string): Promise<ProgressaoDTO[]> {
    const response = await api.get<ProgressaoDTO[]>(`${controller}/prontuario/${prontuarioId}`);
    return response.data;
}

export async function registrarProgressao(progressaoDto: ProgressaoDTO): Promise<ProgressaoDTO> {
    const response = await api.post(controller, progressaoDto)
    return response.data;
}

export async function excluirProgressao(progressaoId: string): Promise<void> {
    const response = await api.delete(`${controller}/${progressaoId}`);
    return response.data;
}