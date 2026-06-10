import { DisponibilidadeDTO } from "../types/dtos/Disponibilidade.dto";
import { api } from "./api";
import { PsicologoDTO } from "../types/dtos/Psicologo.dto";


const controller = "psicologo";

export async function getAllPsicologos(): Promise<PsicologoDTO[]> {
    const response = await api.get<PsicologoDTO[]>(controller);
    return response.data;
}

export async function getPsicologoById(psicologoId: string): Promise<PsicologoDTO> {
    const response = await api.get<Psicologo>(`${controller}/${psicologoId}`);
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


export async function adicionarDisponibilidade(psicologo: PsicologoDTO, disponibilidade: DisponibilidadeDTO): Promise<void> {
    // O back-end adiciona novas disponibilidades através do PUT do psicólogo,
    // recebendo-as no campo disponibilidadesDTO.
    const response = await api.put<void>(`${controller}/${psicologo.id}`, {
        ...psicologo,
        disponibilidadesDTO: [disponibilidade],
    });
    return response.data;
}

export async function excluirDisponibilidade(psicologoId: string, disponibilidadeId: string): Promise<void> {
    const response = await api.delete<void>(`${controller}/${psicologoId}/disponibilidades/${disponibilidadeId}`);
    return response.data;
}
