import { api } from "./api";
import { PsicologoDTO } from "shared/types/dtos/Psicologo.dto";

export async function getAllPsicologos(): Promise<PsicologoDTO[]> {
    const response = await api.get<PsicologoDTO[]>("psicologo");
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