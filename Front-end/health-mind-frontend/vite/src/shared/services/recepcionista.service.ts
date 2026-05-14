import { api } from "./api";
import { RecepcionistaDTO } from "shared/types/dtos/Recepcionista.dto";

export async function getAllRecepcionistas(): Promise<RecepcionistaDTO[]> {
    const response = await api.get<RecepcionistaDTO[]>("recepcionista");
    return response.data;
}

export async function registrarRecepcionista(recepcionistaDto: RecepcionistaDTO): Promise<RecepcionistaDTO> {
    const response = await api.post("recepcionista", recepcionistaDto);
    return response.data;
}

export async function editarRecepcionista(recepcionistaId: string, recepcionistaDto: RecepcionistaDTO): Promise<RecepcionistaDTO> {
    const response = await api.put(`recepcionista/${recepcionistaId}`, recepcionistaDto);
    return response.data;
}

export async function excluirRecepcionista(recepcionistaId: string): Promise<void> {
    const response = await api.delete(`recepcionista/${recepcionistaId}`);
    return response.data;
}
