import { EscalaSessaoDTO } from "../types/dtos/EscalaSessao.dto";
import { RegistroSessaoDTO } from "../types/dtos/RegistroSessao.dto";
import { api } from "./api";
import { SessaoDTO } from "shared/types/dtos/Sessao.dto";


const controller = "sessao";
const controllerSessaoPsicologo = "sessao/psicologo";

export async function getAllSessoes(): Promise<SessaoDTO[]> {
    const response = await api.get<SessaoDTO[]>(controller);
    return response.data;
}

export async function getSessoesByPsicologoId(psicologoId: string): Promise<SessaoDTO[]> {
    const response = await api.get<SessaoDTO[]>(`${controllerSessaoPsicologo}/${psicologoId}`);
    return response.data;
}

export async function getSessaoById(sessaoId: string): Promise<SessaoDTO> {
    const response = await api.get<SessaoDTO>(`${controller}/${sessaoId}`);
    return response.data;
}

export async function agendarSessao(sessaoDto: SessaoDTO): Promise<SessaoDTO> {
    const response = await api.post(controller, sessaoDto);
    return response.data;
}

export async function adicionarRegistroSessao(sessaoId: string, registroSessaoDto: RegistroSessaoDTO): Promise<RegistroSessaoDTO> {
    const response = await api.post(`${controller}/${sessaoId}/registros-sessoes`, registroSessaoDto);
    return response.data;
}

export async function adicionarEscalaSessao(sessaoId: string, escalaSessaoDto: EscalaSessaoDTO): Promise<EscalaSessaoDTO> {
    const response = await api.post(`${controller}/${sessaoId}/escalas-sessoes`, escalaSessaoDto);
    return response.data;
}

export async function alterarSessao(sessaoId: string, sessaoDto: SessaoDTO): Promise<SessaoDTO> {
    const response = await api.put(`${controller}/${sessaoId}`, sessaoDto);
    return response.data;
}

export async function alterarRegistroSessao(registroSessaoId: string, sessaoId: string, registroSessaoDto: RegistroSessaoDTO): Promise<RegistroSessaoDTO> {
    const response = await api.put(`${controller}/${sessaoId}/registros-sessoes/${registroSessaoId}`, registroSessaoDto);
    return response.data;
}

export async function alterarEscalaSessao(escalaSessaoId: string, sessaoId: string, escalaSessaoDto: EscalaSessaoDTO): Promise<EscalaSessaoDTO> {
    const response = await api.put(`${controller}/${sessaoId}/escalas-sessoes/${escalaSessaoId}`, escalaSessaoDto);
    return response.data;
}

export async function excluirPagamentoSessao(sessaoId: string): Promise<void> {
    const response = await api.delete(`${controller}/${sessaoId}`);
    return response.data;
}