import { DisponibilidadeDTO } from "../types/dtos/Disponibilidade.dto";
import { api } from "./api";
import { PsicologoDTO } from "../types/dtos/Psicologo.dto";


const controller = "psicologo";

export async function getAllPsicologos(): Promise<PsicologoDTO[]> {
    const response = await api.get<PsicologoDTO[]>(controller);
    return response.data;
}

export async function getPsicologosByNome(nome: string): Promise<PsicologoDTO[]> {
    const response = await api.get<PsicologoDTO[]>(`${controller}/nome/${nome}`);
    return response.data;
}

export async function getPsicologosByEspecialidade(especialidade: string): Promise<PsicologoDTO[]> {
    const response = await api.get<PsicologoDTO[]>(`${controller}/especialidade/${especialidade}`);
    return response.data;
}

export async function getDisponibilidadesByPsicologoId(psicologoId: string): Promise<DisponibilidadeDTO[]> {
    const response = await api.get<DisponibilidadeDTO[]>(`${controller}/${psicologoId}/disponibilidades`);
    return response.data;
}


export async function cadastrarPsicologo(psicologoDto: PsicologoDTO): Promise<PsicologoDTO> {
    const response = await api.post<PsicologoDTO>(controller, psicologoDto);
    return response.data;
}

export async function editarPsicologo(psicologoId: string, psicologoDto: PsicologoDTO): Promise<PsicologoDTO> {
    const response = await api.put<PsicologoDTO>(`${controller}/${psicologoId}`, psicologoDto);
    return response.data;
}

export async function excluirDisponibilidade(psicologoId: string, disponibilidadeId: string): Promise<void> {
    const response = await api.delete<void>(`${controller}/${psicologoId}/disponibilidades/${disponibilidadeId}`);
    return response.data;
}
