import { ProntuarioDTO } from "shared/types/dtos/Prontuario.dto";
import { api } from "./api";

export async function getAllProntuarios(): Promise<ProntuarioDTO[]> {
    const response = await api.get<ProntuarioDTO[]>("prontuario");
    return response.data;
}

export async function registrarProntuario(prontuarioDto: ProntuarioDTO): Promise<ProntuarioDTO> {
    const response = await api.post("prontuario", prontuarioDto);
    return response.data;
}

export async function editarProntuario(prontuarioId: string, prontuarioDto: ProntuarioDTO): Promise<ProntuarioDTO> {
    const response = await api.put(`prontuario/${prontuarioId}`, prontuarioDto);
    return response.data;
}

export async function excluirProntuario(prontuarioId: string): Promise<void> {
    const response = await api.delete(`prontuario/${prontuarioId}`);
    return response.data;
}