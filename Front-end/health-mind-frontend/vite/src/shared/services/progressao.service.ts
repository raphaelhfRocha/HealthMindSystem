import { ProgressaoDTO } from "shared/types/dtos/Progressao.dto";
import { api } from "./api";

export async function getAllProgressoes(): Promise<ProgressaoDTO[]> {
    const response = await api.get<ProgressaoDTO[]>("progressao");
    return response.data;
}

export async function getProgressoesByProntuarioId(prontuarioId: string): Promise<ProgressaoDTO[]> {
    const response = await api.get<ProgressaoDTO[]>(`progressao/prontuario/${prontuarioId}`);
    return response.data;
}

export async function registrarProgressao(progressaoDto: ProgressaoDTO): Promise<ProgressaoDTO> {
    const response = await api.post("progressao", progressaoDto)
    return response.data;
}

export async function excluirProgressao(progressaoId: string): Promise<void> {
    const response = await api.delete(`progressao/${progressaoId}`);
    return response.data;
}