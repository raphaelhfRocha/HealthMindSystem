import { ProntuarioDTO } from "shared/types/dtos/Prontuario.dto";
import { api } from "./api";


const controller = "prontuario";

export async function getAllProntuarios(): Promise<ProntuarioDTO[]> {
    const response = await api.get<ProntuarioDTO[]>(controller);
    return response.data;
}

export async function registrarProntuario(prontuarioDto: ProntuarioDTO): Promise<ProntuarioDTO> {
    const response = await api.post(controller, prontuarioDto);
    return response.data;
}

export async function editarProntuario(prontuarioId: string, prontuarioDto: ProntuarioDTO): Promise<ProntuarioDTO> {
    const response = await api.put(`${controller}/${prontuarioId}`, prontuarioDto);
    return response.data;
}

export async function excluirMedicamento(prontuarioId: string, medicamentoId: string): Promise<void> {
    const response = await api.delete(`${controller}/${prontuarioId}/medicamentos/${medicamentoId}`);
    return response.data;
}