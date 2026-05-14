import { api } from "./api";
import { SessaoDTO } from "shared/types/dtos/Sessao.dto";

export async function getAllSessoes(): Promise<SessaoDTO[]> {
    const response = await api.get<SessaoDTO[]>("sessao");
    return response.data;
}

export async function getSessoesByPsicologoId(psicologoId: string): Promise<SessaoDTO[]> {
    const response = await api.get<SessaoDTO[]>(`sessao/psicologo/${psicologoId}`);
    return response.data;
}

export async function getSessaoById(sessaoId: string): Promise<SessaoDTO> {
    const response = await api.get<SessaoDTO>(`sessao/${sessaoId}`);
    return response.data;
}

export async function agendarSessao(sessaoDto: SessaoDTO): Promise<SessaoDTO> {
    const response = await api.post("sessao", sessaoDto);
    return response.data;
}

export async function alterarSessao(sessaoId: string, sessaoDto: SessaoDTO): Promise<SessaoDTO> {
    const response = await api.put(`sessao/${sessaoId}`, sessaoDto);
    return response.data;
}

export async function excluirPagamentoSessao(sessaoId: string): Promise<void> {
    const response = await api.delete(`sessao/${sessaoId}`);
    return response.data;
}